const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    stock: Number,
    image: String,
    bg_color: String,
    discount: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model("product", productSchema);