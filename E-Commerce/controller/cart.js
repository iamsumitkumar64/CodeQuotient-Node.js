import { userDB } from '../models/user.js';
import { productDB } from '../models/product.js';
import { getuser } from '../service/index.js';

async function addcart(req, res) {
    const { product_id, quant_value } = req.body;
    if (!product_id) return res.status(400).json({ Success: false, Message: 'Product ID is required' });
    let all_product = await productDB.findOne({ 'product._id': product_id })
    if (!all_product) return res.status(404).json({ Success: false, Message: 'Product not found' });
    let token = req.cookies['c_token'];
    if (!token) return res.status(401).json({ Success: false, Message: 'Unauthorized' });
    const user_data = getuser(token);
    const user = await userDB.findOne({ email: user_data.email });
    if (!user) return res.status(404).json({ Success: false, Message: 'User not found' });
    if (all_product.email === user.email) {
        return res.json({ Success: false, Message: "You can't buy your own product" });
    }
    const existingCartItem = user.cart.find(item => item.product_id.toString() === product_id);
    if (existingCartItem) {
        existingCartItem.quantity = quant_value;
        if (existingCartItem.quantity <= 0) {
            user.cart = user.cart.filter(item => item.product_id.toString() !== product_id);
        }
    } else {
        user.cart.push({ product_id, quantity: quant_value });
    }
    await user.save();
    return res.json({ Success: true, Message: "Product added to cart" });
}

async function deletecart(req, res) {
    if (!req.body.id) return res.send({ 'Success': 'False' });
    let user_email = req.cookies['c_token'];
    user_email = getuser(user_email);
    if (!user_email) return res.json({ 'Error': 'Unauthorized' });
    const db = await userDB.findOneAndUpdate(
        { email: user_email.email },
        { $pull: { cart: { product_id: req.body.id } } },
        { new: true }
    );
    return res.send({ 'success': 'True' });
}

async function quantcart(req, res) {
    let user_email = req.cookies['c_token'];
    user_email = getuser(user_email);
    if(!user_email) return res.json({ 'Error': 'Unauthorized' });
    const user = await userDB.findOne({ email: user_email.email });
    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }
    if (!user.cart) {
        user.cart = [];
    }
    const qty = parseInt(req.body.quantvalue);
    if (isNaN(qty) || qty < 1) {
        return res.status(400).send({ error: 'Invalid quantity provided' });
    }
    let productFound = false;
    for (let item of user.cart) {
        if (item.product_id.toString() == req.body.id) {
            item.quantity = qty;
            productFound = true;
            break;
        }
    }
    await user.save();
    if (!productFound) {
        return res.status(404).send({ error: 'Product not found in cart' });
    }
    return res.send({ success: 'Yes' });
}
async function showcart(req, res) {
    const localdata = req.body.localData;
    const token = req.cookies['c_token'];
    const user = getuser(token);
    let userCart = [],bool=false;

    if (!user?._id) {
        userCart = localdata;
    } else {
        for (let product of localdata) {
            bool=true;
            const exist = await userDB.findOne({ _id: user._id, 'cart.product_id': product.product_id });
            if (exist) {
                await userDB.findOneAndUpdate(
                    {
                        _id: user._id,
                        'cart.product_id': product.product_id,
                    },
                    {
                        $set: { 'cart.$.quantity': product.quantity }
                    }
                );
            } else {
                await userDB.findOneAndUpdate(
                    { _id: user._id },
                    {
                        $push: {
                            cart: {
                                product_id: product.product_id,
                                quantity: product.quantity
                            }
                        }
                    }
                );
            }
        }
        const userData = await userDB.findOne({ _id: user._id }).lean();
        userCart = userData.cart;
    }

    let data = await productDB.find({}).lean();
    data = data.flatMap(elem => elem.product);

    const cartMap = new Map();
    userCart.forEach(item => {
        cartMap.set(String(item.product_id), item.quantity);
    });

    const matchedProducts = data
        .filter(product => cartMap.has(String(product._id)))
        .map(product => ({
            ...product,
            quantity: cartMap.get(String(product._id)),
        }));

    return res.status(200).send({
        clearLocalStorage: bool,
        cart: matchedProducts
    });
}

export { addcart, showcart, quantcart, deletecart }