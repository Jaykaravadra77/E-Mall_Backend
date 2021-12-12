
const User = require("../model/user.js");
const { errorHandler } = require("../helpers/userErrorhandler.js");
exports.getallUsers = ((req, res) => {
    User.find({ role: 0 }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        } else {
            res.json(data);
        }
    })

})

exports.deleteUser = (async (req, res) => {
    try {
        console.log(req.body);
        let result = User.deleteOne({ _id: req.body.id });
        result.remove((err, suc) => {
            if (!err) {
                return res.json("User Successfully Deleted");
            }
        })

    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
})