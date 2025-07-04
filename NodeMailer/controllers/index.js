import signDB from '../models/index.js';
import { setuser, getuser } from '../services/index.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "sumitkumarshaab@gmail.com",
        pass: 'egwnjddniqclltzs',
    },
});

function req_body_miss(req, res, redirectUrl = '/') {
    if (!req.body) {
        res.redirect(redirectUrl);
        return true;
    }
    return false;
}

function generateOtp() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]).{5,}$/;
    return passwordRegex.test(password);
}

async function sendOtpEmail(email, otp) {
    return await transporter.sendMail({
        from: '"Sumit Kumar 👨‍💻" <sumitkumarshaab@gmail.com>',
        to: email,
        subject: "OTP Verification ✔",
        text: `Hi there! Just a quick note to let you know that your One-Time Password (OTP) is: ${otp}. 
        
        Please enter this code to complete your verification process. For your security, make sure not to share this code with anyone.
        If you didn’t request this OTP, please ignore this message or contact our support team right away.`,
    });
}

async function createUser(req, res) {
    if (req_body_miss(req, res)) return;
    const { name, email, pass } = req.body;
    if (!validatePassword(pass)) {
        return res.redirect('/register?error=invalid_password');
    }
    await signDB.create({ name, email, password: pass });

    res.redirect('/login');
}

async function loginUser(req, res) {
    if (req_body_miss(req, res, '/login')) return;

    const { email, pass } = req.body;
    const entry = await signDB.findOne({ email, password: pass });

    if (!entry) return res.redirect('/login');

    const token = setuser(entry);
    res.cookie('c_token', token);
    res.redirect('/main');
}

function logout(req, res) {
    res.clearCookie('c_token');
    res.redirect('/login');
}

async function update_pass(req, res) {
    const c_token = req.cookies?.c_token;
    const user = getuser(c_token);
    if (!user) return res.redirect('/');

    if (!validatePassword(req.body.c_pass)) {
        return res.redirect('/update?error=invalid_password');
    }
    const dbUser = await await signDB.findOne({ email: user.email });;
    dbUser.password = req.body.c_pass;
    await dbUser.save();

    res.redirect('/logout');
}

async function forget_pass(req, res) {
    if (req_body_miss(req, res, '/forget')) return;

    const { email } = req.body;
    const dbUser = await await signDB.findOne({ email });
    if (!dbUser) return res.redirect('/forget');

    const otp = generateOtp();
    const info = await sendOtpEmail(email, otp);

    dbUser.otp = otp;
    await dbUser.save();

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.send({ message: "Email sent successfully" });
}

async function mail_otp(req, res) {
    const user = await signDB.findOne({ otp: req.body.u_otp });
    if (!user) return res.redirect('/forget');

    const token = setuser(user);
    res.cookie('c_token', token);
    res.redirect('/update');
}

export {
    createUser,
    loginUser,
    logout,
    update_pass,
    forget_pass,
    mail_otp
};