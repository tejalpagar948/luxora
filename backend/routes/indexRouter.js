const express = require("express");
const isLoggedin = require("../middleware/isLoggedin");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Backend is running"
    });
});

router.get("/shop", isLoggedin, (req, res) => {
    res.json({
        message: "Welcome to shop"
    });
});

module.exports = router;
