const http = require('http');
const fs = require('fs');

let body = `--&\r\n`;
body += 'Content-Disposition:form-data; name="file"; Filename="patric.png"\r\n';
body += `Content-Type:application/octet-stream\r\n\r\n`;

const req = http.request({
    hostname: 'localhost',
    path: '/7',
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': 'multipart/form-data; boundary=&'
    }
},
    (res) => {
        console.log('statusCode:' + res.statusCode);
        let buf = '';
        res.on('data', data => {
            buf += data.toString();
        });
        res.on('end', () => {
            console.log('http.request: data: end =' + buf);
        });
    });

req.on('error', (error) => {
    console.error(error)
});
req.write(body);
let file = new fs.ReadStream('patric.png');
file.on("data", (chunk) => {
    req.write(chunk);
});
file.on("end", () => {
    req.end(`\r\n--&--\r\n`);
});

