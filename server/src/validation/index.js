const register = require('./register');
const sendOtp = require('./sendOtp');
const updateProfile = require('./updateProfile');
const forgotPassword = require('./forgotPassword');

module.exports = {
    register,
    sendOtp,
    updateProfile,
    forgotPassword
}