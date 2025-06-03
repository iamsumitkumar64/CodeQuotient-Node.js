const express = require('express')
const userRouter = express.Router()
const { createUser, loginUser, logout, createproduct, render_seen, render_all, delete_product, edit_product } = require('../controllers/login')
const { checkLogin, checkNotLogin } = require('../middleware/index')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        const file_name = file.originalname.replace(/(\.[\w\d_-]+)$/i, `-${Date.now()}$1`);
        req.file_name = file_name;
        cb(null, file_name);
    }
});

const upload = multer({
    storage: storage
});

userRouter.route('/')
    .get((req, res) => {
        return res.redirect('/signup')
    })

userRouter.route('/signup')
    .get(checkNotLogin, (req, res) => {
        return res.render('signup')
    })
    .post((req, res) => {
        createUser(req, res);
    })

userRouter.route('/login')
    .get(checkNotLogin, (req, res) => {
        return res.render('login');
    })
    .post((req, res) => {
        loginUser(req, res);
    })

userRouter.route('/add')
    .get(checkLogin, (req, res) => {
        return res.render('add_product')
    })

userRouter.route('/edit')
    .get(checkLogin, (req, res) => {
        return res.render('edit');
    })
    .post(checkLogin, upload.single('imgsrc'), (req, res) => {
        edit_product(req, res);
    })

userRouter.route('/seen')
    .get(checkLogin, (req, res) => {
        render_seen(req, res);
    })

userRouter.route('/seen_all')
    .get(checkLogin, (req, res) => {
        render_all(req, res);
    })

userRouter.route('/delete')
    .get(checkLogin, (req, res) => {
        return res.render('del_product');
    })
    .post(checkLogin, (req, res) => {
        delete_product(req, res);
    })

userRouter.route('/submit-product')
    .post(upload.single('imgsrc'), (req, res) => {
        createproduct(req, res);
    })

userRouter.route('/logout')
    .get((req, res) => {
        logout(req, res);
    })

module.exports = userRouter