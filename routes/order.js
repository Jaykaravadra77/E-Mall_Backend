const { Router } = require('express');
const {create} = require("../controller/order.js")
const orderRouter =require('express').Router();
const {requireSignin,isAdmin}  = require('../controller/auth');
const {addOrderToUserHistory} = require("../controller/order.js");
const {decreaseQuantity,listOrders,orderByid,getStatusValues,updateOrderStatus,orderByuserid}  = require("../controller/order.js");
 
 
orderRouter.post("/order/create/:userid",requireSignin,addOrderToUserHistory,decreaseQuantity,create);
orderRouter.get(
    "/order/status-values",
    requireSignin,
    isAdmin,
    getStatusValues
)

orderRouter.get("/order/list",listOrders);
orderRouter.post("/order/:orderid",orderByid)
orderRouter.put(
    "/order/:orderId/status",
    requireSignin,
    isAdmin,
    updateOrderStatus
);
orderRouter.post("/order/byuser/:id",orderByuserid)


module.exports = orderRouter;