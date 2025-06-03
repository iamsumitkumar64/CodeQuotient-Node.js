import { mongoose } from "mongoose";

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
    otp:{
        type:Number
    }
}, { timestamps: true });

const signDB = mongoose.model('forget', userSchema);

export default signDB;