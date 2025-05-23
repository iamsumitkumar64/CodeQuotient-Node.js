const db = require('mongoose');

const userschema = new db.Schema({
    GivenId: {
        type: String,
        required: true,
        unique: true
    },
    ShortId: {
        type: String,
        required: true,
        unique: true
    },
    // Visit: [{ timestamp: { type: Number } }],
    Visit: [{ timestamp: { } }],
}, { timstamps: true })

const User = db.model('Url-Shorten', userschema);

module.exports = User