const express = require('express')
const urlRouter = express.Router()
const { create_new, show_all, redirect_prev } = require('../controllers/url')

urlRouter.route('/')
    .post(create_new)
    .get(show_all)
    
urlRouter.get('/:url', redirect_prev)

module.exports = urlRouter