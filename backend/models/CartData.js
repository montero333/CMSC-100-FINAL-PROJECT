const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define Cart schema
const CartSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    products: [
        {
            productID: {
                type: String,
                required: true
            },
            productName: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
}, { collection: "Cart" });

const CartModel = mongoose.model('CartData', CartSchema);

module.exports = CartModel;
