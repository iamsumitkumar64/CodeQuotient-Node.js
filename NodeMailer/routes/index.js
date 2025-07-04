import express from 'express';
import { createUser, loginUser, logout, update_pass, forget_pass, mail_otp } from '../controllers/index.js';
import { checkLogin } from '../middlewares/index.js';

const userRouter = express.Router();

userRouter.route('/')
    .get((req, res) => {
        return res.redirect('/signup')
    })

userRouter.route('/main')
    .get((req, res) => {
        return res.render('main')
    })

userRouter.route('/forget')
    .get((req, res) => {
        return res.render('forget')
    })
    .post((req, res) => {
        forget_pass(req, res);
    })

userRouter.route('/update')
    .get(checkLogin, (req, res) => {
        return res.render('update')
    })

userRouter.route('/signup')
    .get((req, res) => {
        return res.render('signup')
    })
    .post((req, res) => {
        createUser(req, res);
    })

userRouter.route('/login')
    .get((req, res) => {
        return res.render('login');
    })
    .post((req, res) => {
        loginUser(req, res);
    })

userRouter.route('/logout')
    .get((req, res) => {
        logout(req, res);
    })

userRouter.route('/update')
    .post((req, res) => {
        update_pass(req, res);
    })

userRouter.route('/mail_otp')
    .post((req, res) => {
        mail_otp(req, res);
    })
export default userRouter