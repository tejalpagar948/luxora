const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
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
                message: "Unauthorized"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
};