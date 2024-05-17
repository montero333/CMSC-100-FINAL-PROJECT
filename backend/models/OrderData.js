const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true
    },
    products: [
        {
            productID: {
                type: String,
                required: true,
                ref: 'ProductData' 
            },
            quantity: {
                type: Number,
                required: true
            },
            productPrice: {
                type: Number,
                required: true,
                ref: 'ProductData'
            }
        }
    ],
    status: {
        type: Number,
        required: true,
        enum: [0, 1, 2], // Assuming status can be 0 (pending), 1 (completed), or 2 (canceled)
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        ref: 'FormData' // Reference the FormDataModel
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, { collection: 'Transaction' });

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;
