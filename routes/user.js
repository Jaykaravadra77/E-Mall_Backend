const userRouter =require('express').Router();
const {getallUsers,deleteUser} = require("../controller/user.js");
const {isAdmin,requireSignin} = require("../controller/auth.js");

 
userRouter.get("/users",getallUsers);
  
userRouter.delete("/user/delete",requireSignin,isAdmin,deleteUser);


module.exports = userRouter;

