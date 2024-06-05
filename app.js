const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT;
const pool = require('util');

/*---------------------------------------------- socketIo ----*/

const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server);
const { exec } = require('child_process');
app.use(express.static('public'));
/*-----------------------------------------------------*/
app.use(bodyParser.json());
//CORS
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Origin','GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Origin', 'Content-Type, Authorization');
    next();
});
app.use(cors({
    origin:true,
    credentials:true,
    methods:'POST,GET,PUT,OPTIONS,DELETE'
}));



io.on('connection', (socket)=>{
    console.log('A user connected');
    socket.on('disconnect',()=>{
        console.log('A user disconnected');
    })
});
app.post('/restart',(req,res)=>{
    res.send('Restarting server...');
    console.log('Restarting server ...');
    exec('source ~/.profile && pm2 restart all', (err, stdout, stderr)=>{
        if(err){
            console.error(`Error restarting server: ${stderr}`);
            return;
        }
        console.log(`Server restarted: ${stdout}`);
    });
});
/*-----------------------------------------------------*/
const api = require('./router/api');
app.use('',api);

app.listen(PORT, console.log(`server running on port ${PORT}`));