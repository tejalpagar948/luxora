const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const orderModel = require("../models/order-model");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                error: "User already exists"
            })
        }
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error generating salt",
                    error: err.message
                })
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Error hashing password",
                        error: err.message
                    })
                }
                const user = await userModel.create({ fullName, username, email, password: hash });
                const token = generateToken(user);
                
                const isProduction = process.env.NODE_ENV === "production";
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: isProduction ? "none" : "lax",
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                });

                res.status(201).json({
                    success: true,
                    message: "User Registered",
                });
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
}

module.exports.loginUser = async (req, res) => {
    console.log("Login API Hit");
    const { email, password } = req.body;
    let user = await userModel.findOne({ email: email })
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User Not Found",
            error: "User Not Found"
        })
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            const token = generateToken(user);
            
            const isProduction = process.env.NODE_ENV === "production";
            res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            res.status(200).json({
                message: "User Logged In",
                success: true
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "Invalid Credentials",
                error: "Invalid Credentials"
            })
        }
    })
}

module.exports.logoutUser = async (req, res) => {
    const user = req.user
    try {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: "User not found"
            })
        }
        res.clearCookie("token");
        res.status(200).json({
            message: "User Logged Out",
            success: true
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error logging out user",
            error: err.message
        })
    }
}

module.exports.getUserProfile = async (req, res) => {
    try {
        const userObj = req.user.toObject();
        const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 });
        userObj.orders = orders;
        return res.status(200).json({
            success: true,
            data: userObj
        });
    } catch (error) {
        console.error("Error in user profile route:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};