const express = require('express');
const router = express.Router();
//const fileUpload = require('express-fileupload');
const uploadOpts = {
    useTempFiles : true,
    tempFileDir : '/temp/'
}

const uploadcpfile = {
    useTempFiles : true,
    tempFileDir : '/temp/'
}

const XLSX = require('xlsx');
const fs = require('fs');
const pool = require('../util/database');
const csv = require('csv-parser');
const csvtojson = require('csvtojson');

const db = require("../modules/Db");
const db_checkout = require("../modules/DbCheckout");
/*----------------------------------------------------*/
const databaseController = require('../controllers/databaseController');
const filesController = require('../controllers/filesController');
const apiController = require('../controllers/apiController');
const fileUpload = require('express-fileupload');
const database = require('../util/database');
/*----------------------------------------------------*/

//*********************************************************/

exports.uploadcp = fileUpload(uploadOpts),async(req, res, next)=>{
    try{
        const file = req.files;
        fs.createReadStream(file)
        .pipe(csv())
        .on('data', function(data){
            console.log(data);
        });
        
    }catch(error){
        console.log(error);
    }
}
/*------------------> Credorex <----------------------*/
exports.uploadcpcredorax = async(req, res, next)=>{
    try{
        const {excel} = req.files;
        await csvtojson().fromFile(req.files.file.tempFilePath)
        .then(async source => {
            await db.exist_data_table('cp_credorex','sDate',source[1]['sDate'])
            .then(async result =>{
                if(result[0].length > 0){
                    res.status(200).json(
                        {
                            message_code:1,
                            message:'The data statement already exist in the database.'
                        }
                    );
                }
                else if(source[0]['sDate'] != null){
                    let count = 0;
                    for(let i = 0; i < source.length ;i++){
                        var ID = source[i]['ID'],
                            sDate = source[i]['sDate'],
                            rDate = source[i]['rDate'],
                            Status = source[i]['Status'],
                            Paid = source[i]['Paid'],
                            pCrn = source[i]['pCrn'],
                            Received = source[i]['Received'],
                            rCrn = source[i]['rCrn'],
                            Processor = source[i]['Processor'],
                            payoutagent = source[i]['Pay out agent'],
                            PID = source[i]['PID'];

                            //---------------> to change amount to pluse with two digits decimal.
                            let amount = parseFloat(Paid).toFixed(2);
                            if(amount < 0){
                                amount = amount *-1;
                                Paid = amount.toString();
                            }
                            Paid = amount.toString();

                            var insertStatement = 'INSERT INTO cp_credorex(ID_trans,sDate,rDate,Status,Paid,pCrn,Received,rCrn,Processor,Pay_out_agent,PID)VALUES(?,?,?,?,?,?,?,?,?,?,?)';
                            var items = [ID,sDate, rDate, Status, Paid, pCrn, Received, rCrn, Processor, payoutagent, PID];
                            await pool.query(insertStatement, items);
                            count++;
                    }
                    if(count !== null || count !== 0){
                        res.status(200).json({
                            message:'The data is uploaded successfully'
                        });
                    }
                        
                    
                    
                }
                else{
                    res.status(200).json(
                        {
                            message_code:2,
                            message:'The data statement not compatible with database structure.'
                        }
                    );
                }
            }).catch(error => console.log(error.sqlMessage))
        })
        .catch(
            (err) => {
                console.log(err.sqlMessage)
            }
        )
    }catch(error){
        console.log(error);
    }
}

exports.uploadprocessorcredorax = async(req, res, next)=>{
    try{
        const {excel} = req.files.file;
        //console.log(req.files.file.tempFilePath);
        await csvtojson().fromFile(req.files.file.tempFilePath)
        .then(async source => {
            
            await db.exist_data_table('credorex','statement_date',source[1]['statement_date'])
            .then(async result =>{
                if(result[0].length > 0){
                    res.status(200).json(
                        {
                            message_code: 1,
                            message:'The data statement already exist in the database.'
                        }
                    );
                }
                else if(source[0]['statement_date'] != null){
                    let count = 0;
                    for(let i = 0;i<source.length;i++){
                        var statement_date = source[i]['statement_date'],
                            transaction_date = source[i]['transaction_date'],
                            posting_date = source[i]['posting_date'],
                            transaction_currency = source[i]['transaction_currency'],
                            transaction_amount = source[i]['transaction_amount'],
                            fixed_transaction_fee = source[i]['fixed_transaction_fee'],
                            discount_rate = source[i]['discount_rate'],
                            interchange = source[i]['interchange'],
                            card_scheme_fees = source[i]['card_scheme_fees'],
                            acquiring_fee = source[i]['acquiring_fee'],
                            net_activity = source[i]['net_activity'],
                            card_scheme = source[i]['card_scheme'],
                            merchant_reference_number_h9 = source[i]['merchant_reference_number_h9'];

                        var transaction_type = source[i]['transaction_type'];
                        var cs_settlement_currency = source[i]['cs_settlement_currency'];

                        //---------------> to change amount to pluse with two digits decimal.
                        let amount = parseFloat(net_activity).toFixed(2);
                        if(amount < 0){
                            amount = amount *-1;
                            net_activity = amount.toString();
                        }
                        net_activity = amount.toString();
                            
                            var insertStatement = 'INSERT INTO credorex(statement_date, transaction_date, posting_date, transaction_currency, cs_settlement_currency, transaction_amount,transaction_type,fixed_transaction_fee,discount_rate,interchange,card_scheme_fees,acquiring_fee,net_activity,card_scheme,merchant_reference_number_h9)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                            var items = [statement_date, transaction_date, posting_date, transaction_currency,cs_settlement_currency, transaction_amount,transaction_type,fixed_transaction_fee,discount_rate,interchange,card_scheme_fees,acquiring_fee,net_activity,card_scheme,merchant_reference_number_h9];
                            pool.query(insertStatement, items);
                            count++;
                    }
                    if(count !== null || count !== 0){
                        res.status(200).json({
                            message:'The data is uploaded successfully'
                        });
                    }
                }
                else{
                    res.status(200).json(
                        {
                            message_code:2,
                            message:'The data statement not compatible with database structure.'
                        }
                    );
                }
            })
            .catch(error =>{
                console.log(error.sqlMessage)
            });

            
        })
        .catch((err) => {
            console.log(err.sqlmessage)
            
        })
        ;
    }catch(error){
        console.log(error);
    }
}


/*------------------> Checkout <--------------------*/
exports.uploadcpcheckout = async(req, res, next)=>{
    
    try{
        const {excel} = req.files;
        await csvtojson().fromFile(req.files.file.tempFilePath)
        .then(async source => {
            //await console.log(source.length);
            await db_checkout.exist_data_table('cp_checkout','sDate',source[1]['sDate'])
            .then(async result =>{
                
                if(result[0].length > 0){
                    res.status(200).json(
                        {
                            message_code:1,
                            message:'The data statement already exist in the database.'
                        }
                    );
                }
                else if(source[0]['sDate'] != null){
                    let count = 0;
                    for(let i = 0; i < source.length ;i++){
                        var ID = source[i]['ID'],
                            sDate = source[i]['sDate'],
                            rDate = source[i]['rDate'],
                            Status = source[i]['Status'],
                            Paid = source[i]['Paid'],
                            pCrn = source[i]['pCrn'],
                            Received = source[i]['Received'],
                            rCrn = source[i]['rCrn'],
                            Processor = source[i]['Processor'],
                            payoutagent = source[i]['Pay out agent'],
                            PID = source[i]['PID'];

                            //---------------> to change amount to pluse with two digits decimal.
                            let amount = parseFloat(Paid).toFixed(2);
                            if(amount < 0){
                                amount = amount *-1;
                                Paid = amount.toString();
                            }
                            Paid = amount.toString();
                            
                            var insertStatement = 'INSERT INTO appdb.cp_checkout(ID_trans,sDate,rDate,Status,Paid,pCrn,Received,rCrn,Processor,Pay_out_agent,PID)VALUES(?,?,?,?,?,?,?,?,?,?,?)';
                            var items = [ID,sDate, rDate, Status, Paid, pCrn, Received, rCrn, Processor, payoutagent, PID];
                            await pool.query(insertStatement, items);
                            count++;
                    }
                    if(count !== null || count !== 0){

                        res.status(200).json({
                            message:'The data is uploaded successfully'
                        });
                    }
                }
                else{
                    res.status(200).json(
                        {
                            message_code:2,
                            message:'The data statement not compatible with database structure.'
                        }
                    );
                }
            }).catch(error => console.log(error.sqlMessage))
        })
        .catch(
            (err) => {
                console.log(err.sqlMessage)
            }
        )
    }catch(error){
        console.log(error);
    }
}

exports.uploadprocessorcheckout = async(req, res, next)=>{
    try{
        const {excel} = req.files.file;
        //console.log(req.files.file.tempFilePath);
        await csvtojson().fromFile(req.files.file.tempFilePath)
        .then(async source => {
            await db_checkout.exist_data_table('checkout','Processing_Channel_ID',source[1]['Processing Channel ID'])
            .then(result =>{
                if(result[0].length > 0){
                    res.status(200).json(
                        {
                            message_code: 1,
                            message:'The data statement already exist in the database.'
                        }
                    );
                }
                else if(source[0]['Processing Channel ID'] != null){
                    let count = 0;
                    for(let i = 0;i<source.length;i++){
                        var Processing_Channel_ID = source[i]['Processing Channel ID'],
                            action_type = source[i]['Action Type'],
                            processed_on = source[i]['Processed On'],
                            processing_currency = source[i]['Processing Currency'],
                            fx_rate_applied = source[i]['FX Rate Applied'],
                            holding_currency = source[i]['Holding Currency'],
                            reference_id = source[i]['Reference'],
                            payment_method = source[i]['Payment Method'],
                            card_type = source[i]['Card Type'],
                            breakdown_type = source[i]['Breakdown Type'],
                            processing_curryncy_amount = source[i]['Processing Currency Amount'],
                            holding_currency_amount = source[i]['Holding Currency Amount']

                            //---------------> to change amount to pluse with two digits decimal.
                            if(breakdown_type ==='Capture' || breakdown_type ==='Refund'){
                                let amount = parseFloat(processing_curryncy_amount).toFixed(2);
                                if(amount < 0){
                                    amount = amount *-1;
                                    processing_curryncy_amount = amount.toString();
                                }
                                processing_curryncy_amount = amount.toString();
                            }


                            var insertStatement = 'INSERT INTO appdb.checkout(Processing_Channel_ID,action_type,processed_on,processed_currency,fx_rate_applied,holding_currency,reference_id,payment_method,card_type,breakdown_type,processing_curryncy_amount ,holding_currency_amount)VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
                            var items = [Processing_Channel_ID,action_type, processed_on,processing_currency,fx_rate_applied,holding_currency,reference_id,payment_method,card_type,breakdown_type,processing_curryncy_amount ,holding_currency_amount];
                            pool.query(insertStatement, items);
                            count++;
                    }
                    if(count !== null || count !== 0){

                        res.status(200).json({
                            message:'The data is uploaded successfully'
                        });
                    }
                }
                else{
                    res.status(200).json(
                        {
                            message_code:2,
                            message:'The data statement not compatible with database structure.'
                        }
                    );
                }
            })
            .catch(error =>{
                console.log(error.sqlMessage)
            });
            //next(this.format_checkout());
        })
        .catch((err) => {
            console.log(err.sqlmessage)
            
        });
    }catch(error){
        console.log(error);
    }
}

