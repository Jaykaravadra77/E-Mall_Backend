const express = require("express");
const router = express.Router();

const { requireSignin } = require("../controller/auth");
const { userById } = require("../controller/auth");
const { generateToken, processPayment } = require("../controller/braintree");

router.get("/braintree/getToken", requireSignin,generateToken);
router.post(
    "/braintree/payment/",
    requireSignin,
    processPayment
);

 

module.exports = router;