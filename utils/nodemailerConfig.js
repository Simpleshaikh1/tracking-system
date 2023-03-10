require("dotenv").config()

module.exports = {
    host: process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:true,
    auth: {
      user: process.env.EMAIL_HOST,
      pass: process.env.EMAIL_PASSWORD,
    },
    
  };