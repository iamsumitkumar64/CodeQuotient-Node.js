const exp = require('express');
const router = exp.Router();
const { checkLogin } = require('../middlewares/index');
const { main_get, login_get, signup_get, login_user, create_user } = require('../controllers/index');

router.
    route('/')
    .get(login_get)

router.get('/main', checkLogin, main_get)

router.
    route('/login')
    .get(login_get)
    .post(login_user)

router.
    route('/signup')
    .get(signup_get)
    .post(create_user)

module.exports = { router }