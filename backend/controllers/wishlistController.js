const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

module.exports.addToWishlist = async (req, res) => {
    const { productId } = req.body;
    if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify product exists in database
        const productExists = await productModel.findById(productId);
        if (!productExists) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Prevent duplicate products from being added
        const exists = user.wishlist.some(id => id.toString() === productId);
        if (!exists) {
            user.wishlist.push(productId);
            await user.save();
        }

        // Populate and return updated wishlist
        await user.populate("wishlist");
        
        // Filter out any null/undefined products that may have been deleted
        const activeWishlist = user.wishlist.filter(product => product);

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist: activeWishlist,
            data: activeWishlist
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

module.exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Remove the product from user's wishlist
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        // Populate and return updated wishlist
        await user.populate("wishlist");

        // Filter out any null/undefined products that may have been deleted
        const activeWishlist = user.wishlist.filter(product => product);

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist: activeWishlist,
            data: activeWishlist
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

module.exports.getWishlist = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate("wishlist");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Filter out any products that might have been deleted from the database
        const activeWishlist = user.wishlist.filter(product => product);
        return res.status(200).json({
            success: true,
            wishlist: activeWishlist,
            data: activeWishlist
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
