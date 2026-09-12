const express = require("express");
const router = express.Router();
const { getUserOrders, getUserOrderDetails, cancelOrder } = require("../controllers/orderController");

router.get("/", getUserOrders);
router.get("/:orderId", getUserOrderDetails);
router.post("/:orderId/cancel", cancelOrder);

module.exports = router;
