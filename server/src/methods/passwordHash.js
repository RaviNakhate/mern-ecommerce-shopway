const bcrypt = require('bcryptjs');

const createHash = async (pass) => {
    const data = await bcrypt.hash(pass, 10);
    return data;
}

const checkHash = async (pass, hash) => {
    const data = await bcrypt.compare(pass, hash);
    return data;
}


module.exports = { createHash, checkHash };