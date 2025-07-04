import express from 'express';
import Stripe from 'stripe';
import bodyparser from 'body-parser';
import path from 'path';
const app = express();
import { config as configDotenv } from 'dotenv';
configDotenv();

const stripe = new Stripe(process.env.STRIVE_KEY);
const Publishable_Key = process.env.Publishable_Key;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { key: Publishable_Key })
});
app.post("/payment", function (req, res) {
    console.log(req.body);
	stripe.customers
		.create({
			email: req.body.stripeEmail,
			source: req.body.stripeToken,
			name: "Customer Ji",
			address: {
				line1: "1/2 COlony",
				postal_code: "452331",
				city: "Gwalior",
				state: "Madhya Pradesh",
				country: "India"
			}
		})
		.then((customer) => {
			return stripe.charges.create({
				amount: 15000000, //in cent
				description: "Samsung A15",
				currency: "INR",
				customer: customer.id
			});
		})
		.then((charge) => {
			res.send("Payment Success"); 
		})
		.catch((err) => {
			res.send(err);
		});
});

app.listen(8000, () => { console.log('Server started at 8000') })