import exp from 'express';
const allroute = exp.Router();
import { get_index, get_login, get_signup, post_index, post_signup, post_login } from '../controllers/index.js';
import multer from 'multer';
import path from 'path';
import checkLogin from '../middleware/index.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        const u_date = new Date().toLocaleString('sv-SE').replace(/[: ]/g, '-');
        const ext = path.extname(file.originalname);
        cb(null, req.body.username + '-' + u_date + ext);
    }
});

const fileFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext === '.xlsx') {
        cb(null, true);
    } else {
        cb(new Error('Only .xlsx files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

allroute.get('/index', checkLogin, get_index)

allroute.route('/index')
    .post(upload.single('files'), post_index);

allroute.route('/')
    .get(get_login)
    .post(post_login)

allroute.route('/signup')
    .get(get_signup)
    .post(post_signup)

export default allroute