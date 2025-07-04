const exp = require('express');
const app = exp();
const mongoose = require('mongoose');
const { router } = require('./routes/index');
const cookieParser = require('cookie-parser')

const PORT = 8000;
const db_url = 'mongodb://localhost:27017/Node';

app.set('view engine', 'ejs');
app.use(exp.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', router);

mongoose.connect(db_url)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Connection error', err);
    });

app.listen(PORT, (err) => {
    if (err) { console.log(err); return; }
    console.log(`Server started at : ${PORT}`);
});