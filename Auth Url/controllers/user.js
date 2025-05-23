const User_Model = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const { setuser } = require('../service/user');

async function create_user(req, res) {
    const body = req.body;
    const data = await User_Model.create({
        Name: body.name,
        Email: body.email,
        Password: body.password
    })
    return res.redirect('/')
}

async function login_user(req, res) {
    const body = req.body;
    const checkUser = await User_Model.findOne({ Email: body.email, Password: body.password });
    if (!checkUser) {
        return res.render('login')
    }
    const id = uuidv4();
    setuser(id, checkUser);
    res.cookie("uid", id)
    // console.log("cookie => ",res.cookie.uid,id)
    return res.redirect('/')
}

function signup_url(req, res) {
    return res.render('signup')
}
function login_url(req, res) {
    return res.render('login')
}

module.exports = { create_user, login_user, signup_url, login_url }