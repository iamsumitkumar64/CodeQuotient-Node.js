const signDB = require('../models/index');
const fs = require('fs');
const { setuser } = require('../map');
const { v4: uuidv4 } = require('uuid');

function main_get(req, res) {
    Append_History(req);
    return res.render('main');
}

function login_get(req, res) {
    Append_History(req);
    return res.render('login');
}

function signup_get(req, res) {
    Append_History(req);
    return res.render('signup');
}

async function login_user(req, res) {
    const body = req.body;
    if (!body || !body.email || !body.pass) return res.redirect('/');
    let entry = await signDB.findOne({ email: body.email, password: body.pass });
    console.log(entry);

    if (!entry) {
        return res.redirect('/login')
    }
    const s_id = uuidv4();
    setuser(s_id, entry);
    res.cookie('uid', s_id);
    return res.redirect('/main');
}

async function create_user(req, res) {
    const body = req.body;
    if (!body || !body.name || !body.email || !body.pass) return res.redirect('/');
    await signDB.create({
        name: body.name,
        email: body.email,
        password: body.pass,
    });
    return res.redirect('/login');
}

function Append_History(req) {
    let data = 'New Request => ' + req.url + '\t\t' + 'Method => ' + req.method + '\n';
    console.log(req.url + '\t' + req.method);
    fs.appendFile('./Route_History.txt', data, (err) => { console.log(err); });
}

module.exports = { main_get, login_get, signup_get, login_user, create_user };