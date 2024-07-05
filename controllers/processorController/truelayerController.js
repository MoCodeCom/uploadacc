const db = require("../../modules/DbTruelayer");

/*----------------------------------------*/

/********************* Create table ********** done */ 
//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Create database                            |
//|_____________________________________________________________________|
/*checkout table */
exports.createTbl_truelayer = (req,res,next)=>{
    db.createTable_truelayer()
    .then(result =>{
        //console.log(result);
        res.status(200).json(
            {message:'The truelayer table is created successfully.'}
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
exports.createTbl_truelayer_index = (req,res,next)=>{
    db.createTable_truelayer_index()
    .then(result =>{
        res.status(200).json(
            {message:'The truelayer table is created successfully.'}
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
    db.createTable_cp_truelayer()
    .then(result =>{
        console.log(result);
        res.status(200).json(
            {message:'The truelayer table is created successfully.'}
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

//recon system
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

//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Clear/Drop database table                  |
//|_____________________________________________________________________|


//Drop database table

exports.deletetbl = async (req, res, next)=>{
    const table = req.query.table;
    switch (table) {
        case 'truelayer':
            await db.deleteTable('truelayer')
            .then(result =>{
                console.log(result);
                res.status(200).json(
                    {message:'The truelayer is deleted from database successfully.'}
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
        case 'cp_truelayer':
            await db.deleteTable('cp_truelayer')
            .then(result =>{
                console.log(result);
                res.status(200).json(
                    {message:'The cp_truelayer is deleted from database successfully.'}
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
        case 'truelayer_recon':
            await db.deleteTable('truelayer_recon')
            .then(result =>{
                res.status(200).json(
                    {message:'The recon_truelayer is deleted from database successfully.'}
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
        case 'system_recon_truelayer':
            await db.deleteTable('system_recon_truelayer')
            .then(result =>{
                res.status(200).json(
                    {message:'The recon_truelayer is deleted from database successfully.'}
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
        case 'truelayer_index':
            await db.deleteTable('truelayer_index')
            .then(result =>{
                res.status(200).json(
                    {message:'The recon_truelayer is deleted from database successfully.'}
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

// Clear database

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

//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Reconciliation                             |
//|_____________________________________________________________________|

// to copy data to recon tables
exports.copy_data_recon_truelayer = async(req, res, next)=>{
    const truelayer_rows = ['amount','currency','status','type','reference','date','provideName','failureReason','statementDate'];
    const system_rows = ['ID_trans','sDate','rDate','Status','Paid','pCrn','Received','rCrn','Processor','Pay_out_agent','PID'];
    await db.copy_data_to_recon_tbl('truelayer_recon','truelayer',truelayer_rows).then(async()=>{
        await db.copy_data_to_recon_tbl('system_recon_truelayer','cp_truelayer',system_rows);
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

//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Get recon tables                           |
//|_____________________________________________________________________|
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

//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Searching                                  |
//|_____________________________________________________________________|

exports.searching_processor_recon = async(req, res, next)=>{
    const item = req.params.item;
    const table = req.query.table;
   switch (table) {
    case 'truelayer_recon':
        await db.searching(table,'amount',item, 'reference', item)
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
    case 'system_recon_truelayer':
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


//|---------------------------------------------------------------------|
//|                                                                     |
//|                          Matching                                  |
//|_____________________________________________________________________|
//delete row from recon table "MATCH"
exports.deleteRow_recon_match = async(req, res, next)=>{
    const id = req.params.id;
    const table = req.query.table;

    switch (table) {
        case 'truelayer_recon':
            const condition_1 = `reference = "${id}"`;    
            await db.delete_row_reconciliation_match('truelayer_recon',condition_1)
            .then(async result =>{
                
                let condition_2 = `ID_trans = "${id}"`;
                await db.delete_row_reconciliation_match('system_recon_truelayer',condition_2)
                .then(()=>{
                    res.status(200).json({message:'delete data row form table is done!.'})
                })
                //res.status(200).json({message:'delete data row form table is done!.'})
            })
            .catch(error =>{
                res.status(200).json({message:error});
            });
            break;
        case 'system_recon_truelayer':
            const condition_2 = `ID_trans = "${id}"`;
            await db.delete_row_reconciliation_match('system_recon_truelayer',condition_2)
            .then(async result =>{
                // Delete processor transaction as auto match in checkout processor because the amount different.
                const condition_1 = `reference = "${id}"`;
                await db.delete_row_reconciliation_match('truelayer_recon',condition_1)
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









