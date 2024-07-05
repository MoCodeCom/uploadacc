const db = require("../../modules/Db");

/*----------------------------------------*/



/********************* Create table ********** */
/*Credorex table */
exports.createTbl_credorex = (req,res,next)=>{
    db.createTable_credorex()
    .then(result =>{
        //console.log(result);
        res.status(200).json(
            {message:'The credorex table is created successfully.'}
        );
    })
    .catch(error =>{
        //console.log(error.sqlMessage);
        if(error.sqlMessage.includes('already exists')){
            res.status(200).json(
                { message:'The table exist already in the database!'}
            )
        }
    });

}

/*credorex index */
exports.createTbl_credorex_index = (req,res,next)=>{
    db.createTable_credorex_index()
    .then(result =>{
        
        res.status(200).json(
            {message:'The credorex table is created successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('already exists')){
            res.status(200).json(
                { message:'The table exist already in the database!'}
            )
        }
    });

}

//Cp table //
exports.createTbl_cp = (req, res, next)=>{
    db.createTable_cp_credorax()
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The cp_credorex table is created successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('already exists')){
            res.status(200).json(
                { message:'The table exist already in the database!'}
            )
        }
    });
    
}

//Recon Credorex table//
exports.createTbl_recon_credorex = async(req, res, next)=>{
    await db.createTable_recon_credorex()
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The Recon_credorex table is created successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('already exists')){
            res.status(200).json(
                { message:'The table exist already in the database!'}
            )
        }
    });
}



/******************** Delete table ************** */
//delete credorex

exports.deletetbl = async (req, res, next)=>{
    const table = req.query.table;
    switch (table) {
        case 'credorex':
            await db.deleteTable('credorex')
            .then(result =>{
                console.log(result);
                res.status(200).json(
                    {message:'The credorex is deleted from database successfully.'}
                );
            })
            .catch(error =>{
                console.log(error.sqlMessage);
                if(error.sqlMessage.includes('Unknown table')){
                    res.status(200).json({
                        message:'no table with this name in the databse!'
                    });
                }
            });
            break;
        case 'cp_credorex':
            await db.deleteTable('cp_credorex')
            .then(result =>{
                console.log(result);
                res.status(200).json(
                    {message:'The cp_credorex is deleted from database successfully.'}
                );
            })
            .catch(error =>{
                console.log(error.sqlMessage);
                if(error.sqlMessage.includes('Unknown table')){
                    res.status(200).json({
                        message:'no table with this name in the databse!'
                    });
                }
            });
            break;
        case 'credorex_recon':
            await db.deleteTable('credorex_recon')
            .then(result =>{
                res.status(200).json(
                    {message:'The recon_credorex is deleted from database successfully.'}
                );
            })
            .catch(error =>{
                console.log(error.sqlMessage);
                if(error.sqlMessage.includes('Unknown table')){
                    res.status(200).json({
                        message:'no table with this name in the databse!'
                    });
                }
            });
            break;
        case 'system_recon':
            await db.deleteTable('system_recon')
            .then(result =>{
                res.status(200).json(
                    {message:'The recon_credorex is deleted from database successfully.'}
                );
            })
            .catch(error =>{
                console.log(error.sqlMessage);
                if(error.sqlMessage.includes('Unknown table')){
                    res.status(200).json({
                        message:'no table with this name in the databse!'
                    });
                }
            });
            break;
        case 'credorex_index':
            await db.deleteTable('credorex_index')
            .then(result =>{
                res.status(200).json(
                    {message:'The recon_credorex is deleted from database successfully.'}
                );
            })
            .catch(error =>{
                console.log(error.sqlMessage);
                if(error.sqlMessage.includes('Unknown table')){
                    res.status(200).json({
                        message:'no table with this name in the databse!'
                    });
                }
            });
            break;
        default:
            break;
    }
    
}

/*
exports.deleteTbl_credorex = (req, res, next)=>{
    db.deleteTable('credorex')
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The credorex is deleted from database successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('Unknown table')){
            res.status(200).json({
                message:'no table with this name in the databse!'
            });
        }
    });
}*/

// delete table cp
/*
exports.deleteTbl_cp = (req, res, next)=>{
    
    db.deleteTable('cp_credorex')
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The cp_credorex is deleted from database successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('Unknown table')){
            res.status(200).json({
                message:'no table with this name in the databse!'
            });
        }
    });
    
}*/

// delete table recon
/*
exports.deleteTbl_recon_credorex = async(req, res, next)=>{
    
    await db.deleteTable('recon_credorex')
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The recon_credorex is deleted from database successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('Unknown table')){
            res.status(200).json({
                message:'no table with this name in the databse!'
            });
        }
    });
    
}*/
/*
exports.deleteTbl_credorex_index = async(req, res, next)=>{
    
    await db.deleteTable('credorex_index')
    .then(result =>{
        res.status(200).json(
            {message:'The recon_credorex is deleted from database successfully.'}
        );
    })
    .catch(error =>{
        console.log(error.sqlMessage);
        if(error.sqlMessage.includes('Unknown table')){
            res.status(200).json({
                message:'no table with this name in the databse!'
            });
        }
    });
    
}
*/


//********************* Delete all data ******************** */
//delete data recon
/*
exports.deleteAllData = async(req, res, next)=>{
    const table = req.query.table;
    await db.deleteAllData(table)
    .then(result =>{
        res.status(200).json(

            {
                message:'delete all data form table is done!.',
            }
        );
    })
    .catch(error =>{
        res.status(200).json({message:error});
    })
}


exports.deleteAllData_recon_credorex = async(req, res, next)=>{
    await db.deleteAllData('recon_credorex')
    .then(result =>{
        res.status(200).json(

            {
                message:'delete all data form table is done!.',
            }
        );
    })
    .catch(error =>{
        res.status(200).json({message:error});
    })
}

//delete data credorex
exports.deleteAllData_credorex = async(req, res, next)=>{
    await db.deleteAllData('credorex')
    .then(result =>{
        res.status(200).json({message:'delete all data form table is done!.'})
    })
    .catch(error =>{
        res.status(200).json({message:error});
    })
}

//delete data cp
exports.deleteAllData_cp_credorex = async(req, res, next)=>{
    await db.deleteAllData('cp_credorex')
    .then(result =>{
        res.status(200).json({message:'delete all data form table is done!.'})
    })
    .catch(error =>{
        res.status(200).json({message:error});
    })
}

//delete data index
exports.deleteAllData_credorex_index = async(req, res, next)=>{

    await db.deleteAllData('credorex_index')
    .then(result =>{
        res.status(200).json({message:'delete all data form table is done!.'})
    })
    .catch(error =>{
        res.status(200).json({message:error});
    });
}*/

exports.deleteAllData = async(req, res, next)=>{
    const table = req.query.table;
    if(table !== null){
        await db.deleteAllData(table)
        .then(result =>{
            res.status(200).json({message:'delete all data form table is done!.'})
        })
        .catch(error =>{
            res.status(200).json({message:error});
        });
    }
}


//********************** Searching ***************************** */
//searching in recon system data
/*
exports.searching_processor_recon_credorex_system = async(req, res, next)=>{
    const item = req.params.item;
    await db.searching('recon_credorex','amount_system',item, 'ID_system', item).then(result =>{
        res.status(200).json({
            message:'search is successful.',
            result:result
        });
    })
    .catch(error =>{
        res.status(404).json({
            message:'Not found.',
            result:error,
        });
    });;
}
*/
//searching in recon processor data
/*
exports.searching_processor_recon_credorex_processor = async(req, res, next)=>{
    const item = req.params.item;
    await db.searching('recon_credorex','amount_processor',item, 'ID_processor', item)
    .then(result =>{
        res.status(200).json({
            message:'search is successful.',
            result:result
        });
    })
    .catch(error =>{
        res.status(404).json({
            message:'Not found.',
            result:error,
        });
    });
}*/

exports.searching_processor_recon = async(req, res, next)=>{
    const item = req.params.item;
    const table = req.query.table;
   switch (table) {
    case 'credorex_recon':
        await db.searching(table,'transaction_amount',item, 'merchant_reference_number_h9', item)
        .then(result =>{
            res.status(200).json({
                message:'search is successful.',
                result:result
            });
        })
        .catch(error =>{
            res.status(404).json({
                message:'Not found.',
                result:error,
            });
        });
        break;
    case 'system_recon':
        await db.searching(table,'Paid',item, 'ID_trans', item)
        .then(result =>{
            res.status(200).json({
                message:'search is successful.',
                result:result
            });
        })
        .catch(error =>{
            res.status(404).json({
                message:'Not found.',
                result:error,
            });
        });
        break;
   
    default:
        break;
   }
    
}

//********************* reconciliation ************************* */
//implement recon
exports.reconciliation_credorex = async(req, res, next)=>{
    await db.reconciliation_credorex()
    .then(async result =>{
        await db.delete_row_recon_same('recon_credorex','ID_processor');
        await db.delete_row_recon_same('recon_credorex','ID_system');
        //await this.deleteRow_recon_credorex_auto();
        db.deleteAllData('credorex');
        db.deleteAllData('cp_credorex');
        res.status(200).json(
            {message:'reconciliation is done successfully!'}
        );

        /*
        await setTimeout(() => {
            //
            //db.update_reconciliation_credoex();
            
        }, 500);*/
    })
    .catch(error =>{
        res.status(200).json(
            {
                message:error
            }
        );
    });
}

//get data form recon table
/*
exports.get_reconcilitaion_credorex = async(req, res, next)=>{
    await db.get_reconciliation_credorex()
    .then(async result =>{
        res.status(200).json(
            {
                message:'get data is done!.',
                data:result
            }
        );
        
    })
    .catch(error =>{
        res.status(200).json({message:error})
    })
}*/

//get data from recon table on date
exports.get_reconciliation_credorex_dateCondition = async(req, res, next)=>{
    const column = req.query.column;
    const date = req.params.date;
    if(column === 'system'){
        await db.get_reconciliation_condition('recon_credorex',`DATE(posting_date_system) = '${date}'`)
        .then(result =>{
            res.status(200).json({
                results:result,
                message:'Get data successful.'
            })
        })
        .catch(error =>{
            res.status(200).json({
                message:error
            })
        });
    }else if(column === 'processor'){
        
        await db.get_reconciliation_condition('credorex_recon',`DATE(posting_date_processor) = '${date}'`)
        .then(result =>{
            res.status(200).json({
                results:result,
                message:'Get data successful.'
            })
        })
        .catch(error =>{
            res.status(200).json({
                message:error
            })
        });
    }else{

    }
    
}

//delete row from recon table "MATCH"
exports.deleteRow_recon_match = async(req, res, next)=>{
    const id = req.params.id;
    const table = req.query.table;

    switch (table) {
        case 'credorex_recon':
            const condition_1 = `merchant_reference_number_h9 = "${id}"`;
            await db.delete_row_reconciliation_match('credorex_recon',condition_1)
            .then(result =>{
                res.status(200).json({message:'delete data row form table is done!.'})
            })
            .catch(error =>{
                res.status(200).json({message:error});
            });
            break;
        case 'system_recon':
            const condition_2 = `ID_trans = "${id}"`;
            await db.delete_row_reconciliation_match('system_recon',condition_2)
            .then(result =>{
                res.status(200).json({message:'delete data row form table is done!.'})
            })
            .catch(error =>{
                res.status(200).json({message:error});
            });
            break;
        default:
            break;
    }

    
}

// delete row form recon when matching auto
/*
exports.deleteRow_recon_credorex_auto = async(req, res, next)=>{
    //const id = req.params.id;
    const condition = "ID_system = ID_processor OR ID_processor = ID_system";
    await db.delete_row_reconciliation_match('recon_credorex',condition)
    .then(result =>{
        res.status(200).json({message:'delete and clean data row form table is done!.'})
    })
    .catch(error =>{
        res.status(404).json({message:error});
    });
}
*/

// delete row when repeated  in same cloumn in recon
/*
exports.delete_same_credorax = async(req, res, next)=>{
    await db.delete_row_recon_same("recon_credorex", "ID_system").then(async ()=>{
        await db.delete_row_recon_same("recon_credorex", "ID_processor");
    }).then(result =>{
        res.status(200).json({
            message:'clean data is done.'
        });
    }).catch(error =>{
        res.status(404).json({
            message:'there is error.'
        })
    });
    
};*/




// -----------> plan 2
exports.create_recon_tables = async(req, res, next)=>{
    await db.reconciliation_table_system()
    .then(async result =>{
        await db.reconciliation_table_processor();
        res.status(200).json({
            message:'reconciliation tables are created.'
        })
    })
    .catch(error =>{
        res.status(200).json({
            message:error
        })
    });
}
// to copy data to recon tables
exports.copy_data_recon_credorex = async(req, res, next)=>{
    const credorex_rows = ['statement_date', 'transaction_date','posting_date','transaction_currency','cs_settlement_currency','transaction_amount','transaction_type','fixed_transaction_fee','discount_rate','interchange','card_scheme_fees','acquiring_fee','net_activity','card_scheme','merchant_reference_number_h9'];
    const system_rows = ['ID_trans','sDate','rDate','Status','Paid','pCrn','Received','rCrn','Processor','Pay_out_agent','PID'];
    await db.copy_data_to_recon_tbl('credorex_recon','credorex',credorex_rows).then(async()=>{
        await db.copy_data_to_recon_tbl('system_recon','cp_credorex',system_rows);
    })
    .then(async result =>{
        
        res.status(200).json({
                message:'copy data is successful'
        })
    })
    .catch(error =>{
        res.status(200).json({
            message:error
        })
    });
}
// to recon steps 1) 2)
exports.reconciliation_process_with_system_recon = async(req, res, next)=>{
    await db.reconciliation_process_with_system_recon()
    .then(async(result)=>{
        //await db.deleteAllData('credorex');
        //await db.deleteAllData('cp_credorex');
        setTimeout(() => {
            res.status(200).json({
                result:result,
                message:'resonciliation is done successfully.'
            })
        }, 250);
        
    })
    .catch(error =>{
        res.status(200).json({
            message:error
        })
    })
}
//to get data in recon tables
exports.get_table = async(req, res, next)=>{
    const table_name = req.query.table;
    await db.get_table(table_name)
    .then(async(result)=>{
        res.status(200).json({
            result:result,
            message:'get reconciliation table is done!.'
        })
    })
    .catch(error =>{
        res.status(200).json({
            message:error
        })
    });
}



//**************************  register index *************************** */

exports.register_credorex_index = async(req, res, next)=>{
    const processor = req.query.processor;
    //console.log('register here ...');
    switch (processor) {
        case 'credorex':
            await db.register_in_table('credorex_index','credorex',['statement_date', 'transaction_date','posting_date','transaction_currency','cs_settlement_currency','transaction_amount','transaction_type','fixed_transaction_fee','discount_rate','interchange','card_scheme_fees','acquiring_fee','net_activity','card_scheme','merchant_reference_number_h9'])
            .then(result =>{
                console.log('register here ...');
                res.status(200).json({
                    message:'Register in credorax data is done successfully.'
                })
            })
            .then(async result =>{
                await db.deleteAllData('credorex');
            })
            .catch(error =>{
                res.status(200).json({
                    message:error
                })
            });
            break;
    
        default:
            break;
    }
    
}

exports.get_payment_index = async(req, res, next)=>{
    const processor = req.query.processor;
    switch (processor) {
        case 'credorax':
            await db.get_payment_processor('credorex_index','transaction_type','Payment')
            .then(result =>{
                res.status(200).json({
                    result:result
                })
            })
            .catch(error =>{
                res.status(200).json({
                    result:error
                })
            });
            break;
    
        default:
            break;
    }
    
}

exports.get_sum_payment = async(req, res, next)=>{
    const processor = req.query.processor;
    const curr = req.query.curr;
    
    switch (processor) {
        case 'credorax':
            const column_title_condition = 'transaction_type';
            const item_condetion = 'Payment';
            const column_curr = 'cs_settlement_currency';
            await db.get_sum('appdb.credorex_index','net_activity',column_title_condition, item_condetion,column_curr, curr)
            .then(result =>{
                res.status(200).json({
                    result:result,
                    currency:curr
                })
            })
            .catch(error =>{
                res.status(200).json({
                    result:error
                })
            });
            break;
    
        default:
            break;
    }

}

exports.get_sum_recon = async(req, res, next)=>{
    const processor = req.query.processor;
    const curr = req.query.curr;
    await db.get_sum_recon(`appdb.${processor}`,'amount_processor','currency_processor',curr)
        .then(result =>{
            res.status(200).json({
                result:result,
                currency:curr
            })
        })
        .catch(error =>{
            res.status(200).json({
                result:error
            })
    });
      
}

exports.get_sum_refund = async(req, res, next)=>{
    const processor = req.query.processor;
    const curr = req.query.curr;
    
    switch (processor) {
        case 'credorex':
            const column_title_condition = 'transaction_type';
            const item_condetion = 'Refund';
            const column_curr = 'cs_settlement_currency';
            await db.get_sum('appdb.credorex_index','net_activity',column_title_condition, item_condetion,column_curr, curr)
            .then(result =>{
                res.status(200).json({
                    result:result,
                    currency:curr
                })
            })
            .catch(error =>{
                res.status(200).json({
                    result:error
                })
            });
            break;
    
        default:
            break;
    }

}

exports.get_record_statement = async(req, res, next)=>{
    const processor = req.query.processor;
    const date = req.query.date;
    const curr = req.query.curr;

    switch (processor) {
        case 'credorex':
            await db.get_record_statement('credorex_index','statement_date',date,'cs_settlement_currency',curr)
            .then(result =>{
                res.status(200).json({
                    result:result,
                    curr:curr
                })
            })
            .catch(error=>{
                res.status(200).json({
                    result:error
                })
            })
            return 
        default:
            return
    }
}
//----------------------------> Fees
exports.get_sum_fees = async(req, res, next)=>{
    const processor = req.query.processor;
    const curr = req.query.curr;
    const fee = req.query.fee;

    switch (processor) {
        case 'credorex':
            await db.get_sum_fees(`appdb.${processor}_index`,fee,'cs_settlement_currency',curr)
            .then(result =>{
                res.status(200).json({
                    result:result,
                    currency:curr,
                    fee:fee
                })
            })
            .catch(error =>{
                res.status(200).json({
                    result:error
                })
            });
            break;
    
        default:
            break;
    }
    

}
/*
exports.update_recon = async(req, res, next)=>{
    await db.update_reconciliation_credoex()
    .then(result =>{
        res.status(200).json({
            result:result
        })
    })
    .catch(error =>{
        res.status(200).json({
            result:error
        })
    })
}*/






