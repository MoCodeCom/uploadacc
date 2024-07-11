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

    /****************** Generate tables ********************/
    /***************** Cp ************************/
//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Create database                             |
//|_____________________________________________________________________|

    //create table cp _ truelayer
    static createTable_cp_truelayer(){
        const q = "CREATE TABLE cp_truelayer (id INT UNSIGNED NOT NULL AUTO_INCREMENT,ID_trans VARCHAR(20),sDate VARCHAR(20),rDate VARCHAR(50),Status VARCHAR(50),Paid VARCHAR(45),pCrn VARCHAR(45),Received VARCHAR(150),rCrn VARCHAR(50),Processor VARCHAR(50),Pay_out_agent VARCHAR(25),PID VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }
    
    
    //Create Truelayer table
    static createTable_truelayer(){
        const q = "CREATE TABLE appdb.truelayer (id INT UNSIGNED NOT NULL AUTO_INCREMENT,amount VARCHAR(170) ,currency VARCHAR(175) ,status VARCHAR(175),type VARCHAR(120),reference VARCHAR(225),date VARCHAR(180),provideName VARCHAR(250),failureReason VARCHAR(250),statementDate VARCHAR(75),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    //----------------------------> Truelayer recon tables <--------------------------------//
    static reconciliation_table_processor(){
        const q="CREATE TABLE appdb.truelayer_recon (id INT UNSIGNED NOT NULL AUTO_INCREMENT,amount VARCHAR(70) ,currency VARCHAR(75) ,status VARCHAR(75),type VARCHAR(20),reference VARCHAR(25),date VARCHAR(80),provideName VARCHAR(150),failureReason VARCHAR(250),statementDate VARCHAR(75),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    static reconciliation_table_system(){
        const q ="CREATE TABLE appdb.system_recon_truelayer (id INT UNSIGNED NOT NULL AUTO_INCREMENT,ID_trans VARCHAR(20),sDate VARCHAR(20),rDate VARCHAR(50),Status VARCHAR(50),Paid VARCHAR(45),pCrn VARCHAR(45),Received VARCHAR(50),rCrn VARCHAR(50),Processor VARCHAR(50),Pay_out_agent VARCHAR(25),PID VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }
    
    //----------------------------> Truelayer index table <--------------------------------//
    //Create Truelayer_index
    static createTable_truelayer_index(){
        const q = "CREATE TABLE appdb.truelayer_index (id INT UNSIGNED NOT NULL AUTO_INCREMENT,amount VARCHAR(70) ,currency VARCHAR(75) ,status VARCHAR(75),type VARCHAR(20),reference VARCHAR(25),date VARCHAR(80),provideName VARCHAR(150),failureReason VARCHAR(250),statementDate VARCHAR(75),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Delete database                            |
//|_____________________________________________________________________|

  /***************** Delete Table *******************/
    //to Drop table from database
    static deleteTable(table_name){
        const q = `DROP TABLE ${table_name};`;
        return pool.query(q);
    }

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

  /***************** Check exist table **************/
    /*-----------------> check credorex table <---------------------------*/
    //to check the data in the table or not ...
    static exist_data_table(table_name,column_title,item){
        const q = `SELECT * FROM appdb.${table_name} WHERE ${column_title} = '${item}';`;
        return pool.query(q);
    }

//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Reconciliation                             |
//|_____________________________________________________________________|

    //------------------------------>copy data to recon and clear source tables ------------(2)
    static copy_data_to_recon_tbl(table_name, table_source,columns){
        switch (table_source) {
            case 'truelayer':
                const q1 = `INSERT INTO appdb.${table_name} (${columns[0]}, ${columns[1]},${columns[2]}, ${columns[3]}, ${columns[4]},${columns[5]}, ${columns[6]},${columns[7]}, ${columns[8]}) SELECT amount,currency,status,type,reference,date,provideName,failureReason,statementDate FROM appdb.${table_source} WHERE NOT EXISTS (SELECT 1 FROM ${table_name} WHERE ${table_name}.statementDate = ${table_source}.statementDate);`;
                return pool.query(q1);
            case 'cp_truelayer':
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
        const q2 = `DELETE FROM appdb.truelayer_recon WHERE (reference, amount) IN (SELECT ID_trans, Paid FROM (SELECT t1.reference AS ID_trans, t1.amount AS Paid FROM appdb.truelayer_recon t1 INNER JOIN appdb.system_recon_truelayer t2 ON t1.reference = t2.ID_trans AND CAST(t1.amount AS FLOAT) = CAST(t2.Paid AS FLOAT)) AS subquery);`;
        const q3 = `SET SQL_SAFE_UPDATES = 0;`;
        const q4 = `DELETE FROM appdb.system_recon_truelayer WHERE (ID_trans, Paid) IN (SELECT reference, amount FROM (SELECT t2.ID_trans AS reference, t2.Paid AS amount FROM appdb.system_recon_truelayer t2 INNER JOIN appdb.truelayer t1 ON t2.ID_trans = t1.reference AND CAST(t2.Paid AS FLOAT) = CAST(t1.amount AS FLOAT)) AS subquery);`;
        const q5 = `SET SQL_SAFE_UPDATES = 0;`;
        const q6 = `DELETE FROM appdb.system_recon_truelayer WHERE (ID_trans, Paid) IN (SELECT reference, amount FROM (SELECT t2.ID_trans AS reference, t2.Paid AS amount FROM appdb.system_recon_truelayer t2 INNER JOIN appdb.truelayer_index t1 ON t2.ID_trans = t1.reference AND CAST(t2.Paid AS FLOAT) = CAST(t1.amount AS FLOAT)) AS subquery);`;
        const q7 = `SET SQL_SAFE_UPDATES = 0;`
        const q8 = `DELETE FROM appdb.truelayer_recon WHERE (reference, amount) IN (SELECT ID_trans, Paid FROM (SELECT t1.reference AS ID_trans, t1.amount AS Paid FROM appdb.truelayer_recon t1 INNER JOIN appdb.cp_truelayer t2 ON t1.reference = t2.ID_trans AND CAST(t1.amount AS FLOAT) = CAST(t2.Paid AS FLOAT)) AS subquery);`;
        const q9 = `SET SQL_SAFE_UPDATES = 1;`;
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
                                 pool.query(q7)
                                 .then(()=>{
                                    pool.query(q8)
                                    .then(()=>{
                                        pool.query(q9);
                                    })
                                })
                            });
                        });
                    });
                });
            });
        })
    }

     /*====================> get recon system & processor */
     static get_table(table_name){
        const q =`SELECT * FROM appdb.${table_name};`;
        return pool.query(q);
    }


//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Searching                                  |
//|_____________________________________________________________________|
    /************************ Search *********************************/
    //Searching
    static searching(table_name, column, item, column_id, item_id){
        const q =`SELECT * FROM ${table_name} WHERE ${column} = ${item} OR ${column_id} = ${item_id};`;
        return pool.query(q);
    }

//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Matching                                   |
//|_____________________________________________________________________|
    /************************ Matching *********************************/
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



//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Register                                   |
//|_____________________________________________________________________|
    /************************ Register *********************************/
    static register_in_table(){
        const q = `INSERT INTO appdb.truelayer_index (amount,currency,status,type,reference,date,provideName,failureReason,statementDate) SELECT amount,currency,status,type,reference,date,provideName,failureReason,statementDate FROM appdb.truelayer WHERE NOT EXISTS (SELECT 1 FROM appdb.truelayer_index WHERE appdb.truelayer_index.statementDate = appdb.truelayer.statementDate);`;
        return pool.query(q);
    }


//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Get Payments                               |
//|_____________________________________________________________________|
    /************************ Payment *********************************/
    //Get payment
    static get_payment_processor(table_name, payment_column, term){
        const q = `SELECT * FROM ${table_name} WHERE ${ payment_column } = "${ term }";`;
        return pool.query(q);
    }

//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Get Record Statement (Show)                |
//|_____________________________________________________________________|
    /************************ Payment *********************************/
    static get_record_statement(table_name, column_date, date ,column_reference, reference){
        //leave [refrence] right now 
        const q = `SELECT * FROM appdb.${table_name} WHERE ${column_date}="${date}";`;
        return pool.query(q);
    }


//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Get table                                  |
//|_____________________________________________________________________|
    static get_table(table_name){
        const q =`SELECT * FROM appdb.${table_name};`;
        return pool.query(q);
    }


//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Analysis                                   |
//|_____________________________________________________________________|

    static refundList(table_name){
        const q =`SELECT * FROM appdb.${table_name} WHERE type = 'refund' OR type = 'Refund' OR type = 'REFUND';`;
        return pool.query(q);
    }

}