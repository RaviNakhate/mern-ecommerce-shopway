const yup = require('yup');

const sendOtp = yup.object({
    email: yup.string().email().required(),
})

module.exports = sendOtp;