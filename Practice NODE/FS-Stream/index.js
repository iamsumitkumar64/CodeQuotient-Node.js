const fs = require('fs');
const exp = require('express');
const status = require('express-status-monitor');

const app = exp();
const PORT = 8000;
// let data;

app.use(status());

// THIS CAUSE PROBLEM BY USING MEMORY INEFFICIENTLY AS
// 1. FIRST STORE IN MEMORY THEN 
// 2. IN DATA THEN 
// 3. SEND THAT DATA

// app.get('/', (req, res) => {
//     data = fs.readFileSync('50mb.txt', 'utf-8');
//     res.end(data);
// });

// THIS USE MEMORY EFFIECIENTLY AS SEND SMALL CHUNK DIRECTLY TO CLIENT
app.get('/', (req, res) => {
    const stream = fs.createReadStream('../../11mb.txt', 'utf-8');
    stream.on('data', (chunk) => { res.write(chunk) });
    stream.on('end', () => res.end());
});

app.listen(PORT, (err) => { console.log(`Server Started at:${PORT}`); })