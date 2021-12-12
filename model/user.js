let mongoose = require('mongoose');
let crypto = require('crypto');
let validator = require('validator');
const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:32,
       
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:32,
    },
    hash:{
        type:String,
        required:true
    },
    salt:{
        type:String,
        required:true
    },
    about:{
        type:String,
        trim:true
    },
    role:{
        type:Number,
        default:0
    },
    history:{
        type:Array,
        default:[]
    },
    resetToken:String,
    expireToken:Date,
},{timestamps:true})

 



userSchema.virtual('password').set(function(password){
    this._password = password;
    let salthash = genPassword(password);
    console.log(salthash);
    this.salt= salthash.salt;
    this.hash = salthash.hash;
}).get(function(){
    return this_password;
});

userSchema.methods = {
      verifyPassword : function(password,salt,hash){
       
        var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hash === hashVerify;
     }
}


function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}



let User = mongoose.model("User",userSchema);

module.exports= User;
