const expensesDb = require('../../modules/DbExpenses');

/*--------------------------------------------------------*/
exports.createExpenses = (req,res, next)=>{
    expensesDb.createTable_expenses_details()
    .then(result =>{
        res.status(200).json({
            message:'The expenses detail table is created successfully.'
        })
    })
    .catch(error =>{
        console.log(error);
        if(error['errno'] === 1050){
            res.status(200).json({
                message:'The table is exist already in the database.'
            })
        }else{
            res.status(200).json({
                message:'There is an error when greate table.'
            })
        }
        
    })
}

exports.createExpensesList = (req,res, next)=>{
    expensesDb.createTable_expenses_list()
    .then(result =>{
        res.status(200).json({
            message:'The expenses detail table is created successfully.'
        })
    })
    .catch(error =>{
        console.error(error);
        if(error['errno'] === 1050){
            res.status(200).json({
                message:'The table is exist already in the database.'
            })
        }else{
            res.status(200).json({
                error:error,
                message:'There is an error when greate table.'
            });
        }
        
    })
}

exports.dropExpensestbl = (req, res, next)=>{
    const table = req.query.table;
    console.log(table);
    expensesDb.deleteTable(table)
    .then(result =>{
        res.status(200).json({
            message:'The expenses table is cleared.'
        });
    })
    .catch(error =>{
        res.status(200).json({
            message:'There is an error when drop expenses table.'
        });
    })
}

exports.deleteAllExpenses = (req, res, next)=>{
    const table = req.query.table;
    expensesDb.deleteAllData(table)
    .then(result =>{
        res.status(200).json({
            message:'All expenses data are deleted.'
        })
    })
    .catch(error =>{
        console.error(error);
        res.status(200).json({
            message:error
        })
    })
}

exports.deleteInvoice = (req, res, next)=>{
    const invoiceNo = req.query.id;
    expensesDb.deleteInvoice(invoiceNo)
    .then(result =>{
        res.status(200).json({
            message:`Invoice with No ${invoiceNo} has been deleted.`
        })

    })
    .catch(error =>{
        console.log(error);
        res.status(200).json({
            message:error
        })
    })
}
/***************************** Insert Expenses *********************/
exports.insert_expenses_detail = (req, res, next)=>{
    const data = req.body.data;
    console.log(data);
    expensesDb.adding_expenses_detail(data)
    .then(result =>{
        if (err) {
            return res.status(500).send('Failed to insert data');
        }
        res.status(200).json({
            message:'The data expenses has been added.'
        })
    })
    .catch(error =>{
        console.error(error);
        res.status(200).json({
            message:error
        });
    })
}

exports.insert_expenses_list = (req, res, next)=>{
    const data = req.body.data;
    expensesDb.adding_expenses_list(data)
    .then(result =>{
        expensesDb.exist_row(`"${data['invoice_number']}"`)
        .then(result =>{
            if(result[0] === null || result[0] == []){
                res.status(200).json({
                    message:'The data expenses has been added successfully.'
                })
            }else{
                res.status(200).json({
                    message:'The invoice is exist already.'
                })
            }

        })
        .catch(error =>{
            console.error(error);
        });
        
    })
    .catch(error =>{
        console.error(error);
        res.status(200).json({
            message:error
        });
    })
}

exports.getAllExpenses = (req, res, next)=>{
    expensesDb.getAllExpenses()
    .then(result =>{
        res.status(200).json({
            result:result
        })
    })
    .catch(error =>{
        console.error(error);
    })
}

exports.getExpensesById = (req, res, next)=>{
    const id = req.query.id;
    expensesDb.getExpensesById(id)
    .then(result =>{
        console.log(result);
        res.status(200).json({
            result:result
        })
    })
    .catch(error =>{
        console.error(error);
    })
}