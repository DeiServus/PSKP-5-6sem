const http = require('http');
const xmlBuilder = require('xmlbuilder');
const parseString = require('xml2js').parseString;


const xmldoc = xmlBuilder.create('request').att('id', 300)
xmldoc.ele('x').att('value', 10);
xmldoc.ele('x').att('value', 5);
xmldoc.ele('m').att('value', '1');
xmldoc.ele('m').att('value', '2');
xmldoc.ele('m').att('value', '3');


const options = {
    host: 'localhost',
    path: '/5',
    port: 5000,
    method: 'POST',
    headers: {'Content-Type': 'text/xml','Accept': 'text/xml'}
}


const req = http.request(options, res => {
    let data = '';
    console.log(`statusCode: ${res.statusCode} ${res.statusMessage}`);
    res.on('data', chunk => { data += chunk; })
    res.on('end', () => {
        console.log('http.response: end: body =', data);
        parseString(data, (err, str) => {
            if (err) console.log('xml parse error');
            else {
                console.log('str = ', str);
            }
        })
    });
});

req.on('error', e => { console.log('http.request: error:',e.message); })
req.end(xmldoc.toString({ pretty: true }));