const signDB = require('../models/db')

async function createUser(req, res) {
    const body = req.body;
    if (!req.body) { return res.redirect('/') }
    //console.log(body);
    await signDB.create({
        name: body.name,
        email: body.email,
        password: body.pass
    })
    return res.redirect('/login');
}
async function loginUser(req, res) {
    const body = req.body;
    if (!req.body) { return res.redirect('/') }
    console.log(body);
    let entry = await signDB.findOne({ email: body.email, password: body.pass });
    if (!entry) {
        return res.redirect('/login')
    }
    return res.render('main', { "entry": entry })
}


module.exports = { createUser, loginUser }