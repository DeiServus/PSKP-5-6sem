const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');


app.use(cors());
app.use('/', express.static('.'));

const wasmCode = fs.readFileSync('./functions.wasm');
const wasmImports = {};
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports);

app.get('/', (req, res) => {
    res.type('html').send(
        `sum(3, 4) = ${wasmInstance.exports.sum(3, 4)}<br>` +
        `sub(3, 4) = ${wasmInstance.exports.sub(3, 4)}<br>` +
        `mul(3, 4) = ${wasmInstance.exports.mul(3, 4)}<br>`
    );
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000')
});