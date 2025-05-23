const Url_Model = require('../models/url')
const { nanoid } = require('nanoid');

async function create_new(req, res) {
    // return res.send('hi')
    const body = req.body;
    if (!body.url) {
        res.status(404).json({ "Result": "URL required" });
    }
    const checkUrl = await Url_Model.find({ GivenId: body.url });
    console.log("checkurl => ", checkUrl)
    if (checkUrl.length) {
        return res.redirect("/");
    }
    else {
        const ID = nanoid(8);
        await Url_Model.create({
            GivenId: body.url,
            ShortId: ID,
            Visit: [],
            CreatedBy: req.user._id
        });
        // let entry = await Url_Model.find({});
        // return res.render('main', { "entry": entry });
        return res.redirect('/');
    }
}

async function show_all(req, res) {
    const entry = await Url_Model.find({ CreatedBy: req.user._id });
    return res.render('main', { "entry": entry });
}

async function redirect_prev(req, res) {
    const ID = req.params.url;
    const entry = await Url_Model.findOneAndUpdate(
        {
            ShortId: ID
        },
        {
            $push: {
                Visit: { timestamp: new Date() },
            },
        }
    );
    res.redirect(entry.GivenId);
}


module.exports = { create_new, redirect_prev, show_all }