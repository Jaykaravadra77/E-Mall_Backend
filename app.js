const express = require('express');
const app= express();
const mongoose= require('mongoose');
require('dotenv').config();
const port=process.env.port || 8000;
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes= require('./routes/auth.js')
const categoryRouter = require("./routes/category.js");
const productRouter = require("./routes/product.js");
const braintreeRouter = require("./routes/braintree.js");
const orderRouter = require("./routes/order.js");
const userRouter = require("./routes/user.js");
const pdfRouter = require("./routes/pdf.js");

mongoose.connect(process.env.dburl,{
    useNewUrlParser:true,

     
}).then(()=>{
    console.log("Connect Successfully ");
}).catch((err)=>{
    console.log(err);
})
 
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api",authRoutes);
app.use("/api",categoryRouter);
app.use("/api",productRouter);
app.use("/api",braintreeRouter);
app.use("/api",orderRouter);
app.use("/api",userRouter);
app.use("/api",pdfRouter);



app.listen(port,()=>{
    console.log(`listing on port${port}`);
})