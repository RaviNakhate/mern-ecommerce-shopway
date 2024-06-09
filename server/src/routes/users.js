const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const jwt = require('jsonwebtoken');

const { auth } = require('../middleware/index');
const { sendOtp, register, updateProfile, forgotPassword } = require('../validation/index');
const validation = require('../validation/validation');
const { sendMail, isOtpExpire, generateOtp, createHash, checkHash } = require('../methods/index');


router.post('/', validation(sendOtp), async (req, res) => {
    try {
        const title = "Shopway - OTP";
        const text = (otp) => {
            return `Hello,\nWe received a request for OTP to Registration Shopway Account\nOTP expiry in 2 minutes.\n\nEnter OTP to Registration : ${otp}`;
        };

        const { email } = await req.body;

        const result = await User.findOne({ email: email });

        if (result && result?.user !== "process") {
            res.status(200).send({ simple: true, message: "Email already registered" });

        } else {
            if (result && result?.user === "process") {

                const val = await isOtpExpire(result?.createAt);

                if (val === 'n') {
                    res.status(200).send({ simple: true, message: "OTP already sended" });
                    return 0;
                }

                await User.deleteOne({ email });
            }

            const otp = await generateOtp();
            // Send mail for otp
            await sendMail(email, title, text(otp));

            await new User({
                otp: otp,
                email: email,
                createAt: new Date(),
                user: "process"
            }).save();
            res.status(200).send({ status: true, message: "send otp" });
        }

    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }
});

router.post('/forgot/', validation(sendOtp), async (req, res) => {
    try {
        const title = "Shopway - Forgot Password (OTP)";
        const text = (name, otp) => {
            return `Hello ${name},\n\nWe received a request for OTP to reset your password on Shopway.\nOTP expiry in 2 minutes.\n\nEnter OTP to reset your password: ${otp}\n\nThank you.`;
        };

        const { email } = await req.body;

        const result = await User.findOne({ email: email });


        if (!result || result?.user === "process") {
            res.status(200).send({ simple: true, message: "Email not registered" });

        } else {
            const val = await isOtpExpire(result?.createAt);

            if (val === 'n') {
                res.status(200).send({ simple: true, message: "OTP already sended" });
                return 0;
            }

            const otp = await generateOtp();
            // Send mail for otp
            await sendMail(email, title, text(result.name, otp));

            await User.updateOne(
                { email },
                {
                    $set: {
                        otp: otp,
                        createAt: new Date(),
                    }
                });
            res.status(200).send({ status: true, message: "send otp" });
        }
    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }
});


router.put('/forgot/', validation(forgotPassword), async (req, res) => {
    try {
        const title = "Shopway - Password Changed";
        const text = (name) => {
            return `Hello ${name},\n\nYour password for your Shopway account has been successfully changed.\n\nIf you did not make this change, please contact our support team immediately.\n\nBest regards,\nThe Shopway Team`;
        };

        const { email, password, otp } = await req.body;

        const result = await User.findOne({ email: email });

        // verify otp expiry then otp eexpiry
        const val = await isOtpExpire(result?.createAt);
        if (val === 'y') {
            res.status(200).send({ simple: true, message: "Please Regenerate OTP" });
            return 0;
        }

        const checkOTP = await User.findOne({ email: email, otp: otp });

        if (!checkOTP) {
            res.status(200).send({ message: "wrong OTP" });
            return 0;
        }

        // Send mail for register
        await sendMail(email, title, text(result.name));
        const passwordHashForm = await createHash(password);

        await User.updateOne(
            { email: email },
            {
                $set: {
                    password: passwordHashForm,
                },
                $unset: {
                    otp: "",
                    createAt: ""
                }
            }
        );

        res.status(200).send({ status: true, message: "Password Changed" });
    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }
});


router.put('/', validation(register), async (req, res) => {
    try {
        const title = "Shopway - Account Has Been Created";
        const text = (name) => {
            return `Hello ${name.toUpperCase()},\nCongratulation Your account has been successfully registered.\n\nThank you for joining Shopway!\n\nBest regards,\nThe Shopway Team`;
        }

        const { name, email, otp, password, state, city, address } = await req.body;


        const result = await User.findOne({ email: email });
        if (!result) {
            res.status(200).send({ simple: true, message: "Please firstly generate otp" });

        } else if (result?.user == "process") {
            // verify otp expiry then otp eexpiry
            const val = await isOtpExpire(result?.createAt);

            if (val === 'y') {
                res.status(200).send({ simple: true, message: "Please Regenerate OTP" });
                return 0;
            }

            const checkOTP = await User.findOne({ email: email, otp: otp });

            if (!checkOTP) {
                res.status(200).send({ message: "wrong OTP" });
                return 0;
            }


            // Send mail for register
            await sendMail(email, title, text(name));
            const passwordHashForm = await createHash(password);


            await User.updateOne(
                { email: email },
                {
                    $set: {
                        name: name.replace(/ +(?= )/g, '').trim(),
                        password: passwordHashForm,
                        user: "client",
                        state: state,
                        city: city,
                        address: address
                    },
                    $unset: {
                        otp: "",
                        createAt: ""
                    }
                }
            );

            res.status(200).send({ status: true, message: "Register successfully" });
        } else {
            res.status(200).send({ message: "Email already registered" });
        }


    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }
});

router.patch('/', auth, validation(updateProfile), async (req, res) => {
    try {
        const { name, state, city, address } = await req.body;
        const { id } = req.headers;

        await User.updateOne(
            { _id: id },
            {
                $set: {
                    name: name.replace(/ +(?= )/g, '').trim(),
                    state: state,
                    city: city,
                    address: address
                }
            }
        );

        res.status(200).send({ status: true, message: "updated profile" });

    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }
});


router.get('/:email/:password', async (req, res) => {
    try {
        const { email, password } = req.params;
        const usr = await User.findOne({ email: email });

        if (!usr) {
            res.status(200).send({ message: "Email not found" });
            return 0;
        }

        const value = await checkHash(password, usr?.password);
        if (!value) {
            res.status(200).send({ message: "Password does not match" });
            return 0;
        }

        const token = await jwt.sign({ password: usr.password }, process.env.SECURE_KEY, { expiresIn: '1d' });
        usr.createAt = await new Date();
        usr.save();

        const responseData = usr.toObject();
        responseData.token = token;
        delete responseData.password;

        res.status(200).send({ status: true, message: "Login success", data: responseData });

    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const usr = await User.findOne({ _id: id }, { password: false });

        res.status(200).send({ status: true, data: usr });

    } catch (err) {
        console.log(err);
        res.status(200).send({ message: "Network error" });
    }
});


module.exports = router;
