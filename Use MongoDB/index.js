const express = require('express')
const exp = express()
const fs = require('fs')
const db = require('mongoose')
const Port = 8000
exp.use(express.urlencoded({ extended: false }))

//Connection btw Mongodb And Node
db.connect('mongodb://127.0.0.1:27017/Node')//Node is DB name
    .then(() => { console.log('MongoDB Connected') })
    .catch((err) => { console.log('MongoDB Connection Error', err) })


//Schema(Collection Structure)
const userschema = new db.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    }
}, { timestamps: true })


//Model
let User = db.model('user', userschema)//if 'user'=>users collection by default ,'anything other'=>user defined collection name

exp.route('/')
    .get((req, res) => {
        getfunc(req, res);
    })
    .post(async (req, res) => {
        console.log(req.body)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            title: req.body.title,
        })
        getfunc(req, res);
    })
exp.route('/user/')
    .get((req, res) => {
        getfunc(req, res);
    })
    .post(async (req, res) => {
        console.log(req.body)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            title: req.body.title,
        })
        getfunc(req, res);
    })

exp.
    route('/user/:id')
    .delete(async (req, res) => {
        await User.findByIdAndDelete(req.params.id)
        return res.json({ 'Response': 'Success' })
    })
    .get(async (req, res) => {
        const search = await User.findById(req.params.id)
        html(req, res, search)
        return res.send(search)
    })


exp.listen(Port, () => { console.log('Serer Started') })

const getfunc = async (req, res) => {
    use_file(req);
    html(req, res, await User.find({}))
}
const use_file = (req) => {
    const en_data = `Url Visited :\t${req.url}\t${req.method}\n`
    fs.appendFile('Route_History.txt', en_data, (err) => {
        if (err) {
            console.log('Error Ocuuured While Making File', err);
        }
    })
}
const html = (req, res, data) => {
    data = Array.isArray(data) ? data : [data];
    use_file(req);
    // console.log(data);
    let head = `<!DOCTYPE html> <html lang="en"><head><meta charset="UTF-8"><title>Sample Table</title><style>body{color:rgb(255, 255, 255);background-color:rgb(90, 90, 90);}table {width: 80%;margin: 40px auto;border-collapse: collapse;box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);border-radius: 10px;overflow: hidden;animation: fadeIn 1.5s ease;}caption {font-size: 2em;font-weight: bold;margin-bottom: 15px;animation: slideInDown 1s ease-out;}th, td {padding: 14px 20px;  border: 1px solid #ddd;text-align: left;transition: background-color 0.3s ease;}th{background-color: #4a90e2;text-transform: uppercase;letter-spacing: 0.05em;}tr:hover {background-color:white;color:rgb(92, 93, 94);transform: scale(1.01);transition: all 0.3s ease-in-out;}td {font-size: 1em;}@keyframes fadeIn {from { opacity: 0; transform: translateY(20px); }to {opacity: 1; transform:translateY(0);}}@keyframes slideInDown {from { opacity: 0; transform: translateY(-20px);}to {opacity: 1; transform: translateY(0); }}</style></head><body><table><caption>List Of User's Information</caption><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Title</th></tr>`;

    let body = data.map((item) => {
        return `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.role}</td>
            <td>${item.title}</td>
        </tr>`;
    }).join('');
    // console.log(res)
    let footer = '</table></body></html>';
    return res.send(head + body + footer);
}