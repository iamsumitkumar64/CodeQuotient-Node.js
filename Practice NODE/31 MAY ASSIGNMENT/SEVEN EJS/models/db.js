const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product: {
        type: String,
        unique:true
    },
    imgsrc: {
        type: String
    },
    description: {
        type: String
    }
});

const userSchema = new mongoose.Schema({
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
    pack: [productSchema]
}, { timestamps: true });

const signDB = mongoose.model('productDB', userSchema);

module.exports = signDB;
