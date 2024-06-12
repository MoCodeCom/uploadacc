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
/*----------------------------------------------------*/
const databaseController = require('../controllers/databaseController');
const processorController = require('../controllers/processorController/credorexController');
const checkoutController = require('../controllers/processorController/checkoutController');
const shateController = require('../controllers/shareController/shareController');
const filesController = require('../controllers/filesController');
const apiController = require('../controllers/apiController');
const fileUpload = require('express-fileupload');
const database = require('../util/database');
/*----------------------------------------------------*/
//********* Create table ********/
/*-----------> Credorex <-----------------*/
router.get('/processor/credorax/creatcredorextbl', processorController.createTbl_credorex);
router.get('/processor/credorax/createcptbl', processorController.createTbl_cp);
router.get('/processor/credorax/createcredorexindex',processorController.createTbl_credorex_index);

/*----------> Checkout <-------------------*/
router.get('/processor/checkout/creatcheckouttbl', checkoutController.createTbl_checkout);
router.get('/processor/checkout/createcptbl', checkoutController.createTbl_cp);
router.get('/processor/checkout/createcheckoutindex',checkoutController.createTbl_checkout_index);


//********* Delete or drop table ********/
router.delete('/processor/credorax/deletetbl', processorController.deletetbl);
/*-------------------> Checkout <----------------------*/
router.delete('/processor/checkout/deletetbl', checkoutController.deletetbl);

//router.delete('/processor/credorax/deletcredorextbl', processorController.deleteTbl_credorex);
//router.delete('/processor/credorax/deletecptbl', processorController.deleteTbl_cp);
//router.delete('/processor/credorax/deletereconcredorex', processorController.deleteTbl_recon_credorex);
//router.delete('/processor/credorax/deletecredorexindex',processorController.deleteTbl_credorex_index);


//********* Upload Data *********/
//---------------------------> Credorex <-------------------------//
router.post('/processor/credorax/uploadcredorex',fileUpload(uploadOpts), filesController.uploadprocessorcredorax);
router.post('/processor/credorax/uploadcpcredorex',fileUpload(uploadcpfile),filesController.uploadcpcredorax);

//--------------------------> Checkout <-------------------------//
router.post('/processor/checkout/uploadcheckout',fileUpload(uploadOpts), filesController.uploadprocessorcheckout);
router.post('/processor/checkout/uploadcpcheckout',fileUpload(uploadcpfile),filesController.uploadcpcheckout);

//********* Reconciliation ***********/
//router.get('/processor/credorax/reconcredorex',processorController.reconciliation_credorex);
//router.get('/processor/credorax/getreconcredorex',processorController.get_reconcilitaion_credorex);
//router.delete('/processor/credorax/deleteallreconcredorex',processorController.deleteAllData_recon_credorex);
//router.get('/processor/credorax/updaterecon',processorController.update_recon);

//-----------------------------> plan 2
/*----------------------------->Credorex <----------------------------- */
router.get('/processor/credorax/createrecontbls', processorController.create_recon_tables); // to build recon tables
/*-----------------------------> Checkout <---------------------------- */
router.get('/processor/checkout/createrecontbls', checkoutController.create_recon_tables); // to build recon tables

/*==========================================================================================*/
/*----------------------------> Credorex <-------------------------------*/
router.get('/processor/credorax/copyrecon',processorController.copy_data_recon_credorex); //(1)---> to copy data to recon tables
router.get('/processor/credorax/credorexsystemwithprocessorrecon',processorController.reconciliation_process_with_system_recon);//(2)(3)----> to recon processor with system

/*----------------------------> Checkout <--------------------------------*/
router.get('/processor/checkout/copyrecon',checkoutController.copy_data_recon_checkout); //(1)---> to copy data to recon tables
router.get('/processor/checkout/checkoutsystemwithprocessorrecon',checkoutController.reconciliation_process_with_system_recon);//(2)(3)----> to recon processor with system

/*==========================================================================================*/
router.get('/processor/credorax/getreconcredorextbls', processorController.get_table);//------> get data for recon after copying
router.get('/processor/credorax/gettable', processorController.get_table); //---------> to get different table data such as debit


//*********** credorex *************** */
/*
router.delete('/processor/credorax/deleteallcredorex',processorController.deleteAllData_credorex);
router.delete('/processor/credorax/deleteallcpcredorex',processorController.deleteAllData_cp_credorex);
router.delete('/processor/credorax/deleteallcredorexindex',processorController.deleteAllData_credorex_index);
*/
/*************************** Delete data ************************** */
/*-----------------> Credorex <--------------------------------*/
router.delete('/processor/credorax/deletealldata',processorController.deleteAllData);
/*-----------------> Checkout <--------------------------------*/
router.delete('/processor/checkout/deletealldata',checkoutController.deleteAllData);


/************************** Matching ******************************** */
/*----------------------> Credorex <--------------------- */
router.delete('/processor/credorax/deleterowrecon/:id',processorController.deleteRow_recon_match); // matching
/*----------------------> Checout <-----------------------*/
router.delete('/processor/checkout/deleterowrecon/:id',checkoutController.deleteRow_recon_match); // matching

//router.delete('/processor/credorax/deleterowreconcredorexauto',processorController.deleteRow_recon_credorex_auto);
//router.delete('/processor/credorax/deletesamecredorax', processorController.delete_same_credorax);
//************ Checkout API *******************/
router.get('/getcheckoutpayment',apiController.checkoutAPI);

/******************** Searching credorex ********************/
//router.get('/processor/credorax/searchcredorexprocessor/:item',processorController.searching_processor_recon_credorex_processor);
//router.get('/processor/credorax/searchcredorexsystem/:item',processorController.searching_processor_recon_credorex_system); 
router.get('/processor/credorax/searchprocessor/:item',processorController.searching_processor_recon);
router.get('/processor/checkout/searchprocessor/:item',checkoutController.searching_processor_recon);
/******************** Get with date *************************/
router.get('/processor/credorax/getrecondate/:date',processorController.get_reconciliation_credorex_dateCondition);

/******************** Register *******************************/
router.post('/processor/credorax/postregister',processorController.register_credorex_index);
router.get('/processor/credorax/getpayments',processorController.get_payment_index);
router.get('/processor/credorax/getsumpayments',processorController.get_sum_payment);
router.get('/processor/credorax/getsumfees', processorController.get_sum_fees);
router.get('/processor/credorax/getsumrefund', processorController.get_sum_refund);
router.get('/processor/credorax/getsumsystem',processorController.get_sum_recon);
router.get('/processor/credorax/getindex',processorController.get_record_statement);


/******************** registers ************************11/06/2024************ */
router.post('/processor/checkout/postregister',checkoutController.register_checkout_index);
router.get('/processor/checkout/getpayments',checkoutController.get_payment_index);
/********************* Count table **************************/
//router.get('/processor/counttable',shareController.count_table)

router.get('/processor/api',apiController.checkoutAPI);

/*-----------------------------------------------------*/

/*--------------------- Checkout --------------------------*/
/*==================>Get table */
router.get('/processor/checkout/getreconcheckouttbls', checkoutController.get_table);
router.get('/processor/checkout/gettable', checkoutController.get_table);

module.exports = router;