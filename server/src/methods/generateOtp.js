const generateOtp = async () => {
    let num;
    do {
        num = await Math.floor(Math.random() * 10000);
    } while ((num).toString().startsWith('9') || (num).toString().length != 4);
    return num;
}


module.exports = generateOtp;