const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getSingleProduct } = require("../controllers/productController");
const upload = require("../config/multer-config");
const isLoggedin = require("../middleware/isLoggedin");

router.get("/", getProducts);
router.post("/create", upload.single("image"), createProduct);
router.get("/edit/:id", getProductById);
router.put("/edit/:id", upload.single("image"), updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/:id", getSingleProduct);

module.exports = router;     