const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const ProductData = require('./ProductData'); // Import ProductDataModel

const formDataSchema = new mongoose.Schema({
    userId: { type: String, default: uuidv4, unique: true },
    firstName: { type: String, required: true },
    middleName: { type: String, default: '' },
    lastName: { type: String, required: true },
    userType: { type: String, default: 'Customer' },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: { type: String, required: true },
    userCart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductData' }, // Reference to ProductDataModel
        productName: String,
        productPrice: Number
    }]
}, { collection: 'User' });

formDataSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const FormDataModel = mongoose.model('FormData', formDataSchema);

module.exports = FormDataModel;
