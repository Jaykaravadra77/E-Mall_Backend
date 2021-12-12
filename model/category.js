const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name:{
       type:String,
       unique:true,
       trim:true,
       required:true,
       maxLenght:32
    }
},{timestamps:true})
let Category = mongoose.model("Category",categorySchema);

module.exports = Category;