const http = require("http");
const fs = require("fs");

const file = fs.createWriteStream('im.png');

const req = http.get({
        host: "localhost",
        path: "/8/patric.png",
        port: 5000,
        method: "GET"
    },
    (res) => {
        res.pipe(file);
    });
req.on("error", e => {console.log("Error: ", e.message)});
req.end();