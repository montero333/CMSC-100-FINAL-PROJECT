const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productDataSchema = new mongoose.Schema({
    productID: { type: String, default: uuidv4, unique: true },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productType: { type: String, required: true, enum: ['crop', 'poultry'] },
    productQuantity: { type: Number, required: true },
    productPrice: { type: Number, required: true }
}, { collection: 'Products' });

const ProductDataModel = mongoose.model('ProductData', productDataSchema);

module.exports = ProductDataModel;
