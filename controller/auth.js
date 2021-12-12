const User = require("../model/user.js");
const { errorHandler } = require("../helpers/userErrorhandler.js");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const {Order} = require("../model/Order")



exports.signup = ((req, res) => {
    // console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {

        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            user
        });
    })


})


exports.signin = (async (req, res) => {



    // console.log(req.body);
    User
        .findOne({ email: req.body.email1 })
        .exec(function (err, user) {
            if (err || !user) {
                res.status(401).json({
                    error: "user with this email dose not exist, please signup"
                })
            } else {
                const auth = user.verifyPassword(req.body.password1, user.salt, user.hash);
                if (auth === false) {
                    return res.status(401).json({
                        error: "Invalid Credentials",
                    })
                }

                const token = jwt.sign({ _id: user._id }, process.env.secrete);
                res.cookie('jwt', token, { expire: new Date() + 9999 })

                const { _id, name, email, role } = user;
                userByid(_id.toString());
                return res.json({ token, user: { _id, name, email, role } });
            }
        });



    async function userByid(id) {
        let user = await User.findById({ _id: id });
        req.user = user;


    }


})


exports.signout = ((req, res) => {

    req.user = null;

    res.clearCookie("jwt");
    res.json({
        message: "Signout Successfully"
    })
})

exports.requireSignin = (async (req, res, next) => {
    try {

        const token = req.cookies.jwt || req.headers.authorization;
        // console.log("token",token);
        const veryfiyUser = jwt.verify(token, process.env.secrete);
        // console.log(veryfiyUser);
        let user = await User.findById({ _id: veryfiyUser._id });
        req.user = user;
        

        next();
    } catch (err) {

        res.status(401).json({
            err: "Authorization error ! you are not authorized please signin"
        })
    }





})

exports.isAdmin = ((req, res, next) => {

    if (req.user.role === 0) {
        return res.status(403).json({
            err: "Admin Recource! Access Denied"
        })
    }
    next();
})


exports.read = (req, res) => {
    req.user.hash = undefined;
    req.user.salt = undefined;
    return res.json(req.user);
};


function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

exports.update = async (req, res) => {
    console.log(req.body);
    if (req.body.password) {
        let password = genPassword(req.body.password);
        req.body.salt = password.salt;
        req.body.hash = password.hash;

    }

    delete req.body.password;
    let nuser = req.body;
    console.log(nuser);
    try {
        let user = await User.findByIdAndUpdate({ _id: req.user._id }, nuser, { new: true });
        return res.json(user);
    } catch (err) {
         console.log(err);
            return res.status(400).json({
                error: errorHandler(err)
            });
        
    }



};


exports.purchaseHistory = (req, res) => {
    Order.find({ user: req.user._id })
        .populate("user", "_id name")
        .sort("-created")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(orders);
        });
};

