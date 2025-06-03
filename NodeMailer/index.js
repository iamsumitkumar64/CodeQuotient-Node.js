import exp from 'express';
import userRouter from "./routes/index.js";
import mongoose from "mongoose";
const db_url = 'mongodb://127.0.0.1:27017/MAIL';
import cookieParser from 'cookie-parser';
const app = exp();

app.use(exp.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(exp.json());
app.use(cookieParser());

mongoose.connect(db_url)
    .then(() => { console.log(`Database Connected At : ${db_url}`) })
    .catch((err) => { console.log(`Error Database Connected : ${err}`) })
app.use('/', userRouter);

app.listen(8000, () => { console.log('Server Started At 8000 PORT'); })