const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/authController");
const { logoutUser } = require("../controllers/authController");
const isLoggedIn = require("../middleware/isLoggedin");

router.get("/", (req, res) => {
    res.send("Users Router");
});

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/logout", isLoggedIn, logoutUser);

router.get("/profile", isLoggedIn, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});

module.exports = router;