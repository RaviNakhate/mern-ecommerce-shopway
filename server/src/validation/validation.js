const validation = (schema) => async(req,res,next) => {
    const body = req.body;
    try {
        await schema.validate(body);
        return next();
    }
    catch(err) {
        console.log(err?.errors[0]);
        return res.status(200).send({ status: false, message: err?.errors[0] });
    }
}

module.exports = validation;