const productModel = require("../models/product-model")

module.exports.getProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json({
            success: true,
            message: "Products Router",
            data: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
    }
}

module.exports.createProduct = async (req, res) => {
    const { title, description, category, price, stock } = req.body
    try {
        const product = await productModel.create({
            title,
            description,
            category,
            price,
            stock,
            image: req.file.path,
        })
        res.json({
            success: true,
            message: "Product Created Successfully",
            data: product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Product Creation",
            error: error.message
        })
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.json({
            success: true,
            message: "Product Found",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Product Fetching",
            error: error.message
        })
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };
        console.log("updateData", updateData)
        if (req.file) {
            updateData.image = req.file.path;
        }
        const product = await productModel.findOneAndUpdate({ _id: req.params.id }, updateData, { new: true });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.json({
            success: true,
            message: "Product Updated Successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Product Updation",
            error: error.message
        });
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id)
        res.json({
            success: true,
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Error in Product Deletion",
            error: error.message
        })
    }
}

module.exports.getSingleProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.json({
            success: true,
            message: "Product Found",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Product Fetching",
            error: error.message
        })
    }
}