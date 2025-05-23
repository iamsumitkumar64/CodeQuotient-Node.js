const User = require('../models/url')
const { nanoid } = require('nanoid');

async function create_new(req, res) {
    // return res.send('hi')
    const body = req.body;
    if (!body.url) {
        res.status(404).json({ "Result": "URL required" });
    }
    const ID = nanoid(8);
    await User.create({
        GivenId: body.url,
        ShortId: ID,
        Visit: []
    });
    const entry = await User.find({});
    html(res, entry)
}

async function show_all(req, res) {
    const entry = await User.find({});
    html(res, entry)
}

async function redirect_prev(req, res) {
    const ID = req.params.url;
    const entry = await User.findOneAndUpdate(
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

const html = (res, data) => {
    const users = Array.isArray(data) ? data : [data];
    let head = `<!DOCTYPE html> <html lang="en"><head><meta charset="UTF-8"><title>Sample Table</title><style>body{color:rgb(255, 255, 255);background-color:rgb(90, 90, 90);}table {width: 80%;margin: 40px auto;border-collapse: collapse;box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);border-radius: 10px;overflow: hidden;animation: fadeIn 1.5s ease;}caption {font-size: 2em;font-weight: bold;margin-bottom: 15px;animation: slideInDown 1s ease-out;}th, td {padding: 14px 20px;  border: 1px solid #ddd;text-align: left;transition: background-color 0.3s ease;}th{background-color: #4a90e2;text-transform: uppercase;letter-spacing: 0.05em;}tr:hover {background-color:white;color:rgb(92, 93, 94);transform: scale(1.01);transition: all 0.3s ease-in-out;}td {font-size: 1em;}@keyframes fadeIn {from { opacity: 0; transform: translateY(20px); }to {opacity: 1; transform:translateY(0);}}@keyframes slideInDown {from { opacity: 0; transform: translateY(-20px);}to {opacity: 1; transform: translateY(0); }}</style></head><body><table><caption>List Of Urls</caption><tr><th>ID</th><th>GivenUrl</th><th>ShortUrl</th><th>Visit</th></tr>`;

    let body = users.map((item) => {
        let time;
        if (!item.Visit) { time = 'NOT VISITED TILL NOW' }
        else { time = item.Visit.map(time => `${time.timestamp}</br>`).join('') }
        return `<tr>
            <td>${item.id}</td>
            <td>${item.GivenId}</td>
            <td>${item.ShortId}</td>
            <td>${time}</td>
        </tr>`;
    }).join('');
    let footer = '</table></body></html>';
    return res.send(head + body + footer);
}