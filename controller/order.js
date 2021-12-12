let {Order} = require("../model/Order.js")
let User = require("../model/user");
const {errorHandler} = require("../helpers/userErrorhandler.js");
let Product = require("../model/Product");
 
exports.create=((req,res)=>{
    console.log("Reached");
     req.body.order.user = req.user;
     let norder = new Order(req.body.order);
     norder.save((err,data)=>{
         if(err){
              res.status(400).json({
                 error:errorHandler(err)
             })
           return res.json(data);
             
         }
     })
})


exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];

    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        });
    });

    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history } },
        { new: true },
        (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: "Could not update user purchase history"
                });
            }
      
            next();
        }
    );
};

exports.decreaseQuantity =  async(req, res, next) => {
   req.body.order.products.map(async(item) => {
       let product =  await Product.findById({_id:item._id});
       let newQuantity = product.quantity-item.count;
       let incSold = product.sold+item.count;
         Product.findByIdAndUpdate({_id:item._id},{quantity:newQuantity,sold:incSold})
         .exec((err,data)=>{
             if(err){
                 console.log(err);
             }
           
             next();
         })
    });
 
};

exports.listOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name address")
        .sort("-created")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
};

exports.orderByid = (req, res) => {
     
    Order.findById(req.params.orderid)
        .populate("user", "_id name address")
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

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.findByIdAndUpdate({_id:req.body.orderId},{status:req.body.status}).
    exec((err,data)=>{
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    })
};
exports.orderByuserid = (req, res) => {
    console.log(req.body.id);
    Order.find({user:req.body.id}).
    exec((err,data)=>{
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    })
};