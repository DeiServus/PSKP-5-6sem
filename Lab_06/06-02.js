const nodemailer = require('nodemailer');
const http = require('http');
const url = require('url');
const fs = require('fs');
const { parse } = require('querystring');

let http_handler = (req, res)=>{
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    if(url.parse(req.url).pathname=='/' && req.method=='GET'){
        res.end(fs.readFileSync('./06-02.html'));
    }else if(url.parse(req.url).pathname == '/' && req.method == 'POST'){
        let body = '';
        req.on('data', chunk => {body += chunk.toString();});
        req.on('end', ()=>{
            let parm = parse(body);
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: false,
                service: 'Gmail',
                auth: {
                    user: parm.sender,
                    pass: parm.password
                }
            });
            for(var i = 0; i < 100; i++){
            transporter.sendMail({
                from: parm.sender,
                to: parm.receiver,
                subject: parm.subject,
                text: parm.message});
            }
            res.end(`<h2>Sender: ${parm.sender}</br>Reciever: ${parm.receiver}
            </br>Subject: ${parm.subject}</br>Message: ${parm.message}</h2>`);
        })
    } else res.end('<h1>Not support</h1>');
};
let server = http.createServer(http_handler);
server.listen(5000);
console.log('Welcome -> http://localhost:5000/');