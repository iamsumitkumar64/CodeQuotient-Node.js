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
    CreatedBy:{
        type:db.Schema.Types.ObjectId,
        ref:'User-Detail'
    },
    // Visit: [{ timestamp: { type: Number } }],
    Visit: [{ timestamp: { } }],
}, { timstamps: true })

const Url_Model = db.model('Url-Shorten', userschema);

module.exports = Url_Model