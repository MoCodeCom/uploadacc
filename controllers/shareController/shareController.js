
const db = require("../../modules/Db");

/******************************************************/
/*
exports.count_table = (req, res, next)=>{
    const table = req.query.table;
    const id_name = req.query.id_name;
    const processor = req.query.processor

    
    switch (processor) {
        case 'credorex':
            db.count_table(`appdb.${table}`, `${id_name}`,'amount_system')
            .then(result =>{
                res.status(200).json({
                    result:result
                })
            })
            .catch(error =>{
                res.status(200).json({
                    error:error
                })
            })
            break;
    
        default:
            break;
    }
    
}*/