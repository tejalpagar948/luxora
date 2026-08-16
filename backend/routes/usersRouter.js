const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile } = require("../controllers/authController");
const isLoggedIn = require("../middleware/isLoggedin");

router.get("/", (req, res) => {
    res.send("Users Router");
});

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/logout", isLoggedIn, logoutUser);

router.get("/profile", isLoggedIn, getUserProfile);

module.exports = router;