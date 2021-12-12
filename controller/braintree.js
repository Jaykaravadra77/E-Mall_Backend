exports.genrateToken = ((req,res)=>{

// console.log("token Genratede");
});
   
 
const braintree = require("braintree");
require("dotenv").config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.braintree_merchentid,
    publicKey: process.env.braintree_publickey,
    privateKey: process.env.braintree_privatekey

  }); 


exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};