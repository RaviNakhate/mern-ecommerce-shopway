const yup = require('yup');

const register = yup.object({
    otp: yup.number().required(),
    password: yup.string().required(),
    state: yup.string().required(),
    city: yup.string().required(),
    address: yup.string().required(),
    email: yup.string().email().required(),
    name: yup.string().required(),
})

module.exports = register;