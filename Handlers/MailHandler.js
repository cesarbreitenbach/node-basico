const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  },{
      from:`${process.env.NAME} <${process.env.EMAIL}>`
  });

exports.send = async (options)=>{
    await transport.sendMail(options)
}