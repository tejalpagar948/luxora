const express = require("express");
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controllers/wishlistController");
const isLoggedIn = require("../middleware/isLoggedin");

router.post("/", isLoggedIn, addToWishlist);
router.delete("/:productId", isLoggedIn, removeFromWishlist);
router.get("/", isLoggedIn, getWishlist);

module.exports = router;
