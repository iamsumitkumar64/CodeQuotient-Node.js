const { getuser } = require('../service/index.js');

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

function checkNotLogin(req, res, next) {
    const c_token = req.cookies?.c_token;
    if (!c_token) return next();
    const user = getuser(c_token);
    if (user) {
        return res.redirect('/seen_all');
    }
    next();
}
module.exports = { checkLogin ,checkNotLogin}