const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const isLoggedin = require("../middleware/isLoggedin");

// Create Razorpay Order: POST /api/create-order or /payment/create-order
router.post("/create-order", isLoggedin, createOrder);

// Verify Razorpay Payment Signature: POST /api/verify-payment or /payment/verify-payment
router.post("/verify-payment", isLoggedin, verifyPayment);

module.exports = router;
