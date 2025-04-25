const express = require('express')
const app = express()
let data = require('./Fake_Data.json')
const fs = require('fs');
app.use(express.urlencoded({ extended: false }))
const Port = 8000;

// const send_Json = (res, data) => {
//     // res.set('Content-Type', 'application/json');
//     html(res, data)
//     // res.send(JSON.stringify(data, null, 2));
// };
const use_file = (req) => {
    const en_data = `Url Visited :\t${req.url}\t${req.method}\n`
    fs.appendFile('Route_History.txt', en_data, (err) => {
        if (err) {
            console.log('Error Ocuuured While Making File', err);
        }
    })
}

app.get('/', (req, res) => {
    use_file(req);
    html(res, data)
    // send_Json(res, data);
});

app.get('/user', (req, res) => {
    use_file(req);
    html(res, data)
    // send_Json(res, data);
});

app.get('/user/:id', (req, res) => {
    use_file(req);
    const userId = parseInt(req.params.id, 10);
    const user = data.find(u => u.id === userId)
    // res.set('Content-Type', 'application/json');
    if (user) {
        html(res, user)
        // res.send(JSON.stringify(user))
    } else {
        return res.send(`${res.url} Not Found`)
    }
})

app.post('/', (req, res) => {
    use_file(req);
    console.log(req.body)
    data.push({ 'id': data.length + 1, ...req.body })
    console.log(data)
    fs.writeFile('./Fake_Data.json', JSON.stringify(data), (err) => {
        console.log(err);
    })
    return res.json({ 'Response': 'Success', 'Port': Port })
})

app.delete('/', (req, res) => {
    use_file(req);
    return res.json({ 'Response': 'Not Access To Delete All Content', 'Port': Port })
})

app.delete('/user', (req, res) => {
    use_file(req);
    return res.json({ 'Response': 'Not Delete Access', 'Port': Port })
})

app.delete('/user/:id', (req, res) => {
    use_file(req);
    const userId = parseInt(req.params.id, 10);
    const user = data.find(u => u.id === userId)
    if (user) {
        data = data.filter(u => u.id !== userId)
        fs.writeFile('./Fake_Data.json', JSON.stringify(data), (err) => {
            console.log(err);
        })
        html(res, data)
    } else {
        return res.json({ 'Response': 'Not Available', 'Port': Port })
    }
})

app.listen(Port, () => { console.log('Serer Started') })

const html = (res, data) => {
    const users = Array.isArray(data) ? data : [data];
    let head = `<!DOCTYPE html> <html lang="en"><head><meta charset="UTF-8"><title>Sample Table</title><style>body{color:rgb(255, 255, 255);background-color:rgb(90, 90, 90);}table {width: 80%;margin: 40px auto;border-collapse: collapse;box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);border-radius: 10px;overflow: hidden;animation: fadeIn 1.5s ease;}caption {font-size: 2em;font-weight: bold;margin-bottom: 15px;animation: slideInDown 1s ease-out;}th, td {padding: 14px 20px;  border: 1px solid #ddd;text-align: left;transition: background-color 0.3s ease;}th{background-color: #4a90e2;text-transform: uppercase;letter-spacing: 0.05em;}tr:hover {background-color:white;color:rgb(92, 93, 94);transform: scale(1.01);transition: all 0.3s ease-in-out;}td {font-size: 1em;}@keyframes fadeIn {from { opacity: 0; transform: translateY(20px); }to {opacity: 1; transform:translateY(0);}}@keyframes slideInDown {from { opacity: 0; transform: translateY(-20px);}to {opacity: 1; transform: translateY(0); }}</style></head><body><table><caption>List Of User's Information</caption><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Title</th></tr>`;

    let body = users.map((item) => {
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