
let validator = require('validator');
exports.signupValidator = (req, res,next)=>{
    
    let errors = [];
    let emailCheck = validator.isEmail(req.body.email);
   
    if(!emailCheck){
        let errmsg = "Please Enter email";
        errors.push(errmsg);
    }else  if(!validator.isLength(req.body.email,{max:32})){
        let errmsg = "invalid email! email should lessthan 32 characters";
        errors.push(errmsg);
    } 
       
     if(!validator.isLength(req.body.password,{min:6})){
        let errmsg = "minimum 6 character password required";
        errors.push(errmsg);
     }

    if(errors.length > 0){
       const firstError = errors[0];
       return res.status(400).json({error:firstError});
    }
    next();
}


exports.categoryValidator = ((req,res,next)=>{
 
    let errors = [];
    let value =req.body.value;
 
    if(value){
        let name = validator.trim(req.body.value);
        if(!validator.isLength(name,{min:1})){
            let errmsg = "Category Name requird";
            errors.push(errmsg);
          }
       
          if(errors.length > 0){
           const firstError = errors[0];
           return res.status(400).json({error:firstError});
        }
    }else{
        return res.status(400).json({
            error:"Please Enter Category Name"
        })
    }
   
 next();
})

exports.passwordValidator =((req,res,next)=>{
    
    if(!validator.isLength(req.body.password,{min:6})){
        let errmsg = "minimum 6 character password required";
        return res.status(400).json({
            error: errmsg
        })
     }
     next();
})