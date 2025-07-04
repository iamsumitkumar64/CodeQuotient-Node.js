import fs from 'fs';
import User from '../model/index.js';
import excelToJson from 'convert-excel-to-json';
import { setuser } from '../service/index.js';

function get_index(req, res) {
    return res.render('index');
}
function get_login(req, res) { return res.render('login'); }
function get_signup(req, res) { return res.render('signup'); }

function post_index(req, res) {
    let result = excelToJson({
        source: fs.readFileSync(req.file.path)
    });
    let obj = { 'body': result };
    return res.send(obj);
}
async function post_signup(req, res) {
    const body = req.body;
    if (!body || !body.name || !body.email || !body.pass) return res.redirect('/signup');
    await User.create({
        name: body.name,
        email: body.email,
        password: body.pass
    });
    return res.redirect('/');
}
async function post_login(req, res) {
    const body = req.body;
    if (!body || !body.email || !body.pass) return res.redirect('/');
    const u_token = await User.findOne({ email: body.email, password: body.pass });
    if (!u_token) return res.redirect('/');
    const token = setuser(u_token);
    res.cookie('c_token', token);
    return res.redirect('/index')
}

export {
    get_index, get_login, get_signup, post_index, post_signup, post_login
}