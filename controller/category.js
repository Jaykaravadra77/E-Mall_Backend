const Category = require('../model/category.js');
const { errorHandler } = require("../helpers/userErrorhandler.js");
const Product = require('../model/Product.js');
const { find } = require('../model/category.js');

exports.create = ((req, res) => {
    console.log(req.body);
    let name = req.body.value;
    const category = new Category({ name });

    category.save((err, category) => {
        if (err) {
            //   console.log(err);
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            category
        })
    })
})


exports.categoryById = ((req, res, next, id) => {
    Category.findById({ _id: id }).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        req.category = category;
        next();
    })
})


exports.read = ((req, res) => {
    res.json(req.category);
})


exports.updateCategory = ((req, res) => {
    let category = req.category;
    category.name = req.body.name;
    category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        res.json({
            message: "Category Updated Successfully"
        })
    })


})

exports.deleteCategory = (async (req, res) => {

    let category = req.category;

    let product = await Product.find({ category: category._id });
    if (product.length > 0) {
        product.forEach((p, i) => {
            p.remove((err, data) => {
                if (!err) {
                    console.log("delete conforme");
                }
            })
        })
    }

    category.remove((err, removed) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        res.json({
            message: "Category Deletd successfully"
        })
    })
})

exports.list = ((req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        res.json({
            categories
        })
    })
})