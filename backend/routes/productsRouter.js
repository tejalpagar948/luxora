const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getSingleProduct } = require("../controllers/productController");
const upload = require("../config/multer-config");
const isLoggedin = require("../middleware/isLoggedin");
const isAdmin = require("../middleware/isAdmin");

router.get("/", getProducts);
router.post("/create", isAdmin, upload.single("image"), createProduct);
router.get("/edit/:id", isAdmin, getProductById);
router.put("/edit/:id", isAdmin, upload.single("image"), updateProduct);
router.delete("/delete/:id", isAdmin, deleteProduct);
router.get("/:id", getSingleProduct);

module.exports = router;     