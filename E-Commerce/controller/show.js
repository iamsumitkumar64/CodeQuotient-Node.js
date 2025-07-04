import { userDB } from '../models/user.js';
import { productDB } from '../models/product.js';
import { checkoutDB } from '../models/checkout.js';
import { getuser } from '../service/index.js';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

async function main_api(req, res) {
    const user_token = req.cookies['c_token'];
    const user_email = getuser(user_token)?.email;
    const start = parseInt(req.params.start);
    let limit = 4;
    let pkg = await productDB.find({});
    pkg = pkg.flatMap(item => item.product);
    pkg = pkg.slice(start, start + limit);
    if (user_email) {
        const user_detail = await userDB.findOne({ email: user_email });
        const cartMap = new Map(
            user_detail.cart.map(item => [item.product_id.toString(), item.quantity])
        );
        pkg = pkg.map(product => ({
            _id: product._id.toString(),
            user_name: user_detail.name,
            name: product.product_name,
            price: product.price,
            imgsrc: product.imgsrc,
            description: product.description,
            quantity: cartMap.get(product._id.toString()) || 1,
            Limit:product.buylimit
        }));
    } else {
        pkg = pkg.map(product => ({
            _id: product._id.toString(),
            user_name: 'Ghost',
            name: product.product_name,
            price: product.price,
            imgsrc: product.imgsrc,
            description: product.description,
            quantity: 1,
            Limit:product.buylimit
        }));
    }
    if (!pkg.length) pkg = 'No data';
    return res.json(pkg);
}

async function onecheckout(req, res) {
    const user_token = req.cookies['c_token'];
    const user_email = getuser(user_token)?.email;
    if (!user_email) return res.status(401).json({'Unauthorized':'not login'});
    const user = await userDB.findOne({ email: user_email });
    if (!user) return res.status(404).json({'isUser':'User not found'});

    const productIds = req.body.ids;
    if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).send('No product IDs provided');
    }

    let totalPrice = 0;
    let checkoutItems = [];

    for (const p_id of productIds) {
        const matchid = new ObjectId(p_id);
        const product = await productDB.aggregate([
            { $unwind: '$product' },
            { $match: { 'product._id': matchid } },
            {
                $project: {
                    product_name: '$product.product_name',
                    price: '$product.price',
                    stock: '$product.stocks',
                    buylimit: '$product.buylimit'
                }
            }
        ]);
        if (!product[0]) {
            return res.status(404).send(`Product with ID ${p_id} not found`);
        }
        if (product[0].buylimit < req.body.quant_value) {
            return res.json({ 'Exceeded': 'High Limit' });
        }
        await productDB.updateOne(
            { 'product._id': matchid },
            { $inc: { 'product.$.stocks': -req.body.quant_value } }
        );
        const itemTotal = product[0].price * req.body.quant_value;
        totalPrice += itemTotal;

        checkoutItems.push({
            product_id: p_id,
            product_name: product[0].product_name,
            quantity: req.body.quant_value,
            total_price: itemTotal
        });
    }
    const newOrder = {
        shipping_address: 'None',
        card_details: 'None',
        order_notes: '',
        items: checkoutItems,
        total_price: totalPrice,
        status: 'Pending'
    };
    await checkoutDB.findOneAndUpdate(
        { email: user_email },
        {
            $push: { orders: newOrder },
            $set: { has_placed_order: 'Pending' }
        },
        { upsert: true, new: true }
    );

    res.send({ success: true });
}

async function checkout(req, res) {
    const user_token = req.cookies['c_token'];
    const user_email = getuser(user_token)?.email;
    if (!user_email) return res.status(401).send('Unauthorized');
    const user = await userDB.findOne({ email: user_email });
    if (!user) return res.status(404).send('User not found');
    const productIds = req.body.ids;
    if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).send('No product IDs provided');
    }
    let totalPrice = 0;
    let checkoutItems = [];
    for (const p_id of productIds) {
        const cartItem = user.cart.find(item => item.product_id.toString() === p_id);
        if (!cartItem) {
            return res.status(404).send(`Product with ID ${p_id} not found in cart`);
        }
        const matchid = new ObjectId(p_id);
        const product = await productDB.aggregate([
            { $unwind: '$product' },
            { $match: { 'product._id': matchid } },
            {
                $project: {
                    product_name: '$product.product_name',
                    price: '$product.price',
                    stock: '$product.stocks',
                    buylimit: '$product.buylimit'
                }
            }
        ]);
        if (product[0].buylimit < cartItem.quantity) {
            return res.json({ 'Exceeded': 'High Limit', 'product': `${product[0].product_name}` });
        }
        await productDB.updateOne(
            { 'product._id': matchid },
            { $inc: { 'product.$.stocks': -cartItem.quantity } }
        );
        if (!product[0]) {
            return res.status(404).send(`Product with ID ${p_id} not found`);
        }
        const itemTotal = product[0].price * cartItem.quantity;
        totalPrice += itemTotal;
        checkoutItems.push({
            product_id: p_id,
            product_name: product[0].product_name,
            quantity: cartItem.quantity,
            total_price: itemTotal
        });
    }
    if (totalPrice > 500) { totalPrice = totalPrice + totalPrice * 0.1 }
    const newOrder = {
        shipping_address: 'None',
        card_details: 'None',
        order_notes: '',
        items: checkoutItems,
        total_price: totalPrice,
        status: 'Pending'
    };
    await checkoutDB.findOneAndUpdate(
        { email: user_email },
        {
            $push: { orders: newOrder },
            $set: { has_placed_order: 'Pending' }
        },
        { upsert: true, new: true }
    );
    res.send({ success: true });
}

async function placeorder(req, res) {
    const user_token = req.cookies['c_token'];
    const user_email = getuser(user_token)?.email;
    if (!user_email) return res.status(401).send('Unauthorized');
    const userCheckout = await checkoutDB.findOne({ email: user_email });
    if (!userCheckout || !userCheckout.orders.length) {
        return res.status(400).send('No pending order found to update');
    }
    const latestOrder = userCheckout.orders[userCheckout.orders.length - 1];
    if (latestOrder.status !== 'Pending') {
        return res.status(400).send('No pending order available to finalize');
    }
    latestOrder.shipping_address = req.body.address;
    latestOrder.card_details = req.body.card;
    latestOrder.order_notes = req.body.notes || '';
    latestOrder.status = 'Confirmed';
    latestOrder.has_placed_order = 'Confirmed';
    await userCheckout.save();
    return res.redirect('/receipt');
}

async function showorder(req, res) {
    const user_token = req.cookies['c_token'];
    const user_email = getuser(user_token)?.email;
    if (!user_email) return res.status(401).send('Unauthorized');
    const userCheckout = await checkoutDB.findOne({ email: user_email });
    if (!userCheckout || !userCheckout.orders.length) {
        return res.status(404).send('No orders found');
    }
    const latestOrder = userCheckout.orders[userCheckout.orders.length - 1];
    return res.send({
        email: userCheckout.email,
        total_amount: latestOrder.total_price
    });
}

async function showreceipt(req, res) {
    const user_token = req.cookies['c_token'];
    const user_email = getuser(user_token);
    const data = await checkoutDB.find({ email: user_email.email });
    let allCheckouts = await checkoutDB.find({});
    for (const checkout of allCheckouts) {
        const confirmedOrders = checkout.orders.filter(order => order.status === 'Confirmed')
        if (confirmedOrders.length !== checkout.orders.length) {
            checkout.orders = confirmedOrders;
            await checkout.save();
        }
    }
    return res.send(data[0]);
}

export { main_api, checkout, onecheckout, placeorder, showorder, showreceipt }