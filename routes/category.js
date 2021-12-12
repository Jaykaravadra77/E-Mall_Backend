const categoryRouter =require('express').Router();
 

const { requireSignin,isAdmin ,} = require('../controller/auth.js');
const {create,read,categoryById,updateCategory,deleteCategory, list} = require("../controller/category.js");
const { categoryValidator } = require('../validator/index.js');

categoryRouter.post("/category/create/",requireSignin,categoryValidator,isAdmin,create);
categoryRouter.get("/category/:categoryId", read);
categoryRouter.get("/category", list);
categoryRouter.put("/category/:categoryId",requireSignin,isAdmin,updateCategory);
categoryRouter.delete("/category/:categoryId",requireSignin,isAdmin,deleteCategory);

categoryRouter.param("categoryId",categoryById);

module.exports = categoryRouter;

