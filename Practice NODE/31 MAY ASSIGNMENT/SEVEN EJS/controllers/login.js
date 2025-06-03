const signDB = require('../models/db');
const fs = require('fs');
const { setuser, getuser } = require('../service/index');

async function createUser(req, res) {
    const body = req.body;
    if (!body) return res.redirect('/');

    await signDB.create({
        name: body.name,
        email: body.email,
        password: body.pass
    });

    return res.redirect('/login');
}

async function loginUser(req, res) {
    const body = req.body;
    if (!body) return res.redirect('/');

    const entry = await signDB.findOne({ email: body.email, password: body.pass });
    if (!entry) return res.redirect('/login');

    const token = setuser(entry);
    res.cookie('c_token', token);
    return res.render('add_product');
}

function logout(req, res) {
    res.clearCookie('c_token');
    return res.redirect('/login');
}

async function createproduct(req, res) {
    const user = getuser(req.cookies.c_token);
    const imgsrc = req.file ? req.file.path : null;
    if (!user?.email) {
        return res.status(400).send("Invalid user.");
    }
    const existingUser = await signDB.findOne({
        'pack.product': req.body.product
    });
    if (existingUser) return res.redirect('/seen');
    const productEntry = {
        product: req.body.product,
        description: req.body.description,
        imgsrc: imgsrc
    };
    const updatedUser = await signDB.findOneAndUpdate(
        { email: user.email },
        { $push: { pack: productEntry } },
        { new: true }
    );
    if (!updatedUser) {
        return res.status(404).send("User not found.");
    }
    return res.redirect('/seen');
}

async function render_seen(req, res) {
    let allUser = await signDB.findOne({ email: req.user.email }, {
        _id: 0,
        name: 1,
        email: 1,
        pack: 1
    });
    if (allUser.pack.length == 0) allUser = 'NO DATA';
    return res.render('seen_product', { allUser: allUser });
}
async function render_all(req, res) {
    let allUser = await signDB.find({}, {
        _id: 0,
        name: 1,
        email: 1,
        pack: 1
    });
    const allEmpty = allUser.every(user => !user.pack || user.pack.length === 0);
    if (allEmpty) {
        allUser = 'NO DATA';
    }
    return res.render('seen_all', { allUser: allUser });
}

const delete_product = async (req, res) => {
    if (!req.user.email || !req.body.product || !req.body.description) {
        return res.status(400).json({ message: "Missing product or description" });
    }
    const user = await signDB.findOne({ email: req.user.email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const itemToDelete = user.pack.find(
        item => item.product === req.body.product && item.description === req.body.description
    );
    if (!itemToDelete) {
        return res.status(404).json({ message: "Product not found in pack" });
    }
    if (itemToDelete.imgsrc) {
        fs.unlink(itemToDelete.imgsrc, (err) => {
            if (err) {
                console.error("Image delete error:", err);
            }
        });
    }
    await signDB.findOneAndUpdate(
        { email: req.user.email },
        { $pull: { pack: { product: req.body.product, description: req.body.description } } }
    );
    res.redirect('/seen');
};

async function edit_product(req, res) {
    if (!req.user.email || !req.body.product) {
        return res.status(400).json({ message: "Missing product" });
    }
    const user = await signDB.findOne({ email: req.user.email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    let editDB = await signDB.findOne({ 'pack.product': req.body.product });
    if (!editDB) {
        return res.status(404).json({ message: "Product not found" });
    }
    const index = editDB.pack.findIndex(p => p.product === req.body.product);
    if (index === -1) {
        return res.status(404).json({ message: "Product not found in pack" });
    }
    if (req.file && editDB.pack[index].imgsrc) {
        fs.unlink(editDB.pack[index].imgsrc, (err) => {
            if (err) {
                console.error("Image delete error:", err);
            }
        });
    }
    const update = {};
    if (req.file) {
        update[`pack.${index}.imgsrc`] = req.file.path;
    }
    if (req.body.description) {
        update[`pack.${index}.description`] = req.body.description;
    }
    update[`pack.${index}.product`] = req.body.product;
    await signDB.findOneAndUpdate(
        { 'pack.product': req.body.product },
        { $set: update },
        { new: true }
    );
    return res.redirect('/seen');
}

module.exports = {
    createUser,
    loginUser,
    logout,
    createproduct,
    render_seen,
    render_all,
    edit_product,
    delete_product
};