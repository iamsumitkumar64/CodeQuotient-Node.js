const db = require('mongoose')

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


module.exports=User