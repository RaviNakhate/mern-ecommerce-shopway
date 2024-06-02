const yup = require('yup');

const updateProfile = yup.object({
    address: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    name: yup.string().required(),
})

module.exports = updateProfile;