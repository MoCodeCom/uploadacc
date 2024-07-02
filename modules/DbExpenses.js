const pool = require('../util/database');
/*-------------------------------------------------*/

/*-------------------------------------------------*/
module.exports = class Data{
    /*****************************************************Create table ***************************************/
    static createTable_expenses_details(){
        const q = "CREATE TABLE expenses_detail (id INT UNSIGNED NOT NULL AUTO_INCREMENT,expenses_name VARCHAR(150),description VARCHAR(150),account_number VARCHAR(25),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    static createTable_expenses_list(){
        const q = "CREATE TABLE expenses_list (id INT UNSIGNED NOT NULL AUTO_INCREMENT,invoice_number VARCHAR(100),about VARCHAR(100),beneficiary_department VARCHAR(150),invoice_date VARCHAR(75),payment_date VARCHAR(75),account_number VARCHAR(100),items VARCHAR(20),amount VARCHAR(20),total VARCHAR(20),note VARCHAR(300), status BOOLEAN DEFAULT FALSE,PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    /*************************************************** Delete table ****************************************/
    static deleteTable(table_name){
        const q = `DROP TABLE appdb.${table_name};`;
        return pool.query(q);
    }

    static updateStatus(id, currStatus){
        let status;
        
        if(currStatus=='false'){
            status = '0';
        }else if(currStatus == 'true'){
            status = '1';
        }
        const q1 = 'SET SQL_SAFE_UPDATES = 0;';
        const q2 = `UPDATE appdb.expenses_list SET status = ${status} WHERE invoice_number = "${id}";`;
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
        }); ;
    }

    static getAllExpenses(){
        const q = `SELECT e.*
                    FROM expenses_list e
                    INNER JOIN (
                        SELECT MIN(id) AS id
                        FROM expenses_list
                        GROUP BY invoice_number
                    ) sub ON e.id = sub.id;
                    `;
        return pool.query(q);
    }

    static getExpensesById(id){
        const q = `SELECT * FROM appdb.expenses_list WHERE invoice_number="${id}";`;
        return pool.query(q);
    }

    /**************************************************** Clear table ****************************************/
    //Delete all data (clear) in table
    static deleteAllData(table_name){
        const q1 = 'SET SQL_SAFE_UPDATES = 0;';
        const q2 = `DELETE FROM appdb.${table_name};`;
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

    //delete invoice
    static deleteInvoice(id){
        const q1 = 'SET SQL_SAFE_UPDATES = 0;';
        const q2 = `DELETE FROM appdb.expenses_list WHERE invoice_number="${id}";`;
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
    /*************************************************** Insert data in table **********************************/

    static adding_expenses_detail(column){
        const q1 = `INSERT INTO appdb.expenses_detail (expenses_name,description,account_number) VALUES ${column[0]},${column[1]},${column[2]};`;
        return pool.query(q1);
    }

    static adding_expenses_list(column){
        const q1 = `INSERT INTO appdb.expenses_list (invoice_number,about,beneficiary_department,invoice_date,payment_date,account_number,items,amount,total,note) VALUES ("${column['invoice_number']}","${column['about']}","${column['department']}","${column['invoice_date']}","${column['payment_date']}","${column['accountNumber']}","${column['item']}","${column['amount']}","${column['total']}","${column['note']}");`;
        return pool.query(q1);
    }

    /***************************************************** Check exist **************************************/
    //to check whether the invoice number is exist already or not.
    static exist_row(id){
        const q = `SELECT * FROM appdb.expenses_list WHERE invoice_number = ${id};`;
        return pool.query(q);
    }


}