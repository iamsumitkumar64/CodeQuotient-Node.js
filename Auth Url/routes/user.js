const express = require('express')
const userRouter = express.Router()
const { create_user, login_user, signup_url,login_url } = require('../controllers/user')

userRouter.route('/signup')
    .post(create_user)
    .get(signup_url)

userRouter.route('/login')
    .post(login_user)
    .get(login_url)

module.exports = userRouter