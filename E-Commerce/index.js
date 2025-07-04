import exp from 'express';
import { allRoute } from './routes/index.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

const app = exp();
const server = http.createServer(app);
const io = new Server(server);
const onlineUsers = new Map();
let currentUser;

import { userDB } from './models/user.js';
import { supportDB } from './models/support.js';
import { productDB } from './models/product.js';

const Port = 8000;
const db_url = 'mongodb://127.0.0.1:27017/ECOMMERCE'

app.use(exp.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(exp.json());
app.set("view engine", "ejs");
app.use(exp.static('upload'))
app.use('/', allRoute);
// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (!token || token !== 'valid-token') {
//         const err = new Error('Authentication failed');
//         err.data = { reason: 'Invalid token' };
//         return next(err);
//     }
//     next();
// });

mongoose.connect(db_url)
    .then(() => { console.log(`Database Connected At : ${db_url}`) })
    .catch((err) => { console.log(`Error Database Connected : ${err}`) })

server.listen(Port, () => { console.log(`Server Started AT ${Port}`) });

io.on('connection', (socket) => {
    socket.on('eachConnect', async (productID, userID, sellerID, role) => {
        try {
            const seller = await userDB.findOne({ _id: sellerID }).lean(); // find seller
            const user = await userDB.findOne({ _id: userID }).lean(); // find user 
            let allChats;
            if (role === 'buyer') {
                currentUser = userID;
                onlineUsers.set(userID, socket.id);
                allChats = await supportDB.findOneAndUpdate( // update socket id in ChatDB
                    { buyerID: user._id, sellerID: seller._id, productID: productID },
                    { buyerSocketID: socket.id, sellerSocketID: seller.socketID, resolve: false },
                    { upsert: true }
                ).lean();
                await userDB.findOneAndUpdate({ _id: userID }, { socketID: socket.id }).lean();
                socket.emit("status", { online: onlineUsers.has(sellerID) });
            }
            else {
                currentUser = sellerID;
                onlineUsers.set(sellerID, socket.id);
                allChats = await supportDB.findOneAndUpdate( // update socket id in ChatDB
                    { buyerID: user._id, sellerID: seller._id, productID: productID },
                    { buyerSocketID: user.socketID, sellerSocketID: socket.id, resolve: false },
                    { upsert: true }
                ).lean();
                await userDB.findOneAndUpdate({ _id: sellerID }, { socketID: socket.id }).lean();
                socket.emit("status", { online: onlineUsers.has(userID) });
            }
            socket.emit("allChats", allChats.messages || []);
        }
        catch (error) {
            console.log("Socket Error: Error while connecting Customer and Seller", error);
        }
    });

    socket.on('client_messages', async (productID, userID, sellerID, role, message) => {
        try {
            const product = await productDB.findOne({ 'product._id': productID }).lean(); // find product
            const seller = await userDB.findOne({ _id: sellerID }).lean(); // find seller
            const user = await userDB.findOneAndUpdate({ _id: userID }).lean(); // find user

            const email = role === 'seller' ? seller.email : user.email;
            message = `${email}: ${message}`;
            await supportDB.findOneAndUpdate(
                { buyerID: user._id, sellerID: seller._id, productID: productID },
                {
                    // date: Date.now(),
                    $push: {
                        messages: message
                    }
                },
            );
            message = [message];
            if (role === 'seller') {
                io.to(user.socketID).emit('allChats', message);
            }
            else {
                io.to(seller.socketID).emit('allChats', message);
            }
        }
        catch (error) {
            console.log("Error while sending message", error);
        }
    });

    socket.on('resolve', async (productID, userID, sellerID, role) => {
        try {

            const allChats = await supportDB.findOneAndUpdate(
                { buyerID: userID, sellerID: sellerID, productID: productID },
                { resolve: true }
            ).lean();
            role === 'seller' ? io.to(allChats.buyerSocketID).emit('allChats', [`<b align="center">Problem is considered as Resolved By ${role}</b>`]) : io.to(allChats.sellerSocketID).emit('allChats', [`<b align="center">Problem is considered as Resolved By ${role}</b>`]);
        }
        catch {
            console.log('Error in resolving client help');
        }
    });

    socket.on("disconnect", () => {
        for (const [id, sockId] of onlineUsers) {
            if (sockId === socket.id) {
                onlineUsers.delete(id);
                break;
            }
        }
    });
});