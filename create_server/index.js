const http = require('http')
const fs = require('fs')

let n_http = http.createServer((req, res) => {
    let currentDate=new Date();
    let log = `DATE ==> ${currentDate}\nURL ==> ${req.url}\n\n`;
    if (req.url == '/') {
        fs.appendFile('output.txt', log, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            }
        });
        res.end("hi i am new");
    }
    else {
        res.end(log+'\nFind Real Route\nIt is Fake One');
    }
})

n_http.listen(8000, () => {
    console.log("Server Started");
});