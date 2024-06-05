

const { Checkout} = require('checkout-sdk-node');
/*-------------------------------------*/
exports.checkoutAPI = async(req, res, next) =>{
    /*
    const cko = new Checkout('52B7F348CFA448B37528C9F63F6AF09E'
        ,'pk_sd5fr47pwdfcczsu5ngxfkym6mu',{
        pk:'52B7F348CFA448B37528C9F63F6AF09E'
    });*/

    /*
    const cko = new Checkout('pc_4sf4nku2utpuvezgx3xxpmxf7a', {
        pk: 'pk_sd5fr47pwdfcczsu5ngxfkym6mu'
    });*/
    const cko = new Checkout('sk_5sxromcmzfap6fn5642l2ezu7qj');

    /*
    const action = await cko.payments.capture().then(result =>{
        
    }).catch(err => console.log(err));

    res.status(200).json({
        message:'data',
        data:action,
        resultData:result
    });*/

    //console.log(cko);

    try {
        const payment = await cko.reconciliation.getPaymentsCsv({body:'test'});
        res.status(200).json({
            result:payment,
           // data:cko
        })
    } catch (err) {
        console.log(err.name);
    }
};