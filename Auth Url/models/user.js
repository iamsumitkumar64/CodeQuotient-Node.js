const db = require('mongoose');

const userschema = new db.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
    },
})

const User_Model = db.model('User-Detail', userschema);

module.exports = User_Model