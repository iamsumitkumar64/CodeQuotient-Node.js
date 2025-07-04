import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import { mongoose } from "mongoose";
import { chatDB } from './models/index.js'; 
const db_url = 'mongodb://127.0.0.1:27017/Sockets'

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
});

const sendUserList = () => {
    const clientIds = Array.from(io.sockets.sockets.keys());
    io.emit('user_list', clientIds);
};

let u_count = 0;
const MAX_USERS = 2;

io.on('connection', (socket) => {
    if (u_count >= MAX_USERS) {
        console.log(`Connection rejected for ${socket.id}: Maximum users (${MAX_USERS}) reached.`);
        socket.emit('chat_message', 'Sorry, the chat room is full. Please try again later.');
        socket.disconnect(true);
        return;
    }
    u_count++;
    console.log(`A user connected = ${socket.id}. Total connected: ${u_count}`);
    sendUserList();

    socket.on('chat_message', async ({ message, targetSocketId }, callback) => {
        const realmsg = message.trim();
        if (!realmsg) {
            return callback({ status: 'error', message: 'Message cannot be empty.' });
        }

        let senderId = socket.id;
        let receiverId = targetSocketId || 'broadcast'; 
        try {
            let chatEntry = await chatDB.findOne({
                $or: [
                    { sender: senderId, receiver: receiverId },
                    { sender: receiverId, receiver: senderId }
                ]
            });
            if (!chatEntry) {
                chatEntry = new chatDB({
                    sender: senderId,
                    receiver: receiverId,
                    chats: []
                });
            }
            chatEntry.chats.push(`[${new Date().toLocaleTimeString()}]: ${realmsg}`);
            await chatEntry.save();
            if (targetSocketId) {
                io.to(targetSocketId).emit('chat_message', `[Private from ${senderId}]: ${realmsg}`);
                socket.emit('chat_message', `[Private to ${targetSocketId}]: ${realmsg}`);
            } else {
                socket.broadcast.emit('chat_message', `[Broadcast from ${senderId}]: ${realmsg}`);
                socket.emit('chat_message', `[Broadcast from ${senderId}]: ${realmsg}`);
            }
            callback({ status: 'ok' });
        } catch (error) {
            console.error('Error saving message or emitting:', error);
            callback({ status: 'error', message: 'Failed to send message.' });
        }
    });
    socket.on('disconnect', () => {
        u_count--;
        console.log(`User disconnected = ${socket.id}. Total connected: ${u_count}`);
        sendUserList();
    });
});

mongoose.connect(db_url)
    .then(() => { console.log(`Database Connected At : ${db_url}`) })
    .catch((err) => { console.log(`Error Database Connected : ${err}`) })

server.listen(8000, () => {
    console.log('Server running at http://localhost:8000');
});