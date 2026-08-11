const mongoose = require("mongoose");
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

module.exports.getCart = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate("cart.product");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Filter out any cart items where the product doesn't exist anymore
        const activeCart = user.cart.filter(item => item.product);
        return res.status(200).json({ success: true, data: activeCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports.addToCart = async (req, res) => {
    const { id } = req.params; // Product ID
    const quantity = Number(req.body.quantity) || 1;
    console.log("add to cart quantity:", quantity, "product_id:", id);
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let hasLegacy = false;
        const migratedCart = [];
        if (Array.isArray(user.cart)) {
            user.cart.forEach(item => {
                if (typeof item === "string" || item instanceof mongoose.Types.ObjectId) {
                    hasLegacy = true;
                    migratedCart.push({ product: item, quantity: 1 });
                } else if (item && item.product) {
                    migratedCart.push(item);
                }
            });
        }
        if (hasLegacy) {
            user.cart = migratedCart;
        }

        const existingItem = user.cart.find(item => item.product && item.product.toString() === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: id, quantity });
        }

        await user.save();
        return res.status(200).json({ success: true, message: "Product added to cart" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports.updateCart = async (req, res) => {
    const { id } = req.params; // Cart item _id or Product ID
    const quantity = Number(req.body.quantity);
    if (quantity === undefined || isNaN(quantity)) {
        return res.status(400).json({ success: false, message: "Quantity is required" });
    }
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Try to find the item in user.cart by subdocument _id or product _id
        const item = user.cart.id(id) || user.cart.find(item => item.product && item.product.toString() === id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        item.quantity = quantity;
        await user.save();
        return res.status(200).json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports.deleteFromCart = async (req, res) => {
    const { id } = req.params; // Cart item _id or Product ID
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Remove using mongoose subdocument pull if id matches _id
        user.cart.pull(id);

        // Also remove if id matches product id to be safe
        user.cart = user.cart.filter(item => item.product && item.product.toString() !== id);

        await user.save();
        return res.status(200).json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports.deleteManyFromCart = async (req, res) => {
    const { ids } = req.body;
    if (!ids) {
        return res.status(400).json({ success: false, message: "IDs are required" });
    }
    const idArray = Array.isArray(ids) ? ids : [ids];
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Bulk-delete from user's cart array using updateMany with $pull and $in
        await userModel.updateMany(
            { email: req.user.email },
            { $pull: { cart: { _id: { $in: idArray } } } }
        );
        await userModel.updateMany(
            { email: req.user.email },
            { $pull: { cart: { product: { $in: idArray } } } }
        );

        // Fetch and return the updated, populated cart
        const updatedUser = await userModel.findOne({ email: req.user.email }).populate("cart.product");
        const activeCart = updatedUser ? updatedUser.cart.filter(item => item.product) : [];

        return res.status(200).json({ success: true, data: activeCart, message: "Items removed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};