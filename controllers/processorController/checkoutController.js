const db = require("../../modules/DbCheckout");

/*----------------------------------------*/

/********************* Create table ********** done */ 
/*checkout table */
exports.createTbl_checkout = (req,res,next)=>{
    db.createTable_checkout()
    .then(result =>{
        //console.log(result);
        res.status(200).json(
            {message:'The checkout table is created successfully.'}
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

/*checkout index */
exports.createTbl_checkout_index = (req,res,next)=>{
    db.createTable_checkout_index()
    .then(result =>{
        
        res.status(200).json(
            {message:'The checkout table is created successfully.'}
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

//Cp table //
exports.createTbl_cp = (req, res, next)=>{
    db.createTable_cp_checkout()
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The cp_checkout table is created successfully.'}
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





/******************** Delete table ************** done */
//delete credorex

exports.deletetbl = async (req, res, next)=>{
    const table = req.query.table;
    switch (table) {
        case 'checkout':
            await db.deleteTable('checkout')
            .then(result =>{
                console.log(result);
                res.status(200).json(
                    {message:'The checkout is deleted from database successfully.'}
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
        case 'cp_checkout':
            await db.deleteTable('cp_checkout')
            .then(result =>{
                console.log(result);
                res.status(200).json(
                    {message:'The cp_checkout is deleted from database successfully.'}
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
        case 'checkout_recon':
            await db.deleteTable('checkout_recon')
            .then(result =>{
                res.status(200).json(
                    {message:'The recon_checkout is deleted from database successfully.'}
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
        case 'system_recon_checkout':
            await db.deleteTable('system_recon_checkout')
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
        case 'checkout_index':
            await db.deleteTable('checkout_index')
            .then(result =>{
                res.status(200).json(
                    {message:'The recon_checkout is deleted from database successfully.'}
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


exports.searching_processor_recon = async(req, res, next)=>{
    const item = req.params.item;
    const table = req.query.table;
   switch (table) {
    case 'checkout_recon':
        await db.searching(table,'processing_curryncy_amount',item, 'reference_id', item)
        .then(result =>{
            //console.log(item + ' -- '+ table);
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
    case 'system_recon_checkout':
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
/*
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


    })
    .catch(error =>{
        res.status(200).json(
            {
                message:error
            }
        );
    });
}*/

//get data form recon table


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
        case 'checkout_recon':
            const condition_1 = `reference_id = "${id}"`;
            
            await db.delete_row_reconciliation_match('checkout_recon',condition_1)
            .then(result =>{
                res.status(200).json({message:'delete data row form table is done!.'})
            })
            .catch(error =>{
                res.status(200).json({message:error});
            });
            break;
        case 'system_recon_checkout':
            const condition_2 = `ID_trans = "${id}"`;

            await db.delete_row_reconciliation_match('system_recon_checkout',condition_2)
            .then(async result =>{
                // Delete processor transaction as auto match in checkout processor because the amount different.
                const condition_1 = `reference_id = "${id}"`;
                await db.delete_row_reconciliation_match('checkout_recon',condition_1)
                .then(()=>{
                    res.status(200).json({message:'delete data row form table is done!.'})
                })
                .catch(error => console.log(error))

                
            })
            .catch(error =>{
                res.status(200).json({message:error});
            });
            break;
        default:
            break;
    }

    
}








// -----------> plan 2 done -------------//
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
exports.copy_data_recon_checkout = async(req, res, next)=>{
    const processor_rows = ['Processing_Channel_ID', 'action_type','processed_on','processed_currency','fx_rate_applied','holding_currency','reference_id','payment_method','card_type','breakdown_type','processing_curryncy_amount','holding_currency_amount'];
    const system_rows = ['ID_trans','sDate','rDate','Status','Paid','pCrn','Received','rCrn','Processor','Pay_out_agent','PID'];
    await db.copy_data_to_recon_tbl('checkout_recon','checkout',processor_rows).then(async()=>{
        await db.copy_data_to_recon_tbl('system_recon_checkout','cp_checkout',system_rows);
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

exports.register_checkout_index = async(req, res, next)=>{
        const processor = req.query.processor;

    switch (processor) {
        case 'checkout':
            await db.register_in_table('checkout_index','checkout',['Processing_Channel_ID', 'action_type','processed_on','processed_currency','fx_rate_applied','holding_currency','reference_id','payment_method','card_type','breakdown_type','processing_curryncy_amount','holding_currency_amount','statementDate'])
            .then(result =>{
                //console.log(result);
                res.status(200).json({
                    message:'Register in checkout data is done successfully.',
                    result:result
                })
            })
            .then(async result =>{
                await db.deleteAllData('checkout');
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
        case 'checkout':
            await db.get_payment_processor('checkout_index','breakdown_type','payment')
            .then(result =>{
                console.log(result);
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
    //const processor = req.query.processor;
    //const id = req.query.id;
    //const curr = req.query.curr;
    await db.get_record_statement(/*'checkout_index','Processing_Channel_ID',id*/)
            .then(result =>{
                //console.log(result);
                res.status(200).json({
                    result:result,
                    //curr:curr
                })
            })
            .catch(error=>{
                res.status(200).json({
                    result:error
                })
            });

        
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

//-----------------------------> lists
exports.get_fees_lists = async(req,res,next)=>{

    await db.feesList('checkout_index')
    .then(result =>{
        res.status(200).json({
            result:result,
        })
    })
    .catch(error =>{
        res.status(200).json({
            error:error
        })
    })
}


exports.get_refund_lists = async(req,res,next)=>{

    await db.refundList('checkout_index')
    .then(result =>{
        res.status(200).json({
            result:result,
        })
    })
    .catch(error =>{
        res.status(200).json({
            error:error
        })
    })
}







