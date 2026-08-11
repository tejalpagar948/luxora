const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCart, deleteFromCart, deleteManyFromCart } = require("../controllers/cartController");
const isLoggedin = require("../middleware/isLoggedin");

router.get("/", isLoggedin, getCart);
router.post("/delete-many", isLoggedin, deleteManyFromCart);
router.post("/:id", isLoggedin, addToCart);
router.put("/:id", isLoggedin, updateCart);
router.delete("/:id", isLoggedin, deleteFromCart);

module.exports = router;
