const mysql = require('mysql2');
/*----------------------------------------*/

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'appdb',
    password:'1111'
    //password:'MJm198219##dell'
});

// Connect to the database
pool.getConnection((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database');
  });
/*
const pool = mysql.createPool({
    username : 'doadmin',
    password : 'AVNS_jLag_CfHhq6eGrLMnyA',
    host : 'db-1-do-user-15992380-0.c.db.ondigitalocean.com',
    port : '25060',
    database : 'defaultdb',
    sslmode : 'REQUIRED',


})*/



/*----------------------------------------*/

module.exports = pool.promise();
