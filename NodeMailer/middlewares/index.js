import {getuser} from '../services/index.js';

function checkLogin(req, res, next) {
    const c_token = req.cookies?.c_token;
    if (!c_token) {
        return res.redirect('/');
    }
    const user = getuser(c_token);
    if (!user) return res.redirect('/signup');
    req.user = user;
    next();
}

export { checkLogin }