import exp from 'express';
import fs from 'fs';

const app = exp();

app.get('/', (req, res) => {
    fs.readFile('../index.html', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Server Error');
            return;
        }
        res.send(data);
    });
});

app.get('*', (req, res) => {
    res.send('<a href="http://localhost:8000/">YOU ARE AT WRONG URL</a>');
});

app.listen(8000, () => {
    console.log("Server Started at http://localhost:8000");
});
