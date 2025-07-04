import exp from 'express';
import { checkLogin, checkrole } from '../middleware/index.js';
import { main_api, checkout, onecheckout, placeorder, showorder, showreceipt } from '../controller/show.js';
import { createuser, loginuser, logoutuser } from '../controller/auth.js';
import { addcart, showcart, quantcart, deletecart } from '../controller/cart.js';
import { add_product, show_product, send_product, delete_product, support_page, give_support } from '../controller/product.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        const file_name = file.originalname.replace(/(\.[\w\d_-]+)$/i, `-${Date.now()}$1`);
        req.file_name = file_name;
        cb(null, file_name);
    }
});

const upload = multer({
    storage: storage
});

const allRoute = exp.Router();

allRoute.route('/')
    .get((req, res) => { return res.redirect('/main') })

allRoute.route('/login')
    .get((req, res) => { return res.render('login'); })
    .post(loginuser)

allRoute.route('/signup')
    .get((req, res) => { return res.render('signup'); })
    .post(createuser)

allRoute.route('/main')
    // .all(checkLogin)
    .get((req, res) => { return res.render('main'); })

allRoute.route('/logout')
    .get(logoutuser)

allRoute.route('/api/main/:start')
    // .all(checkLogin)
    .get(main_api)

allRoute.route('/api/addcart')
    // .all(checkLogin)
    .post(addcart)

allRoute.route('/api/quantcart')
    // .all(checkLogin)
    .post(quantcart)

allRoute.route('/api/deletecart')
    // .all(checkLogin)
    .post(deletecart)

allRoute.route('/api/checkout')
    .all(checkLogin)
    .post(checkout)

allRoute.route('/api/onecheckout')
    .all(checkLogin)
    .post(onecheckout)

allRoute.route('/api/showcart')
    // .all(checkLogin)
    // .get(showcart)
    .post(showcart)

allRoute.route('/api/showorder')
    .all(checkLogin)
    .get(showorder)

allRoute.route('/api/showreceipt')
    .all(checkLogin)
    .get(showreceipt)

allRoute.route('/add_product')
    .all(checkLogin, checkrole)
    .get(send_product)
    .post(upload.fields([{ name: 'imgsrc', maxCount: 1 }, { name: 'imgsrclist', maxCount: 5 }]), add_product)

allRoute.route('/cart_page')
    // .all(checkLogin)
    .get((req, res) => { return res.render('cart'); })

allRoute.route('/checkout')
    .all(checkLogin)
    .get((req, res) => { return res.render('checkout_page'); })
    .post(placeorder)

allRoute.route('/product_page')
    // .all(checkLogin)
    .get(show_product)

allRoute.route('/delete_product')
    .all(checkLogin)
    .get(delete_product)

allRoute.route('/receipt')
    .all(checkLogin)
    .get(async (req, res) => {
        return res.render('receipt');
    })

allRoute.route('/support')
    .all(checkLogin)
    .get(support_page)
    .post(give_support)

export { allRoute }