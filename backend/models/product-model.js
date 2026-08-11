const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: Number,
    stock: Number,
    image: String
})

module.exports = mongoose.model("product", productSchema);