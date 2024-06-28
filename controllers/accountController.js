const  accountDb  = require('../modules/DbAccount');
/**********************************************************/
exports.createTbl_account =(req, res, next)=>{
    accountDb.createTable_account()
    .then(result =>{
        /*
        if (err) {
            return res.status(500).send('Failed to insert data');
        }*/
       console.log(result['errno']);
        res.status(200).json({
            message:'Account table has been generated.'
        });
    })
    .catch(error =>{
        console.error(error);
        if(error['errno'] === 1050){
            res.status(200).json({
                message:'The account table exist already.'
            });
        }else{
            res.status(200).json({
                message:'There is an error occure when generate account table.'
            });
        }
    })
}

exports.deleteTbl_account =(req, res, next)=>{
    
    accountDb.deleteTable()
    .then(result =>{
        /*
        if (err) {
            return res.status(500).send('Failed to insert data');
        }*/
        console.log(result['errno']);
        res.status(200).json({
            message:'Account table has been deleted.'
        });
    })
    .catch(error =>{
        
        if(error['errno'] === 1051){
            res.status(200).json({
                message:'The table is not exist.'
            });
        }else{
            res.status(200).json({
                message:'There is an error occure when delete table.'
            });
        }
        
    })
}

exports.deleteAlldata = (req, res, next)=>{
    accountDb.deleteAllData()
    .then(result =>{
        res.status(200).json({
            message:'The table has been cleared.'
        });
    })
    .catch(error =>{
        console.error(error);
        res.status(200).json({
            message:'There is an error occured when clean account table.'
        })
    });
}

exports.add_account =(req, res, next)=>{
    const data = req.body.data;
    //console.log(data[1]);
    accountDb.exist_row(data[1])
    .then(result =>{
        console.log(result[0]);
        if(result[0].length === 0){
            accountDb.adding_account(data)
            .then(result =>{
                res.status(200).json({
                    message:'The account has been added.'
                });
            })
            .catch(error =>{
                console.error(error);
                res.status(200).json({
                    message:'There is an error occured when added a new account'
                });
            })
        }else{
            res.status(200).json({
                message:'The account exist already.'
            });
        }
        
    })
    .catch(error =>{
        console.error(error);
        res.status(200).json({
            message:'There is an error occured when added a new account'
        });
    });
    
}

exports.get_accounts =(req, res, next)=>{
    accountDb.get_accounts()
    .then(result =>{
        res.status(200).json({
            //message:'Get accounts done!',
            result:result
        })
    })
    .catch(error =>{
        console.error(error);
        res.status(200).json({
            message:'There is an error occured when get accounts'
        });
    });
}

exports.deleteById =(req, res, next)=>{
    const account_number = req.query.id;
    console.log(account_number);
    accountDb.deleteDataById(account_number)
    .then(result =>{
        res.status(200).json({
            message:`An account with numbre ${account_number} has been deleted.`
        });
    })
    .catch(error =>{
        console.error(error);
        res.status(200).json({
            message:'There is an error occured when delete an account'
        })
    })
}