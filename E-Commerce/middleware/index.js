import { getuser } from '../service/index.js';
import { userDB } from '../models/user.js';

function checkLogin(req, res, next) {
    const c_token = req.cookies?.c_token;
    if (!c_token || c_token==undefined) {
        return res.redirect('/login');
    }
    const user = getuser(c_token);
    if (!user) return res.redirect('/signup');
    req.user = user;
    next();
}

async function checkrole(req, res, next) {
    let user_email = req.cookies['c_token'];
    user_email = getuser(user_email).email;
    let user = await userDB.find({ email: user_email });
    if (user[0].role == 'buyer') return res.redirect('/');
    next();
}

export { checkLogin, checkrole }