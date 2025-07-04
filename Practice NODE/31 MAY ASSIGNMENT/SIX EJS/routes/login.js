const express = require('express')
const userRouter = express.Router()
const { createUser, loginUser } = require('../controllers/login')

userRouter.route('/')
    .get((req, res) => {
        return res.redirect('/signup')
    })

userRouter.route('/signup')
    .get((req, res) => {
        return res.render('signup')
    })
    .post((req,res)=>{
        createUser(req, res);        
    })

userRouter.route('/login')
    .get((req, res) => {
        return res.render('login');
    })
    .post((req, res) => {
        loginUser(req, res);
    })

userRouter.route('/main')
    .get((req,res)=>{
        return res.render('main')
    })

module.exports = userRouter