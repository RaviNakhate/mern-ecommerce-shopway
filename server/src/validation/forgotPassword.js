const yup = require('yup');

const forgotPassword = yup.object({
    password: yup.string().required(),
    otp: yup.number().required(),
    email: yup.string().email().required(),
})

module.exports = forgotPassword;