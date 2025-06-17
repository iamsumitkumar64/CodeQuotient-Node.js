import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    chats: [String],
}, { timestamps: true });

let chatDB = mongoose.model('Chats', chatSchema);

export { chatDB }