const pool = require('../util/database');
/*-------------------------------------------------*/

/*-------------------------------------------------*/
module.exports = class Data{
    constructor(){}
    save(){}
    /***************** Check exist table **************/
    //Check existing table
    static exist_Table(table_name) {
        const q = `SELECT EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'appdb' AND table_name = '${table_name}') AS tableExists`;
        return pool.query(q);
    }

    //Show tables in the database
    static tables_names(table_name){
        const q = `SHOW TABLES FROM appdb LIKE '${table_name}'`;
        return pool.query(q);
    }

    /***************** Check exist table **************/
    /*-----------------> check credorex table <---------------------------*/
    //to check the data in the table or not ...
    static exist_data_table(table_name,column_title,item){
        
        const q = `SELECT * FROM appdb.${table_name} WHERE ${column_title} = '${item}';`;
        return pool.query(q);
    }


    /***************** Delete Table *******************/
    //to delete table from database
    static deleteTable(table_name){
        const q = `DROP TABLE ${table_name};`;
        return pool.query(q);
    }

    /***************** Cp ************************/

    //create table cp _ credorax
    static createTable_cp_checkout(){
        const q = "CREATE TABLE cp_checkout (id INT UNSIGNED NOT NULL AUTO_INCREMENT,ID_trans VARCHAR(20),sDate VARCHAR(20),rDate VARCHAR(50),Status VARCHAR(50),Paid VARCHAR(45),pCrn VARCHAR(45),Received VARCHAR(50),rCrn VARCHAR(50),Processor VARCHAR(50),Pay_out_agent VARCHAR(25),PID VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    


    /***************** Create table  ************************/
    
    //Create checkout table
    static createTable_checkout(){
        const q = "CREATE TABLE appdb.checkout (id INT UNSIGNED NOT NULL AUTO_INCREMENT,Processing_Channel_ID VARCHAR(250) ,action_type VARCHAR(75) ,processed_on VARCHAR(75),processed_currency VARCHAR(20),fx_rate_applied VARCHAR(25), holding_currency VARCHAR(25),reference_id VARCHAR(50),payment_method VARCHAR(25),card_type VARCHAR(25),breakdown_type VARCHAR(75),processing_curryncy_amount VARCHAR(75),holding_currency_amount VARCHAR(75),statementDate VARCHAR(75),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

   
    //Create checkout_index
    static createTable_checkout_index(){
        const q = "CREATE TABLE appdb.checkout_index (id INT UNSIGNED NOT NULL AUTO_INCREMENT,Processing_Channel_ID VARCHAR(250),action_type VARCHAR(75) ,processed_on VARCHAR(75),processed_currency VARCHAR(20),fx_rate_applied VARCHAR(25), holding_currency VARCHAR(25),reference_id VARCHAR(50),payment_method VARCHAR(25),card_type VARCHAR(25),breakdown_type VARCHAR(75),processing_curryncy_amount VARCHAR(75),holding_currency_amount VARCHAR(75),statementDate VARCHAR(75),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    
    



    /************************ Reconcilitaion Credorax ************************/



    //Insert data recon in the database
    /*
    static reconciliation_credorex(){
        const q1 = "INSERT INTO appdb.recon_credorex (statement_date,ID_system,amount_system,currency_system, posting_date_system) SELECT statement_date,merchant_reference_number_h9, transaction_amount,transaction_currency,posting_date FROM appdb.credorex LEFT JOIN appdb.cp_credorex ON appdb.cp_credorex.ID_trans = appdb.credorex.merchant_reference_number_h9 AND appdb.cp_credorex.Paid = appdb.credorex.transaction_amount AND appdb.cp_credorex.pCrn = appdb.credorex.transaction_currency WHERE appdb.cp_credorex.ID_trans IS NULL; ";
        const q2 = "INSERT INTO appdb.recon_credorex (statement_date,ID_processor,amount_processor,currency_processor, posting_date_processor,status) SELECT sDate,ID_trans,Paid,pCrn,rDate,Status FROM appdb.cp_credorex LEFT JOIN appdb.credorex ON appdb.credorex.merchant_reference_number_h9 = appdb.cp_credorex.ID_trans AND appdb.credorex.transaction_amount = appdb.cp_credorex.Paid  AND appdb.credorex.transaction_currency = appdb.cp_credorex.pCrn WHERE appdb.credorex.merchant_reference_number_h9 IS NULL;";
        return pool.query(q1).then(()=>{
            pool.query(q2);
        });
    }
    */
    //--------------------------------> plan 2
    //--------------------------------> create recon tables <-------------------------------(1)
    //----------------------------> Checkout recon tables <--------------------------------//
    static reconciliation_table_processor(){
        const q="CREATE TABLE appdb.checkout_recon (id INT UNSIGNED NOT NULL AUTO_INCREMENT,Processing_Channel_ID VARCHAR(250),action_type VARCHAR(75) ,processed_on VARCHAR(75),processed_currency VARCHAR(20),fx_rate_applied VARCHAR(25), holding_currency VARCHAR(25),reference_id VARCHAR(50),payment_method VARCHAR(25),card_type VARCHAR(25),breakdown_type VARCHAR(75),processing_curryncy_amount VARCHAR(75),holding_currency_amount VARCHAR(75),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    static reconciliation_table_system(){
        const q ="CREATE TABLE appdb.system_recon_checkout (id INT UNSIGNED NOT NULL AUTO_INCREMENT,ID_trans VARCHAR(20),sDate VARCHAR(20),rDate VARCHAR(50),Status VARCHAR(50),Paid VARCHAR(45),pCrn VARCHAR(45),Received VARCHAR(50),rCrn VARCHAR(50),Processor VARCHAR(50),Pay_out_agent VARCHAR(25),PID VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    //------------------------------>copy data to recon and clear source tables ------------(2)
    static copy_data_to_recon_tbl(table_name, table_source,columns){
        switch (table_source) {
            case 'checkout':
                const q1 = `INSERT INTO appdb.${table_name} (${columns[0]}, ${columns[1]},${columns[2]}, ${columns[3]}, ${columns[4]},${columns[5]}, ${columns[6]},${columns[7]}, ${columns[8]},${columns[9]}, ${columns[10]}, ${columns[11]}) SELECT Processing_Channel_ID, action_type,processed_on,processed_currency,fx_rate_applied,holding_currency,reference_id,payment_method,card_type,breakdown_type,processing_curryncy_amount,holding_currency_amount FROM appdb.${table_source} WHERE NOT EXISTS (SELECT 1 FROM ${table_name} WHERE ${table_name}.Processing_Channel_ID = ${table_source}.Processing_Channel_ID);`;
                return pool.query(q1);
            case 'cp_checkout':
                const q2 = `INSERT INTO appdb.${table_name} (${columns[0]}, ${columns[1]},${columns[2]}, ${columns[3]}, ${columns[4]},${columns[5]}, ${columns[6]},${columns[7]}, ${columns[8]},${columns[9]}, ${columns[10]}) SELECT ID_trans, sDate,rDate,Status,Paid,pCrn,Received,rCrn,Processor,Pay_out_agent,PID FROM appdb.${table_source} WHERE NOT EXISTS (SELECT 1 FROM ${table_name} WHERE ${table_name}.sDate = ${table_source}.sDate);`;
                return pool.query(q2); 
            default:
                return
        }
    }

    //------------------------------> reconciliation between recon tables ------------------(3)
    /*====================> (a) activate when reconciliation between processor_recon and system_recon when insert new data from credorx_cp.*/
    static reconciliation_process_with_system_recon(){
        const q1 = `SET SQL_SAFE_UPDATES = 0;`;
        const q2 = `DELETE FROM appdb.checkout_recon WHERE (reference_id, processing_curryncy_amount) IN (SELECT ID_trans, Paid FROM (SELECT t1.reference_id AS ID_trans, t1.processing_curryncy_amount AS Paid FROM appdb.checkout_recon t1 INNER JOIN appdb.system_recon_checkout t2 ON t1.reference_id = t2.ID_trans AND CAST(t1.processing_curryncy_amount AS FLOAT) = CAST(t2.Paid AS FLOAT)) AS subquery);`;
        const q3 = `SET SQL_SAFE_UPDATES = 0;`;
        const q4 = `DELETE FROM appdb.system_recon_checkout WHERE (ID_trans, Paid) IN (SELECT reference_id, processing_curryncy_amount FROM (SELECT t2.ID_trans AS reference_id, t2.Paid AS processing_curryncy_amount FROM appdb.system_recon_checkout t2 INNER JOIN appdb.checkout t1 ON t2.ID_trans = t1.reference_id AND CAST(t2.Paid AS FLOAT) = CAST(t1.processing_curryncy_amount AS FLOAT)) AS subquery);`;
        const q5 = `SET SQL_SAFE_UPDATES = 0;`;
        const q6 = `DELETE FROM appdb.system_recon_checkout WHERE (ID_trans, Paid) IN (SELECT reference_id, processing_curryncy_amount FROM (SELECT t2.ID_trans AS reference_id, t2.Paid AS processing_curryncy_amount FROM appdb.system_recon_checkout t2 INNER JOIN appdb.checkout_index t1 ON t2.ID_trans = t1.reference_id AND CAST(t2.Paid AS FLOAT) = CAST(t1.processing_curryncy_amount AS FLOAT)) AS subquery);`;
        const q7 = `SET SQL_SAFE_UPDATES = 1;`;
        return pool.query(q1)
        .then(()=>{
            pool.query(q2)
            .then(()=>{
                pool.query(q3)
                .then(()=>{
                    pool.query(q4)
                    .then(()=>{
                        pool.query(q5)
                        .then(()=>{
                            pool.query(q6)
                            .then(()=>{
                                pool.query(q7);
                            });
                        });
                    });
                });
            });
        })
        
        
    }
    /*====================> (b) activate when reconciliation between credorx and system_recon when insert new data from credorex.*/
    
    
    //------------------------------> trans data to debit database and accounting system ---------------------------(4)
    
    /*====================| to update debit table */
    /*====================> if data from system_recon exist in debit table return nothing.*/
    /*====================> if there are data not exist in system_recon and exist in debit table delete from debit table.*/
    /*====================> if there are data not exist in debit table and exist in system_recon insert to debit table.*/

    /*====================> get recon system & processor */
    static get_table(table_name){
        const q =`SELECT * FROM appdb.${table_name};`;
        return pool.query(q);
    }
    //------------------------------->End


    /************************ Reconcilitaion Credorax ************************/

    //------------------------------->End


    //Get recon data under condition
    static get_reconciliation_condition(table_name, condetion){
        const q = `SELECT * FROM appdb.${table_name} WHERE ${condetion};`;
        return pool.query(q);
    }
    

    //Delete recon row under condition
    static delete_row_reconciliation_match(table_name, condetion){
        const q1 = 'SET SQL_SAFE_UPDATES = 0;';
        const q2 = `DELETE FROM ${table_name} WHERE ${condetion}`;
        const q3 = 'SET SQL_SAFE_UPDATES = 1;';
        return pool.query(q1)
        .then(()=>{
            pool.query(q2).then(()=>{
                pool.query(q3);
            }).catch(error => console.log(error));
        })
        .catch(error =>{
            console.log(error);
        }); 
    };




    /************************ Get Data from database ************************/
/* updated 11-6-2024*/
    static register_in_table(table_name, table_source,columns){
        if(table_source === 'checkout'){
            //const date = `SELECT processed_on FROM appdb.${table_source} ORDER BY id LIMIT 1;`
            //const q_2 = `INSERT INTO appdb.checkout_index (breakdown_type, processing_curryncy_amount,processed_on,Processing_Channel_ID) SELECT 'payment', (SELECT COALESCE(SUM(CAST(processing_curryncy_amount AS FLOAT)),0) FROM appdb.${table_name} WHERE breakdown_type = 'Capture')+(SELECT COALESCE(SUM(CAST(processing_curryncy_amount AS FLOAT)), 0) FROM appdb.${table_name} WHERE breakdown_type LIKE '%Fee'), (SELECT processed_on FROM appdb.${table_name} ORDER BY processed_on DESC LIMIT 1),(SELECT Processing_Channel_ID FROM appdb.${table_name} WHERE action_type = 'Capture' LIMIT 1)`;
            //const q_2 = `INSERT INTO appdb.checkout_index (breakdown_type,processed_currency, holding_currency_amount,processed_on) SELECT 'payment',(SELECT processed_currency FROM appdb.${table_source} WHERE breakdown_type = 'Capture' LIMIT 1) , (SELECT COALESCE(SUM(CAST(holding_currency_amount AS FLOAT)),0) FROM appdb.${table_name} WHERE breakdown_type = 'Capture')+(SELECT COALESCE(SUM(CAST(holding_currency_amount AS FLOAT)), 0) FROM appdb.${table_name} WHERE breakdown_type LIKE '%Fee'), (SELECT processed_on FROM appdb.${table_name} ORDER BY processed_on DESC LIMIT 1)`;
            const q = `INSERT INTO appdb.${table_name} (${columns[0]}, ${columns[1]},${columns[2]}, ${columns[3]}, ${columns[4]},${columns[5]}, ${columns[6]},${columns[7]}, ${columns[8]},${columns[9]}, ${columns[10]}, ${columns[11]}, ${columns[12]}) SELECT Processing_Channel_ID,action_type,processed_on,processed_currency,fx_rate_applied,holding_currency,reference_id,payment_method,card_type,breakdown_type,processing_curryncy_amount,holding_currency_amount,statementDate FROM appdb.${table_source} WHERE NOT EXISTS (SELECT 1 FROM appdb.${table_name} WHERE appdb.${table_name}.processed_on = appdb.${table_source}.processed_on);`;
            console.log(q);
            return pool.query(q).then(res =>{
                console.log(res);
            })
            /*
            .then(async(result)=>{

                return pool.query(date).then(result =>{
                    //let processedDate = result[0][0]['processed_on'];
                    //const q = `UPDATE appdb.checkout_index SET statementDate = ${processedDate};`;
                })
                //console.log(result[0][0]['processed_on']);
                
                 
            })*/;
        }         
    }

    //Get payment
    static get_payment_processor(table_name, payment_column, term){
        const q = `SELECT * FROM ${table_name} WHERE ${ payment_column } = "${ term }";`;
        return pool.query(q);
    }

    //Get sum
    static get_sum(table_name,column,column_title_condition, item_condition, column_curr, item_curr){
        const q = `SELECT SUM(${column}) AS total_sum FROM ${table_name} WHERE ${column_title_condition} = "${item_condition}" AND ${column_curr} = "${item_curr}";`
        return pool.query(q);
    }

    static get_sum_recon(table_name,column, column_curr, item_curr){
        const q = `SELECT SUM(${column}) AS total_sum FROM ${table_name} WHERE ${column_curr} = "${item_curr}";`
        return pool.query(q);
    }
    
    static get_sum_fees(table_name, column, column_curr,curr){
        const q = `SELECT SUM(${column}) AS total_sum FROM ${table_name} WHERE ${column_curr} = "${curr}";`;
        return pool.query(q);
    }

    static get_record_statement(table_name, column_id, id ,column_curr, curr){
        //const q = `SELECT * FROM appdb.${table_name} WHERE ${column_id}="${id}"`;
        //const q = `SELECT * FROM appdb.${table_name}`;
        const q = `SELECT * FROM appdb.checkout_index;`;
        return pool.query(q);
    }

    /************************ remove data from table **************************/

    //Delete all data (clear) in table
    static deleteAllData(table_name){
        const q1 = 'SET SQL_SAFE_UPDATES = 0;';
        const q2 = `DELETE FROM ${table_name};`;
        const q3 = 'SET SQL_SAFE_UPDATES = 1;';
        return pool.query(q1)
        .then(()=>{
            pool.query(q2)
            .then(()=>{
                pool.query(q3);
            }).catch(error => console.log(error));
        })
        .catch(error =>{
            console.log(error);
        }); 
        
    }



    /************************ Search *********************************/
    //Searching
    static searching(table_name, column, item, column_id, item_id){
       
        const q =`SELECT * FROM ${table_name} WHERE ${column} = ${item} OR ${column_id} = ${item_id};`;
        return pool.query(q);
    }

    /************************ Table count ***************************/

    //--------------------------------------------------------------------------------------------------------------------------->


    /************************* Lists *******************************/
    static feesList(table_name){
        const q =`SELECT * FROM appdb.${table_name} WHERE breakdown_type LIKE '%Fee%' OR breakdown_type LIKE '%fee%' OR breakdown_type LIKE '%FEE%';`;
        return pool.query(q);
    }

    static refundList(table_name){
        const q =`SELECT * FROM appdb.${table_name} WHERE breakdown_type = 'refund' OR breakdown_type = 'Refund' OR breakdown_type = 'REFUND';`;
        return pool.query(q);
    }

    
}
