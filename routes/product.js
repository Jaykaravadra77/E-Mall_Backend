const productRouter =require('express').Router();
const {isAdmin, requireSignin} = require("../controller/auth.js");
 
const { create,productById,read,deleteProduct,updateProduct ,photo,list,reletedList,listBySearch,pbySearch} = require('../controller/product.js');

productRouter.post("/product/create",requireSignin,isAdmin,create);
productRouter.get("/product/:productId",read);
productRouter.delete("/product/:productId",requireSignin,isAdmin,deleteProduct);
productRouter.put("/product/:productId",requireSignin,isAdmin,updateProduct);
productRouter.get("/products",list); 
productRouter.get("/products/:productId",reletedList);
productRouter.post("/products/by/search", listBySearch);
productRouter.get("/products/photo/:productId",photo);
productRouter.post("/products/search", pbySearch);
productRouter.param("productId",productById);



module.exports = productRouter;

