import mongoose from "mongoose";

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
    role: {
        type: String,
        required: true
    }, 
    socketID: {
        type: String
    },
    cart: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'productDB',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, { timestamps: true });

const userDB = mongoose.model('userDB', userSchema);
export { userDB };