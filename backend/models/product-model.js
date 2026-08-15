const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: Number,
    stock: Number,
    image: String
})

const productModel = mongoose.model("product", productSchema);
mongoose.model("Product", productSchema);

module.exports = productModel;