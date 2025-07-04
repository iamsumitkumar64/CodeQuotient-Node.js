const { getuser } = require('../map');

function checkLogin(req, res, next) {
    const userUID = req.cookies?.uid;

    if (!userUID) return res.redirect('/login');
    const user = getuser(userUID);

    if (!user) return res.redirect('/login');

    req.user = user;
    next();
}

module.exports = { checkLogin }