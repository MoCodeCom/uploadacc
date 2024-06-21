const auth = require('../modules/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/********************************************* */

exports.createAuthTbl = (req, res, next)=>{
    auth.create_auth_table()
    .then(async()=>{
        res.status(200).json(
            {message:'the table has been generated.'}
        )
    })
    .catch(err =>{
        res.status(200).json({message:'The table exist already in the database!'})
        if(error.sqlMessage.includes('already exists')){
            res.status(200).json(
                { message:'The table exist already in the database!'}
            )
        }
    });
}

exports.isAuth = async( req, res, next)=>{
    const username = req.query.username;
    const password = req.query.password;
    //const token = jwt.sign({auth:'AUTHORISE'}, 'SECRET');
    //console.log(token);
    await auth.login(username, password)
    /*
    .then(result =>{
        return bcrypt.hash(password, 12);
    })*/
    .then(result=>{
        console.log(result[0][0]);
        //console.log(bcrypt.hashSync(password,12));

        res.status(200).json({
            result:result,
            token:jwt.sign(result[0][0],'SECRET'),
            message:'login is done!'
        })
    })
    
    .catch(error =>{
        res.status(200).json({message:'There is an error in login.'})
    });
}