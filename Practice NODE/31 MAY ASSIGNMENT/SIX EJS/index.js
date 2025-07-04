const express = require('express')
const exp = express()
const Port = 8000

const loginRouter = require('./routes/login')
const db = require('mongoose')
const db_url = 'mongodb://127.0.0.1:27017/SIXEJS'

exp.use(express.urlencoded({ extended: false }))

exp.set("view engine", "ejs");

exp.use('/', loginRouter)
db.connect(db_url)
    .then(() => { console.log(`Database Connected At : ${db_url}`) })
    .catch((err) => { console.log(`Error Database Connected : ${err}`) })

exp.listen(Port, () => { console.log(`Server Started At : ${Port}`) })