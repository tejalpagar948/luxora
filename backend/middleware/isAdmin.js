const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please Login"
        });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_KEY);

        const user = await userModel
            .findOne({ email: decode.email })
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Admin access denied"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};
