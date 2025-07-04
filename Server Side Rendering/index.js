const express=require('express')
const db=require('mongoose')
const path = require('path');
exp=express()

const Port=8000
exp.set("view engine", "ejs");
console.log(path.resolve("./views"))
exp.set("views", path.resolve("./views"));

exp.route('/').get((req,res)=>{
    return res.render('index.ejs')
})

exp.listen(Port,()=>{console.log(`Server Started At : ${Port}`)})