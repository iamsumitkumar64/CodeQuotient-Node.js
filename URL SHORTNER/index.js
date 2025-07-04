const express = require('express');
const exp = express();

const userRouter = require('./routes/url')

const db = require('mongoose')
const Port = 8000
const db_url = 'mongodb://127.0.0.1:27017/Node'//Node is DB name


db.connect(db_url)
    .then(() => { console.log('MongoDB Connected') })
    .catch((err) => { console.log('MongoDB Connection Error', err) })


exp.use(express.urlencoded({ extended: false }))
exp.use('/', userRouter)
exp.listen(Port, () => { console.log(`Server Started At ${Port}`); })