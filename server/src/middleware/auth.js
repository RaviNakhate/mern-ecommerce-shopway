const jwt = require('jsonwebtoken');
const User = require('../schema/user')
const mongoose = require('mongoose');

const auth = async (req, res, next) => {
    const { token, id, user } = req.headers;

    try {
        if (token && user) {
            const { password } = await jwt.verify(token, process.env.SECURE_KEY);

            const usr = await User.findOne({ _id: id, password: password, user: user},{ token });

            usr ? next() : res.status(200).send({ unVerify: true });
        }
    }
    catch (err) {
        res.status(200).send({ unVerify: true });
    }
}

module.exports = auth;