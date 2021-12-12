let express =require('express');
let router = express.Router();
let User = require('../model/user.js');
const {signup,signin,signout,purchaseHistory,requireSignin,read,update} =require('../controller/auth');
const {signupValidator,passwordValidator} =require("../validator/index.js");
let crypto = require('crypto');
const nodemailer = require('nodemailer');

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     secure: false,
//     auth: {
//         user: process.env.EMAIL || 'jaykaravadra77@gmail.com', 
//         pass: process.env.PASSWORD || 'jay@0074'
//     },
//     tls:{
//         rejectUnauthorized:false
//     }
// });
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465
    auth: {
        user: 'jaykaravadra77@gmail.com', // your gmail email adress
        pass:'jay@0074'// your gmail password
    }
});

function verifySmtp(){
    // verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready for emails');
    }
    return true;
});
}
verifySmtp();

let EMAIL = `http://localhost:3000/`;

router.post("/signup",signupValidator,signup);
router.post("/signin",signin);

router.get("/normal",requireSignin,(req,res)=>{
    return res.json({
        "msg":"NORMAL ROUTE"
    })
 })
 // unothorized routes mention upperside
// router.use(requireSignin,async(req,res,next)=>{
    
//     let user = await User.findById({_id:req.auth._id});
//     req.user= user;
//         next();
//   })
// autorized routes mention belowside
router.get("/rauth",(req,res)=>{
    return res.json({
        user:req.user
    })
})

router.get("/signout",signout);


router.get("/user/:userId", requireSignin , read);
router.put("/user/:userId", requireSignin , update);
router.get("/orders/by/user", requireSignin, purchaseHistory);

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-replay@insta.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${EMAIL}reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})
 

router.post('/new-password',passwordValidator,(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
       
       
          let hashsalt =genPassword(newPassword);
          user.hash=hashsalt.hash;
          user.salt = hashsalt.salt;
          user.resetToken = undefined
          user.expireToken = undefined
          user.save().then((saveduser)=>{
            res.json({message:"password updated success"})
        })
    }).catch(err=>{
        console.log(err)
    })
})

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}

 module.exports=router;