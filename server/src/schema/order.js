const mongoose = require('mongoose');

const subProducts = new mongoose.Schema({
    productId: String,
    quantity: Number,
    price: Number,
})

const subOrder = new mongoose.Schema({
    orderId: String,
    paymentId: String,
    totalQuantity: Number,
    totalAmount: Number,
    createAt: Date,
    products: [subProducts],
    orderComplete: Date,
    status: {
        type: String,
        default: "fail",
    }
})

const order = new mongoose.Schema({
    userId: {
        type: String
    },
    orders: [subOrder]
})

const Order = mongoose.model("orders", order);
module.exports = Order