require("dotenv").config()
const nodeMailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');


const sendEmail = async({to, subject, html}) =>{
    let testAccount = await nodeMailer.createTestAccount();

    const transporter = nodeMailer.createTransport(nodemailerConfig);

    return transporter.sendMail({
        from: '"MYXALARY" <Toyyib@myxalary.com>',
        to,
        subject,
        html
    });
};

module.exports = sendEmail;