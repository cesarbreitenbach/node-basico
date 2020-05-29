const nodemailer = require('nodemailer')

//configura o servidor
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.STMP_PASS
  }
},{
  from: process.env.SMTP_EMAIL
});

//envia email
exports.send = async (options) =>{
  await transport.sendMail(options);
}