const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "dd2f726613f49d",
    pass: "0dcf08016515ab"
  }
},{
  from: 'naoresponda@teste.com'
});


exports.send = async (options) =>{
  console.log('vou enviar email...')
  await transport.sendMail(options);
}