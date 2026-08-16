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
    isAdmin: {
        type: Boolean,
        default: false
    },
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
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    // cart: {
    //     type: [
    //         mongoose.Schema.Types.ObjectId
    //     ],
    //     ref: 'product'
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