const express = require('express')
const userRouter = express.Router()
const { create_new, show_all, redirect_prev } = require('../controllers/url')

userRouter.route('/')
    .post((req, res) => {
        create_new(req, res);
    })
    .get((req, res) => {
        show_all(req, res);
    })
userRouter.get('/:url', redirect_prev)

module.exports = userRouter