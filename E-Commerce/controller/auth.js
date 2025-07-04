import { userDB } from '../models/user.js';
import { setuser } from '../service/index.js';

async function createuser(req, res) {
    const body = req.body;
    if (!body || !body.name || !body.email || !body.pass) return res.redirect('/signup');
    await userDB.create({ name: body.name, email: body.email, password: body.pass, role: body.Role });
    return res.redirect('/login');
}

async function loginuser(req, res) {
    const body = req.body;
    if (!body || !body.email || !body.pass) return res.redirect('/login');
    let entry = await userDB.findOne({ email: body.email, password: body.pass });
    if (!entry) return res.redirect('/login');
    const token = setuser(entry);
    res.cookie('c_token', token);
    return res.redirect('/main');
}

function logoutuser(req, res) {
    res.clearCookie('c_token');
    return res.redirect('/');
}

export { createuser, loginuser, logoutuser }