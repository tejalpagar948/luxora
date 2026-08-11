const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running"
    });
});

router.get("/shop", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to shop"
    });
});

router.get("/health", (req, res) => {
    res.json({
        status: "success",
        message: "Backend is running",
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

module.exports = router;
