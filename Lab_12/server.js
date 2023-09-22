const http = require('http');
const url = require('url');
const fs = require('fs');
const RPC = require('rpc-websockets').Server;
let st_list = require('./StudentsList');
const { emit } = require('process');
var flippyBit = 0;



let rpc = new RPC({ host: 'localhost', port: 5001 });
rpc.event('bupdate');
rpc.event('badd');
rpc.event('bdelete');
rpc.event('update');
rpc.event('delete');
rpc.event('add');

let server = http.createServer();
let GET_handler = (req, res) => {
    let path = url.parse(req.url).pathname
    console.log(req.method + '---' + path.split('/')[1]);
    switch (path.split('/')[1]) {
        case '': {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(JSON.stringify(st_list));
            break;
        }
        case 'backup': {
            let list = '';
            fs.readdir('./copy/', (err, files) => {
                if (!err) {
                    files.forEach(file => {list += file +'  ';});
                    res.writeHead(200, { 'Content-Type': 'applicaton/json; charset=utf-8' });
                    res.end(JSON.stringify(list));
                } else error(2, 'Ошибка чтения директории', res);
            });
            setTimeout(()=>
            checkf(),2000)
            break;
        }
        case (/\d+/.test(path.split('/')[1]) ? path.split('/')[1] : '-'): {
            let id = req.url.split('/')[1];
            let student = st_list.find(x => x.id === Number(id));
            if (student) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(JSON.stringify(student));
            }
            else {
                error(3, 'Студент с таким id не существует', res);
            }
            break;
        }
        default: HTTP404(req, res);
    }
}

let POST_handler = (req, res) => {
    let path = url.parse(req.url).pathname
    console.log(req.method + '---' + path.split('/')[1]);
    switch (path) {
        case '/': {
            let buf = ''; 
            req.on('data', (data) => { buf += data; });
            req.on('end', () => {
                let new_student = JSON.parse(buf);
                if (!st_list.find(x => x.id == new_student.id)) {
                    st_list.push(new_student);
                    fs.writeFile('./StudentsList.json', JSON.stringify(st_list), () => { });
                    res.writeHead(200, { 'Content-type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(new_student));
                    rpc.emit('add');
                } else {
                    error(1, 'Студент с таким id существует', res);
                }
            });
            break;
        }
        case '/backup': {
            let currentDate = new Date();
            let date = addZero(currentDate.getFullYear()).toString() + 
            (addZero(currentDate.getMonth() + 1)).toString() +
                addZero(currentDate.getDate()).toString() + 
                addZero(currentDate.getHours()).toString() + 
                addZero(currentDate.getSeconds()).toString();
            fs.writeFile(('./copy/'+date + '_StudentList.json'), JSON.stringify(st_list, null, '  '), () => { });
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(date + '_StudentList.json');
            rpc.emit('badd');
            break;
        }
        default: HTTP404(req, res);
    }
}

let PUT_handler = (req, res) => {
    let path = url.parse(req.url).pathname
    console.log(req.method + '---' + path.split('/')[1]);
    switch (path) {
        case '/': {
            let buf = ''; req.on('data', (data) => { buf += data; });
            req.on('end', () => {
                let new_student = JSON.parse(buf);
                let old_student = st_list.find(x => x.id == new_student.id);
                if (old_student) {
                    st_list.splice(st_list.indexOf(old_student), 1, new_student);
                    fs.writeFile('./StudentsList.json', JSON.stringify(st_list), () => { });
                    rpc.emit('update');
                    res.writeHead(200, { 'Content-type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(new_student));
                } else {
                    error(3, 'Студент с таким id не существует', res);
                }
            });
            break;}
        default: HTTP404(req, res);
    }
}

let DELETE_handler = (req, res) => {
    let path = url.parse(req.url).pathname
    console.log(req.method + '---' + path.split('/')[1]);
    switch (path.split('/')[1]) {
        case (/\d+/.test(path.split('/')[1]) ? path.split('/')[1] : '-'): {
            let id = req.url.split('/')[1];
            let student = st_list.find(x => x.id === Number(id));
            if (student) {
                st_list.splice(st_list.indexOf(student), 1);
                fs.writeFile('./StudentsList.json', JSON.stringify(st_list), () => { });
                rpc.emit('delete');
                res.writeHead(200, { 'Content-type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(student));
            } else {
                error(3, 'Студент с таким id не существует', res);
            }
            break;
        }
        case 'backup': {
            let date = url.parse(req.url).pathname.split('/')[2];
            if (date.length==12 && isNaN(date)==false && date!=null){
            fs.readdir('./copy', (err, files) => {
                if (!err) {
                    let nowDate = dateSlice(date);
                    console.log(nowDate);
                    files.forEach(file => {
                        let backupDate = dateSlice(file.split('_')[0]);
                        console.log(backupDate);
                        if (nowDate > backupDate) {
                            fs.unlink('./copy/'+file, err => {
                                if (err) { error(4, 'Ошибка удаления файла ' + file, res); }
                            })
                        }
                    });
                    rpc.emit('bdelete');
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end('Deleted');
                } else {
                    error(2, 'Ошибка чтения директории', res);
                }})
            }
            else
            error(3, 'Ошибка параметра', res);
            break;
        }
        default: HTTP404(req, res);
    }
}

http_handler = (req, res) => {
    switch (req.method) {
        case 'GET': GET_handler(req, res); break;
        case 'POST': POST_handler(req, res); break;
        case 'PUT': PUT_handler(req, res); break;
        case 'DELETE': DELETE_handler(req, res); break;
        default: HTTP405(req, res);
    }
}


let HTTP405 = (req, res) => {
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

let HTTP404 = (req, res) => {
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

let error = (c, mes, res) => {
    res.writeHead(200, { 'Content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: c, message: mes }));
}

function addZero(num) {
    if (num >= 0 && num <= 9) {
		return '0' + num;
	} else {
		return num;
	}
}

function checkf(){
    fs.readdir('./copy', (err, files) => {
        if (!err) {
            files.forEach(file => {
                fs.watch('./copy/'+file, (event, filename) => {
                    if (filename && event ==='change') {
                        if (flippyBit==0) {
                            console.log(`${filename} file Changed`)
                            rpc.emit('bupdate');
                            flippyBit++;
                        }
                        else if(flippyBit==1)
                        flippyBit++;
                        else if(flippyBit==2) 
                        flippyBit=0;
                    }
                })
            });
        } else {
            error(2, 'Ошибка чтения директории', res);
        }})
    }
function dateSlice(date) {
    let year = '', month = '', day = '';
    let hour = '', minute = '', second = '';

    for (let i = 0; i < date.length; i++) {
        if (i < 4)
            year += date.charAt(i);
        else if (i < 6)
            month += date.charAt(i);
        else if (i < 8)
            day += date.charAt(i);
        else if (i < 10)
            hour += date.charAt(i);
        else if (i < 12)
            minute += date.charAt(i);
        else if (i < 14)
            second += date.charAt(i);
    }
    let arr = [year, month, day, hour, minute, second];
    let fdate = new Date(Number(arr[0]), Number(arr[1]), Number(arr[2]),
        Number(arr[3]), Number(arr[4]), Number(arr[5]));
    return fdate;
}

function flipBit() {
    flippyBit = flippyBit + 1;
}
server.listen(5000);
console.log('http://localhost:5000');
server.on('error', (err) => { console.log(`Error: ${err}`); })
server.on('request', http_handler);