const express = require("express");
const isLoggedin = require("../middleware/isLoggedin");
const router = express.Router();

router.get("/", isLoggedin, (req, res) => {
    res.send({
        message: "Products Router",
        data: req.user
    });
});

module.exports = router;