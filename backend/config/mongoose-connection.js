const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");

mongoose.connect(process.env.MONGODB_URI).then(() => {
    dbgr("MongoDB connected successfully");
}).catch(() => {
    dbgr("MongoDB connection failed");
})

module.exports = mongoose.connection;