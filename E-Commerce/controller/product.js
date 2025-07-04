import { checkoutDB } from '../models/checkout.js';
import { productDB } from '../models/product.js';
import { userDB } from '../models/user.js';
import { supportDB } from '../models/support.js';
import { getuser } from '../service/index.js';
// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: "sumitkumarshaab@gmail.com",
//         pass: 'egwnjddniqclltzs',
//     },
// });
// async function sendOtpEmail(subject, name, email, mobile_number, query) {
//     await transporter.sendMail({
//         from: `${name} ${email}`,
//         to: `${email}`,
//         subject: `${subject}`,
//         html: `${query}  ${mobile_number}`
//     }).then((info) => {
//         console.log('Message Sent :', info.messageId);
//         console.log('Preview URL :', nodemailer.getTestMessageUrl(info));
//     }).catch((err) => { console.log('Email Error', err) })
// }

async function show_product(req, res) {
    const id = req.query.product_id;
    let product_details = await productDB.findOne({ 'product._id': id });
    let product = product_details.product.find(item => item._id.toString() === id);
    let allproducts = await productDB.find({}, { product: 1, _id: 0 });
    let same_category = allproducts.flatMap(item => item.product);
    same_category = same_category.filter(item => item.product_category === product.product_category);
    same_category = same_category.filter(item => item._id.toString() !== id);
    let togetherbought = await checkoutDB.aggregate([
        { $unwind: '$orders' },
        { $match: { 'orders.items.product_id': id } },
        { $unwind: '$orders.items' },
        { $match: { 'orders.items.product_id': { $ne: id } } },
        {
            $group: {
                _id: '$orders.items.product_id',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);
    togetherbought = togetherbought.flatMap(item => item._id);
    allproducts = allproducts.flatMap(item => item.product);
    let ans = [];
    togetherbought.forEach(elem => {
        let res = allproducts.filter(item => item._id == elem);
        ans.push(res);
    });
    let sellerID = (await userDB.findOne({ email: product_details.email }, { _id: 1 }))._id.toString();
    const user_token = req.cookies['c_token'];
    let cookie = getuser(user_token);
    let userID, role;
    if (!user_token || !cookie) {
        userID = '000';
        role = 'none';
    } else {
        userID = cookie._id;
        role = cookie.role;
    }
    return res.render('product_page', { 'product': product, 'same_category': same_category, 'together': ans, sellerID, userID, role });
}

async function send_product(req, res) {
    let user_email = req.cookies['c_token'];
    let user = getuser(user_email);
    let user_id = user._id;
    user_email = user.email;
    let product_details = (await productDB.findOne({ email: user_email })).product;
    let supportforuser = await supportDB.find({ sellerID: user_id ,resolve:false});
    return res.render('add_product', { 'product': product_details, supportforuser });
}

async function delete_product(req, res) {
    const id = req.query.product_id;
    let user_email = req.cookies['c_token'];
    user_email = getuser(user_email).email;
    await productDB.updateOne(
        { 'product._id': id, email: user_email },
        { $pull: { product: { _id: id } } }
    );
    return res.redirect('/add_product');
}

async function add_product(req, res) {
    let user_email = req.cookies['c_token'];
    user_email = getuser(user_email);
    let imgsrclistFilenames = [];
    if (req.files['imgsrclist']) {
        imgsrclistFilenames = req.files['imgsrclist'].map(file => file.filename);
    }
    await productDB.findOneAndUpdate(
        { email: user_email.email },
        {
            $push: {
                product: {
                    description: req.body.description, price: req.body.price, imgsrc: req.files['imgsrc'][0].filename, product_name: req.body.product,
                    imgsrc_list: imgsrclistFilenames, product_category: req.body.category, buylimit: req.body.limit, stocks: req.body.stocks
                }
            }
        },
        { new: true, upsert: true });
    return res.redirect('/main');
}

async function support_page(req, res) {
    return res.render('support', { 'product_id': req.query.product_id });
}

async function give_support(req, res) {

    //     await supportDB.findOneAndUpdate(
    //         { product_id: req.body.product_id },
    //         {
    //             $push: {
    //                 customers: {
    //                     customer_name: req.body.customer_name,
    //                     customer_email: req.body.customer_email,
    //                     customer_mobile_number: req.body.customer_mobile_number,
    //                     customer_query: req.body.customer_query,
    //                 }
    //             }
    //         },
    //         { new: true, upsert: true }
    //     );
    //     const product = await productDB.findOne({ 'product._id': req.body.product_id },{product:0});

    //     await sendOtpEmail('Customer Help from Birwal Kart', req.body.customer_name, req.body.customer_email, `Submitted Contact Number :=>${req.body.customer_mobile_number}`, `Your Request :=> ${req.body.customer_query} is submitted`);

    //     await sendOtpEmail('Customer Help from Birwal Kart', product.name, product.email, `Customer Contact Number :=>${req.body.customer_mobile_number}`, `Hey Buddy i have used your product recently and my question is :=> ${req.body.customer_query}`);
    // return res.redirect('/');
}

export { add_product, show_product, send_product, delete_product, support_page, give_support }