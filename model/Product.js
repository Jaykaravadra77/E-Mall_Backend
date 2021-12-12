let mongoose = require('mongoose');
const  {ObjectId} = mongoose.Schema;
const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:32,
       
    },
    descreption:{
        type:String,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:10
    },
    category:{
        type:ObjectId,
        ref:'Category',
        required:true
    },
    quantity:{
        type:Number,
    },
    photo:{
        data:Buffer,
        contentType:String,
    },
    shipping:{
        required:false,
        type:Boolean
    },
    sold:{
        type:Number,
        default:0
    }

},{timestamps:true})

 
let Product = mongoose.model("product",productSchema);

module.exports= Product;
