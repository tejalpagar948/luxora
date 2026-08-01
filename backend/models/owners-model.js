const mongoose = require("mongoose");


const OwnerSchema = mongoose.Schema({
    fullName: {
        type: String,
        minLength: 3,
        trim: true
    },
    username: String,
    password: String,
    email: String,
    picture: String,
    products: {
        type: Array,
        default: []
    },
    gstin: String,
})

const Owner = mongoose.model("owner", OwnerSchema);

module.exports = Owner;