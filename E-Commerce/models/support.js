import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
    {
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productDB',
            required: true,
        },
        buyerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userDB',
            required: true,
        },
        sellerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userDB',
            required: true,
        },
        buyerSocketID: {
            type: String,
            required: true,
        },
        sellerSocketID: {
            type: String,
            required: true,
        },
        resolve:{
            type:Boolean,
            default:false
        },
        messages: {
            type: [String],
            default: []
        }
    }
);

const supportDB = mongoose.model('SupportDB', supportSchema);
export { supportDB }