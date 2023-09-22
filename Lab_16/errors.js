exports.HTTP405 = (req, res) => {
    let message = ` Method ${req.method} Not Allowed [405]`;
    let errInfo = {
        error: 'Method Not Allowed [405]',
        method: req.method,
        url: req.url
    }
    console.log(message);
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(errInfo))
}

exports.HTTP404 = (req, res) => {
    let message = `Adress ${req.method} Not Found [404]`;
    let errInfo = {
        error: 'Adress Not Found [404]',
        method: req.method,
        url: req.url
    }
    console.log(message);
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(errInfo))
}

exports.HTTP400 = (req, res, error) => {
    let message = `[${req.method}] Bad Request [400]`;
    let errInfo = {
        error: `Bad Request [400] - ${error.message}`,
        method: req.method,
        url: decodeURI(req.url)
    }
    console.log(message);
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    if(error.message=='Everything is fine'){
        res.end('Everything is fine')
    }else{res.end(JSON.stringify(errInfo))}
}