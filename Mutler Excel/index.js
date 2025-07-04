import exp from 'express'
const app = exp();
import allroute from './routes/index.js';
const PORT = 8000;
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
const db_url = 'mongodb://127.0.0.1:27017/MUTLER';

app.set('view engine', 'ejs');
app.use(exp.urlencoded({ extended: true }));
app.use(exp.json());
app.use(cookieParser());

mongoose.connect(db_url)
    .then(() => { console.log(`Database Connected At : ${db_url}`) })
    .catch((err) => { console.log(`Error Database Connected : ${err}`) })

app.use('/', allroute);

app.listen(PORT, () => { console.log(`Server Started At PORT : ${PORT}`); });