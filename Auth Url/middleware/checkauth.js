const { getuser, setuser } = require('../service/user')

function checkauth(req, res, next) {
    const id = req.cookies?.uid;
    const user = getuser(id);
    // console.log(user);
    req.user=user;
    if (!user) {
        return res.redirect('/auth/login');
    }
    next();
}

module.exports = checkauth