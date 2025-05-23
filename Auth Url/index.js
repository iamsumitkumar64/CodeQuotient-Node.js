const express = require('express');
const exp = express();
const ejs = require('ejs');
const path = require('path');
const cookieParser = require("cookie-parser")
const checkauth = require('./middleware/checkauth')

const urlRouter = require('./routes/url')
const userRouter = require('./routes/user')

const db = require('mongoose');
const Port = 8000
const db_url = 'mongodb://127.0.0.1:27017/Auth-Url'//Node is DB name

db.connect(db_url)
    .then(() => { console.log('MongoDB Connected') })
    .catch((err) => { console.log('MongoDB Connection Error', err) })

exp.set("view engine", "ejs");
// console.log(path.resolve("./view"))
exp.set("views", path.resolve("./views"));

//middlewares
exp.use(express.urlencoded({ extended: false }))
exp.use(cookieParser())

exp.use('/auth', userRouter)
exp.use('/', checkauth, urlRouter)

exp.listen(Port, () => { console.log(`Server Started At ${Port}`); })