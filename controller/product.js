const Product = require("../model/Product.js");
const formidable = require('formidable');
const _ = require('lodash');
const { errorHandler } = require("../helpers/userErrorhandler.js");
const fs = require('fs');
const mongoose = require('mongoose');

exports.create = ((req, res) => {

    let form = new formidable.IncomingForm();
    // console.log("Method Invoked")
    // console.log(form);
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {

        const { name, descreption, price, category, shipping } = fields;

        if (!name || !descreption || !price || !category ) {
            return res.json({
                error: "All the fields are required"
            })
        }
        // console.log(err);
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        let product = new Product(fields);

        if (files.photo) {
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        if (files.photo) {
            if (files.photo.size > 500000) {
                return res.status(400).json({
                    error: "Photo size should be lessthan 0.5 MB"
                })
            }
        } else {
            return res.status(400).json({
                error: "Please upload image"
            })
        }
        // console.log(fields);


        product.save((err, product) => {
            // console.log(err);
            if (err) {
                return res.status(400).json({
                    error: "Filled the form with valid data"
                })
            }
            res.json({
                product
            })
        })


    })
})


exports.productById = (async(req, res, next, id) => {
    console.log(id);
     let product = await Product.findById({_id:id});
        req.product = product;
    
        next();
   

})

exports.read = ((req, res, next) => {
    req.product.photo = undefined;
    return res.json(req.product);
})

exports.deleteProduct = ((req, res ) => {
     Product.findByIdAndDelete({_id:req.body.productId}).exec((err,success)=>{
         if(err){
            return res.status(400).json({
                error: "Filled the form with valid data"
            })
         }
         res.json("Product Deleted Successfully");
     })
})


exports.updateProduct = ((req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                "err": "Image could not be uploaded"
            })
        }

        let product = req.product;
        _.extend(product, fields);

        if (files.photo) {
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        if (files.photo) {
            if (files.photo.size > 500000) {
                return res.status(400).json({
                    "err": "Photo size should be lessthan 0.5 MB"
                })
            }
        } 
        const { name, descreption, price, category, shipping } = fields;

        // if (!name || !descreption || !price || !category || !shipping || !files.photo) {
        //     return res.json({
        //         "err": "All the fields are required"
        //     })
        // }

        product.save((err, product) => {

            if (err) {
                return res.status(400).json({
                    err: "somethin wents wrong"
                })
            }
            res.json({
                product,
                message: "Updated Sussessfully"
            })
        })


    })
})


exports.list = ((req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 4;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                // console.log(err);
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(products);
        })

})


exports.reletedList = ((req, res) => {
    let limit = req.query.limit ? req.query.limit : 6;
    // console.log("Product fired");
    Product.find({ _id: { $ne: req.product._id }, category: req.product.category ? req.product.category : "" }).populate('category', '_id name').limit(limit).select("-photo")
        .exec((err, product) => {
            if (err) {
                return res.json({
                    error: "Product Not Found"
                })

            }
            return res.json(product);
        })
})




exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip) ? req.body.skip : "";
    let findArgs = {};
    let str = "61548cd913ef2962cbe3c79c";
    // console.log("Fired")
     
     let filter = req.body.filter;
    //  console.log(filter);
     let narry =[];
     filter.map((c,i)=>{
        let cn = mongoose.Types.ObjectId(c);
        narry.push(cn);
     })
 
    Product.find({category:{$in:narry}}).select("-photo").exec((err,data)=>{
        if(err){
            return res.json("You have error");
        }
        // console.log(data);
        res.json({
            data
        })
    })
    // '_id': { $in: [
    //     mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
    //     mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 
    //     mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
    // ]}

    //     Product.find({category:{$in:[mongoose.Types.ObjectId("61548621ff800c76014f391d") ]}})
    //         .select("-photo")
    //         .populate("category")
    //         .sort([[sortBy, order]])
    //         .skip(skip)
    //         .limit(limit)
    //         .exec((err, data) => {
    //             if (err) {
    //                 console.log(err);
    //                 return res.status(400).json({
    //                     error: "Products not found"
    //                 });
    //             }
    //             res.json({
    //                 size: data.length,
    //                 data
    //             });
    //         });
};


exports.photo = ((req, res, next) => {
    // console.log("Photo fired");
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
})

exports.pbySearch = ((req,res) => {
    let narry =[];
    let cat = req.body.catfSearch;
    let query ={}
    cat === "All" ?query ={name:req.body.name}:query={name:req.body.name,category:cat} 
  
  
    // console.log(narry);
   Product.find(query).select("-photo").exec((err,data)=>{
       if(err){
           return res.json("You have error");
       }
       // console.log(data);
       res.json({
           data
       })
   })
})

