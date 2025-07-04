import mongoose from "mongoose";

const products = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    imgsrc: {
        type: String,
        required: true,
    },
    imgsrc_list: {
        type: [String],
        default: [],
    },
    product_category:{
        type:String,
        required: true,
    },
    stocks:{
        type:Number,
        required:true
    },
    buylimit:{
        type:Number,
        required:true
    },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    product: [products]
}, { timestamps: true });

const productDB = mongoose.model('productDB', productSchema);

export { productDB }