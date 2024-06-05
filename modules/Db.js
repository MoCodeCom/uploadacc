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
        const q = `SELECT * FROM ${table_name} WHERE ${column_title} = '${item}';`;
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
    static createTable_cp_credorax(){
        const q = "CREATE TABLE cp_credorex (id INT UNSIGNED NOT NULL AUTO_INCREMENT,ID_trans VARCHAR(20),sDate VARCHAR(20),rDate VARCHAR(50),Status VARCHAR(50),Paid VARCHAR(45),pCrn VARCHAR(45),Received VARCHAR(50),rCrn VARCHAR(50),Processor VARCHAR(50),Pay_out_agent VARCHAR(25),PID VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    


    /***************** Credorx ************************/

    //Create credorex table
    static createTable_credorex(){
        const q = "CREATE TABLE credorex (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20) ,transaction_date VARCHAR(20),posting_date VARCHAR(20) ,transaction_currency VARCHAR(50),cs_settlement_currency VARCHAR(50)  ,transaction_amount VARCHAR(45),transaction_type VARCHAR(150) ,fixed_transaction_fee VARCHAR(45) ,discount_rate VARCHAR(50),interchange VARCHAR(50),card_scheme_fees VARCHAR(50),acquiring_fee VARCHAR(50),net_activity VARCHAR(50),card_scheme VARCHAR(50), merchant_reference_number_h9 VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    //Create credorex_index
    static createTable_credorex_index(){
        const q = "CREATE TABLE credorex_index (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20) ,transaction_date VARCHAR(75),posting_date VARCHAR(75) ,transaction_currency VARCHAR(50),cs_settlement_currency VARCHAR(50) ,transaction_amount VARCHAR(45),transaction_type VARCHAR(150) ,fixed_transaction_fee VARCHAR(45) ,discount_rate VARCHAR(50),interchange VARCHAR(50),card_scheme_fees VARCHAR(50),acquiring_fee VARCHAR(50),net_activity VARCHAR(50),card_scheme VARCHAR(50), merchant_reference_number_h9 VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

   
    



    /************************ Reconcilitaion ************************/

    //Create recon_credorex table
    static createTable_recon_credorex(){
        const q = "CREATE TABLE recon_credorex (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20),ID_system VARCHAR(20) ,ID_processor VARCHAR(20),amount_system VARCHAR(20),currency_system VARCHAR(10) ,amount_processor VARCHAR(20),currency_processor VARCHAR(10),status VARCHAR(10),posting_date_system VARCHAR(50),posting_date_processor VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    //Insert data recon in the database
    static reconciliation_credorex(){
        const q1 = "INSERT INTO appdb.recon_credorex (statement_date,ID_system,amount_system,currency_system, posting_date_system) SELECT statement_date,merchant_reference_number_h9, transaction_amount,transaction_currency,posting_date FROM appdb.credorex LEFT JOIN appdb.cp_credorex ON appdb.cp_credorex.ID_trans = appdb.credorex.merchant_reference_number_h9 AND appdb.cp_credorex.Paid = appdb.credorex.transaction_amount AND appdb.cp_credorex.pCrn = appdb.credorex.transaction_currency WHERE appdb.cp_credorex.ID_trans IS NULL; ";
        const q2 = "INSERT INTO appdb.recon_credorex (statement_date,ID_processor,amount_processor,currency_processor, posting_date_processor,status) SELECT sDate,ID_trans,Paid,pCrn,rDate,Status FROM appdb.cp_credorex LEFT JOIN appdb.credorex ON appdb.credorex.merchant_reference_number_h9 = appdb.cp_credorex.ID_trans AND appdb.credorex.transaction_amount = appdb.cp_credorex.Paid  AND appdb.credorex.transaction_currency = appdb.cp_credorex.pCrn WHERE appdb.credorex.merchant_reference_number_h9 IS NULL;";
        return pool.query(q1).then(()=>{
            pool.query(q2);
        });
    }
    //--------------------------------> plan 2
    //--------------------------------> create tables -------------------------------(1)
    static reconciliation_table_processor(){
        const q=`CREATE TABLE credorex_recon (id INT UNSIGNED NOT NULL AUTO_INCREMENT,statement_date VARCHAR(20) ,transaction_date VARCHAR(20),posting_date VARCHAR(20) ,transaction_currency VARCHAR(50),cs_settlement_currency VARCHAR(50)  ,transaction_amount VARCHAR(45),transaction_type VARCHAR(150) ,fixed_transaction_fee VARCHAR(45) ,discount_rate VARCHAR(50),interchange VARCHAR(50),card_scheme_fees VARCHAR(50),acquiring_fee VARCHAR(50),net_activity VARCHAR(50),card_scheme VARCHAR(50), merchant_reference_number_h9 VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);`;
        return pool.query(q);
    }

    static reconciliation_table_system(){
        const q ="CREATE TABLE system_recon (id INT UNSIGNED NOT NULL AUTO_INCREMENT,ID_trans VARCHAR(20),sDate VARCHAR(20),rDate VARCHAR(50),Status VARCHAR(50),Paid VARCHAR(45),pCrn VARCHAR(45),Received VARCHAR(50),rCrn VARCHAR(50),Processor VARCHAR(50),Pay_out_agent VARCHAR(25),PID VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    //------------------------------>copy data to recon and clear source tables ------------(2)
    static copy_data_to_recon_tbl(table_name, table_source,columns){

        switch (table_source) {
            case 'credorex':
                const q1 = `INSERT INTO appdb.${table_name} (${columns[0]}, ${columns[1]},${columns[2]}, ${columns[3]}, ${columns[4]},${columns[5]}, ${columns[6]},${columns[7]}, ${columns[8]},${columns[9]}, ${columns[10]}, ${columns[11]},${columns[12]}, ${columns[13]}) SELECT statement_date, transaction_date,posting_date,transaction_currency,cs_settlement_currency,transaction_amount,transaction_type,fixed_transaction_fee,discount_rate,interchange,card_scheme_fees,acquiring_fee,net_activity,card_scheme,merchant_reference_number_h9 FROM appdb.${table_source} WHERE NOT EXISTS (SELECT 1 FROM ${table_name} WHERE ${table_name}.statement_date = ${table_source}.statement_date);`;
                return pool.query(q1);
            case 'cp_credorex':
                const q2 = `INSERT INTO appdb.${table_name} (${columns[0]}, ${columns[1]},${columns[2]}, ${columns[3]}, ${columns[4]},${columns[5]}, ${columns[6]},${columns[7]}, ${columns[8]},${columns[9]}, ${columns[10]}) SELECT ID_trans, sDate,rDate,Status,Paid,pCrn,Received,rCrn,Processor,Pay_out_agent,PID FROM appdb.${table_source} WHERE NOT EXISTS (SELECT 1 FROM ${table_name} WHERE ${table_name}.sDate = ${table_source}.sDate);`;
                return pool.query(q2); 
            default:
                return
        }
    }

    //------------------------------> reconciliation between recon tables ------------------(3)
    /*====================> (a) activate when reconciliation between processor_recon and system_recon when insert new data from credorx_cp.*/
    static reconciliation_process_with_system_recon(){
        const q1 = `SET SQL_SAFE_UPDATES = 0;`
        const q2 = `DELETE FROM appdb.credorex_recon WHERE (merchant_reference_number_h9, transaction_amount) IN (SELECT ID_trans, Paid FROM (SELECT t1.merchant_reference_number_h9 AS ID_trans, t1.posting_date AS sDate,t1.transaction_amount AS Paid FROM appdb.credorex_recon t1 INNER JOIN appdb.system_recon t2 ON t1.merchant_reference_number_h9 = t2.ID_trans AND t1.transaction_amount = t2.Paid) AS subquery);`;
        const q3 = `SET SQL_SAFE_UPDATES = 0;`;
        const q4 = `DELETE FROM appdb.system_recon WHERE (ID_trans, Paid) IN (SELECT merchant_reference_number_h9, transaction_amount FROM (SELECT t2.ID_trans AS merchant_reference_number_h9, t2.sDate AS posting_date,t2.Paid AS transaction_amount FROM appdb.system_recon t2 INNER JOIN appdb.credorex t1 ON t2.ID_trans = t1.merchant_reference_number_h9 AND t2.Paid = t1.transaction_amount) AS subquery);`;
        const q5 = `SET SQL_SAFE_UPDATES = 0;`;
        const q6 = `DELETE FROM appdb.system_recon WHERE (ID_trans, Paid) IN (SELECT merchant_reference_number_h9, transaction_amount FROM (SELECT t2.ID_trans AS merchant_reference_number_h9, t2.sDate AS posting_date,t2.Paid AS transaction_amount FROM appdb.system_recon t2 INNER JOIN appdb.credorex_index t1 ON t2.ID_trans = t1.merchant_reference_number_h9 AND t2.Paid = t1.transaction_amount) AS subquery);`;
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

    /*
    static update_reconciliation_credoex(){
        const q1 = "DELETE FROM appdb.recon_credorex WHERE ID_system IN (SELECT ID_processor FROM appdb.recon_credorex WHERE ID_system IS NOT NULL AND ID_processor IS NOT NULL);";
        const q2 = "DELETE FROM appdb.recon_credorex WHERE ID_processor IN (SELECT ID_system FROM appdb.recon_credorex WHERE ID_system IS NOT NULL AND ID_processor IS NOT NULL);";
        return pool.query(q1).then(()=>{
            pool.query(q2);
        });
    }*/

    //Get recon data under condition
    static get_reconciliation_condition(table_name, condetion){
        const q = `SELECT * FROM appdb.${table_name} WHERE ${condetion};`;
        return pool.query(q);
    }
    
    //Get recon data
    /*
    static get_reconciliation_credorex(){
        const q = "SELECT * FROM appdb.recon_credorex;";
        return pool.query(q);
    }*/

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

    //Delete recon row when there are same data in the same column
    /*
    static delete_row_recon_same(table_name, column_name){
        const q1 = 'SET SQL_SAFE_UPDATES = 0;'
        //const q = `DELETE FROM ${table_name} WHERE id NOT IN (SELECT id FROM (SELECT MIN(id) AS id FROM ${table_name} GROUP BY ${column_name}) AS t)`;
        const q2 = `DELETE FROM appdb.${table_name} WHERE ID IN ( SELECT ID FROM(SELECT ID, ROW_NUMBER() OVER(PARTITION BY ${column_name} ORDER BY ID) AS row_num FROM appdb.${table_name} WHERE ${column_name} IS NOT NULL) AS t WHERE row_num > 1);`
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
    }*/


    /************************ Get Data from database ************************/
    static register_in_table(table_name, table_source,columns){
        if(table_source === 'credorex'){
            
            const q = `INSERT INTO appdb.${table_name} (${columns[0]}, ${columns[1]},${columns[2]}, ${columns[3]}, ${columns[4]},${columns[5]}, ${columns[6]},${columns[7]}, ${columns[8]},${columns[9]}, ${columns[10]}, ${columns[11]},${columns[12]}, ${columns[13]},${columns[14]}) SELECT statement_date, transaction_date,posting_date,transaction_currency,cs_settlement_currency,transaction_amount,transaction_type,fixed_transaction_fee,discount_rate,interchange,card_scheme_fees,acquiring_fee,net_activity,card_scheme,merchant_reference_number_h9 FROM appdb.${table_source} WHERE NOT EXISTS (SELECT 1 FROM ${table_name} WHERE ${table_name}.statement_date = ${table_source}.statement_date);`;
            return pool.query(q);
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

    static get_record_statement(table_name, column_date, date ,column_curr, curr){
        const q = `SELECT * FROM appdb.${table_name} WHERE ${column_date}="${date}" AND ${column_curr} = "${curr}"`;
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

    // delete with Id or any other condetion.
    /*
    static deleteDataById(id, table_name){
        const q1 = 'SET SQL_SAFE_UPDATES = 0;';
        const q2= "DELETE FROM table_name WHERE condition;";
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
    }*/


    /************************ Search *********************************/
    //Searching
    static searching(table_name, column, item, column_id, item_id){
        const q =`SELECT * FROM ${table_name} WHERE ${column} = ${item} OR ${column_id} = ${item_id};`;
        return pool.query(q);
    }

    /************************ Table count ***************************/
    /*
    static count_table(table_name, column1, column2){
        const q1 =`SELECT COUNT(*) FROM ${table_name} WHERE ${column1} IS NOT NULL;`;
        //const q2 = `DELETE FROM ${table_name} WHERE ${column1} IS NOT NULL AND ID_processor IS NULL;`;
        return pool.query(q1)
        .then((result)=>{
            console.log(result)
            pool.query(q2).then(result=>{
                console.log(result);
            });
        });
    }*/


    
}