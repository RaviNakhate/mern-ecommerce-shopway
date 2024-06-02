const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    otp: {
        type: Number,
    },
    password: {
        type: String,
    },
    confirmPassword: {
        type: String,
    },
    createAt: {
        type: Date,
    },
    user: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    }
});


const User = mongoose.model("users", user);
module.exports = User;