const nodemailer = require('nodemailer');

const sendEmail = async (email, fullname, otp) => {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: "CapyGram <hangnguyenthithu32@gmail.com>",
      to: email,
      subject: `Hello ${fullname}.\n`,
      text: `Your OTP is ${otp}. \n Do not share with anyone!`,
    };

    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    return error;
  }
}

module.exports = sendEmail;