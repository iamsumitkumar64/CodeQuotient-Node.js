const db = require('mongoose')

const userschema = new db.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true })

let signDB = db.model('Practice_Session', userschema);

module.exports = signDB