import http from 'http';
import fs from 'fs';

const n_http = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('../index.html', 'utf8', (err, data) => {
            if (err) {
                res.end('Server Error');
                return;
            }
            res.end(data);
        });
    } else {
        res.end('<a href="http://localhost:8000/">YOU ARE AT WRONG URL</a>');
    }
});

n_http.listen(8000, () => {
    console.log("Server Started at http://localhost:8000");
});
