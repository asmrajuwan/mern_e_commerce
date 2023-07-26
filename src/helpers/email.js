const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");
const logger = require("../controllers/loggerController");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,//true for 465 port
    auth: {
      user: smtpUsername,
      pass: smtpPassword
    }
  });

  const emailWithNodeMail = async (emailData)=>{
    try {
        const mailOptions ={
            from: smtpUsername, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            //text: "Hello world?", // plain text body
            html: emailData.html, // html body
        };
    
        const info = await transporter.sendMail(mailOptions);
        logger.log('info','Message sent: %s',info.response)
    } catch (error) {
        logger.log('error','error occurd:', error);
        throw error;
        
    }
  }

  module.exports =emailWithNodeMail;