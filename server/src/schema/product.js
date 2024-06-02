const mongoose = require("mongoose");

const product = new mongoose.Schema({
    title: {
        type: String,
    },
    price: {
        type: Number,
        default: 1
    },
    rating: {
        type: Number,
        default: 1
    },
    delivery: {
        type: Number,
        default: 1
    },
    category: {
        type: String,
        default: "electronic"
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
});


const Product = mongoose.model("products", product);
module.exports = Product;