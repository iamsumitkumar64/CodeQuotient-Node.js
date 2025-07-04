import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import router from './routes/route.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './connection.js';
import Chat from './models/chat.js';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    connectionStateRecovery: {},
});

const __dirname = dirname(fileURLToPath(import.meta.url)); // find our path from of our project the operating system
const users = new Map();

connectDB('mongodb://localhost:27017/codeQuotient');

io.on('connection', (socket) => {
    socket.on('connect', async(username,senderID,receiverID) => {
        await Chat.findOneAndUpdate({ username: username }, {
            senderID: senderID,
            receiverID: receiverID,
        });
    });
    // socket.on('client_broadcast', (messages,callback) => {
    //     socket.broadcast.emit('server_broadcast', messages);
    //     callback({
    //         status:'ok',
    //     });
    // });
    socket.on('client_messages', async ({ username, senderID, receiverID, message }) => {
        users.set(username, senderID);
        try {
            const userchat = await Chat.findOne({ username: username }).lean();
            if (userchat) {
                await Chat.findOneAndUpdate({ username: username }, {
                    senderID: senderID,
                    receiverID: receiverID,
                    $push: {
                        messages: message
                    }
                });
            }
            else {
                await Chat.create({
                    username: username,
                    senderID: senderID,
                    receiverID: receiverID,
                    messages: [message]
                });
            }
            socket.to(receiverID).emit('server_messages', message);
        }
        catch (error) {
            console.log("Error while sending message", error);
        }
    });
});

app.use('/', router);

httpServer.listen(8000, () => {
    console.log("Server started at PORT:8000");
});

export default __dirname;