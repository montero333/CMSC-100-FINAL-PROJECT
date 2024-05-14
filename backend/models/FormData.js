const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const formDataSchema = new mongoose.Schema({
    userId: { type: String, default: uuidv4, unique: true }, // Generate a UUID for userId
    firstName: { type: String, required: true },
    middleName: { type: String, default: '' }, // Optional field, default value is an empty string
    lastName: { type: String, required: true },
    userType: { type: String, default: 'Customer' }, // Set default value to 'Customer'
    email: { type: String, required: true },
    password: { type: String, required: true }
}, { collection: 'User' });

const FormDataModel = mongoose.model('FormData', formDataSchema);

module.exports = FormDataModel;
