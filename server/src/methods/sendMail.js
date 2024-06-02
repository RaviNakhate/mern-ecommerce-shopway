const nodemailer = require("nodemailer");

const sendMail = (toEmail, totitle, totext) => {
  return new Promise(async (resolve, reject) => {
     const email = await process.env.ACCOUNT_EMAIL;
     const pass = await process.env.ACCOUNT_PASSWORD;
    
    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // whenever host then it true
      requireTLS: true,
      auth: {
        user: email,
        pass: pass,
      },
    });

    const obj = await {
      from: email,
      to: toEmail,
      subject: totitle,
      text: totext,
    };

    await transporter.sendMail(obj, function (err, info) {
      if (err) {
        console.log("error : sendMail()\n", err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = sendMail;