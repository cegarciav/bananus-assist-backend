const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_SMTP_USER,
    pass: process.env.GMAIL_SMTP_PASSWORD,
  },
});

const sendMail = (email, name, password, cb) => {
  const message = `Hola ${name}!\nBienvenido a Bananus Assist. `
      + `Tu nueva contraseña para ingresar en nuestra plataforma es ${password}.\n`
      + 'Por tu seguridad te aconsejamos cambiarla cuanto antes.\n\n'
      + 'Esperamos que disfrutes mucho nuestra aplicación.\n\n'
      + 'Bananus Team';

  const mailOptions = {
    from: process.env.GMAIL_SMTP_USER,
    to: email,
    subject: 'Bienvenida a Bananus Assist',
    text: message,
  };

  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      cb(error, null);
    } else {
      cb(null, `Send email: ${data.response}`);
    }
  });
};

module.exports = {
  sendMail,
};
