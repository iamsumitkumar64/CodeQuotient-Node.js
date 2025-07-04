import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    senderID: {
        type: String,
        required: true,
    },
    receiverID: {
        type: String,
        required: true,
    },
    messages: {
        type: [String],
        default: []
    }
});

const Chat = mongoose.model('chat', chatSchema);

export default Chat;