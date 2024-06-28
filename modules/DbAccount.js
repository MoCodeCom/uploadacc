const pool = require('../util/database');
/*-------------------------------------------------*/
module.exports = class Data{
    static createTable_account(){
        const q = "CREATE TABLE accounts (id INT UNSIGNED NOT NULL AUTO_INCREMENT,account_name VARCHAR(150),account_number VARCHAR(25),description VARCHAR(150),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);";
        return pool.query(q);
    }

    static adding_account(column){
        const q1 = `INSERT INTO appdb.accounts (account_name,account_number,description) VALUES ('${column[0]}','${column[1]}','${column[2]}');`;
        return pool.query(q1);
    }

    /*************************************************** Delete table ****************************************/
    static deleteTable(){
        const q = `DROP TABLE appdb.accounts;`;
        return pool.query(q);
    }

    static deleteAllData(){
        const q1 = 'SET SQL_SAFE_UPDATES = 0;';
        const q2 = `DELETE FROM appdb.accounts;`;
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

    static deleteDataById(id){
        const q1 = 'SET SQL_SAFE_UPDATES = 0;';
        const q2 = `DELETE FROM appdb.accounts WHERE account_number = '${id}';`;
        const q3 = 'SET SQL_SAFE_UPDATES = 1;';
        return pool.query(q1)
        .then(()=>{
            //console.log(q2);
            pool.query(q2)
            .then(()=>{
                pool.query(q3);
            }).catch(error => console.log(error));
        })
        .catch(error =>{
            console.log(error);
        }); 
    }
/************************************** Exist **********************/
    static exist_row(id){
        const q = `SELECT * FROM appdb.accounts WHERE account_number = '${id}';`;
        return pool.query(q);
    }

/************************************ get account ******************/
    static get_accounts(){
        const q = `SELECT * FROM appdb.accounts;`;
        return pool.query(q);
    }
}
