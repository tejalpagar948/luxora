const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
                error: "User already exists"
            })
        }
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                return res.status(500).json({
                    message: "Error generating salt",
                    error: err.message
                })
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error hashing password",
                        error: err.message
                    })
                }
                const user = await userModel.create({ fullName, username, email, password: hash });
                const token = generateToken(user);
                res.cookie("token", token);
                res.status(201).json({
                    message: "User Registered",
                });
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
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
            message: "User Not Found",
            error: "User Not Found"
        })
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            const token = generateToken(user);
            res.cookie("token", token);
            res.status(200).json({
                message: "User Logged In",
                success: true
            })
        } else {
            return res.status(404).json({
                message: "Invalid Credentials",
                error: "Invalid Credentials"
            })
        }
    })
}