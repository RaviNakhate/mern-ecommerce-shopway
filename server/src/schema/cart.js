const mongoose = require("mongoose");

const cartItem = new mongoose.Schema({
    productId: {
        type: String,
    },
    quantity: {
        type: Number,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const cart = new mongoose.Schema({
    userId: {
        type: String,
    },
    carts: {
        type: [cartItem],
        default: []
    },
    totalQuantity: {
        type: Number,
    },
    totalPrice: {
        type: Number,
    }
});


const Cart = mongoose.model("carts", cart);
module.exports = Cart;