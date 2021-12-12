let pdfTemplate= require('../Documents/index.js');
let billTemplate = require("../Documents/bill.js");
let pdf = require('html-pdf');
exports.create = ((req, res, next) => {
 
    pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
})


exports.createBill = ((req, res, next) => {
    console.log("Reached");
 
    pdf.create(billTemplate(req.body), {}).toFile('bill.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
})

 