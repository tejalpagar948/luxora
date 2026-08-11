const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        minLength: 3,
        trim: true
    },
    username: String,
    password: String,
    email: String,
    mobile: Number,
    isAdmin: Boolean,
    picture: String,
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    orders: {
        type: Array,
        default: []
    },
    // cart: {
    //     type: [
    //         mongoose.Schema.Types.ObjectId
    //     ],
    //     ref: 'product'
    // },
    // orders: {
    //     type: [
    //         mongoose.Schema.Types.ObjectId
    //     ],
    //     ref: 'order'
    // },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model("user", UserSchema);

module.exports = User;