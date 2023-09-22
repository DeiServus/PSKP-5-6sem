const nodemailer = require('nodemailer');
const sender = 'huitebe';
const password = 'huitebe';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 586,
    secure: false,
    service: 'Gmail',
    auth: {
        user: sender,
        pass: password
    }
});

function send(mtext){
    
    
    transporter.sendMail({
        from: sender,
        to: 'kokokokukareku07@gmail.com',
        subject: 'Excercise 3',
        text: mtext
    })
}

module.exports = send;