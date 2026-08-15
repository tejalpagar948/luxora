const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owners-model");
const isAdmin = require("../middleware/isAdmin");

router.get("/", (req, res) => {
  res.send("Owner Router");
});

if (process.env.NODE_ENV == "development") {
  router.post("/create", async (req, res) => {
    let owners = await ownerModel.find()
    if (owners.length > 0) {
      return res.status(503).json({
        success: false,
        message: "You dont have permission to create owner"
      });
    }
    let { fullName, username, email, password, picture, products, gstin } = req.body;
    let user = await ownerModel.create({
      fullName,
      username,
      email,
      password,
      picture,
      gstin,
    })
    return res.status(201).json({ success: true, message: "Owner created successfully", user })
  });
}

router.get("/admin", isAdmin, (req, res) => {
  res.send("Owner Router");
});

module.exports = router;