import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    total_price: {
        type: Number,
        required: true,
        min: 0
    }
});

const orderSchema = new mongoose.Schema({
    shipping_address: {
        type: String,
        required: true,
        default: 'None'
    },
    card_details: {
        type: String,
        required: true,
        default: 'None'
    },
    order_notes: {
        type: String
    },
    items: {
        type: [itemSchema],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0
    },
    total_price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        default: "Pending"
    },
    has_placed_order: {
        type: String,
        default: 'Pending'
    }
}, { timestamps: true });

const userCheckoutSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    orders: {
        type: [orderSchema],
        default: []
    }
});

const checkoutDB = mongoose.model("checkoutdbs", userCheckoutSchema);
export { checkoutDB };
