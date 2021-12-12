const pdfRouter =require('express').Router();
const {create,createBill} = require("../controller/pdf.js");
const {requireSignin,isAdmin} = require("../controller/auth.js");

pdfRouter.post("/pdf/create",requireSignin,isAdmin,create);
pdfRouter.get('/fetch-pdf', (req, res) => {
     
    console.log("fired",__dirname);
    res.sendFile(`D:/Project/E-Mall_backend/result.pdf`);
})

pdfRouter.post("/bill/create",requireSignin,isAdmin,createBill);
pdfRouter.get('/fetch-bill', (req, res) => {
     
    console.log("fired",__dirname);
    res.sendFile(`D:/Project/E-Mall_backend/bill.pdf`);
})

module.exports = pdfRouter;