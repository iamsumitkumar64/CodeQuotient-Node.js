const url = require('url')
const http = require('http');
console.log(url);

const n_http = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = JSON.stringify(parsedUrl.query);
    switch (pathname) {
        case '/':
            res.end('Home Page' + query);
            break;
        case '/about':
            res.end('About Page' + query);
            break;
        default:
            res.end('404 Not Found\t\t' + pathname + '\t\t\t' + req.url + '\t' + query);
            break;
    }
})

n_http.listen(8000, () => { console.log('Server Started') });