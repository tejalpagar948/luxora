const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");

mongoose.connect(`${config.get("MONGODB_URI")}/luxoraDB`).then(() => {
    dbgr("MongoDB connected successfully");
}).catch(() => {
    dbgr("MongoDB connection failed");
})

module.exports = mongoose.connection;