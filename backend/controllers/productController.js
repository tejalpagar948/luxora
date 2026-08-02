const productModel = require("../models/product-model")

module.exports.getProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json({
            message: "Products Router",
            data: products
        });
    } catch (error) {
        console.log(error);
    }
}