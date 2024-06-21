const pool = require('../util/database');
const jwt = require('jsonwebtoken');
/*-------------------------------------------------*/

module.exports = class auth{
    static create_auth_table(){
        const q = 'CREATE TABLE auth (id INT UNSIGNED NOT NULL AUTO_INCREMENT,username VARCHAR(45),password VARCHAR(50),authority VARCHAR(50),status VARCHAR(50),PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);';
        return pool.query(q);
    }

    static login(username, password){
        const q = `SELECT * FROM appdb.auth WHERE username = ${username} AND password = ${password};`;
        //const jwt = ;
        //const rt = pool.query(q);
        //return jwt.sign(rt);
        return pool.query(q);
    }

    


}