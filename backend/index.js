const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');
const ProductDataModel = require('./models/ProductData');
const OrderDataModel = require('./models/OrderData');
const bcrypt = require('bcrypt');
const app = express();


app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/CMSC100', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const addToCartRoute = require('./routers/addToCart'); // Ensure correct path to your route file



// REGISTER
app.post('/register', async (req, res) => {
    const { firstName, middleName, lastName, email, password } = req.body;

    // Validate input fields
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if the email is already registered
        const existingUser = await FormDataModel.findOne({ email });

        if (existingUser) {
            console.log('Email already registered:', email);
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create new user (userId and password hashing are handled in the schema)
        const newUser = new FormDataModel({
            firstName,
            middleName,
            lastName,
            email,
            password,
            userCart: [] // Initialize the cart as an empty array
        });

        // Save the new user to the database
        await newUser.save();

        // Return the newly created user
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// FINISHED LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        console.error("Error:", err);
                        res.status(500).json("Internal Server Error");
                    } else if (result) {
                        // Return userId, email, userType, and userCart on successful login
                        res.json({ 
                            message: "Success", 
                            userId: user.userId,
                            email: user.email,
                            userType: user.userType,
                            userCart: user.userCart 
                        });
                    } else {
                        res.json("Wrong password");
                    }
                });
            } else {
                res.json("No user found with this email");
            }
        })
        .catch(err => {
            console.error("Error:", err);
            res.status(500).json("Internal Server Error");
        });
});



// RETRIEVE USERS
app.get('/users', async (req, res) => {
    try {
        const users = await FormDataModel.find({});
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Add New Product
app.post('/products', async (req, res) => {
    const { productName, productDescription, productType, productQuantity, productPrice } = req.body;

    if (!productName || !productDescription || !productType || !productQuantity || !productPrice) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newProduct = new ProductDataModel({
            productName,
            productDescription,
            productType,
            productQuantity,
            productPrice
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});


// TO DO: UPDATE PRODUCTS
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { productName, productDescription, productType, productQuantity, productPrice } = req.body;

    try {
        const updatedProduct = await ProductDataModel.findOneAndUpdate(
            { productID: id },
            { productName, productDescription, productType, productQuantity, productPrice },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// TO DO: RETRIEVE PRODUCTS 
app.get('/products', async (req, res) => {
    try {
        // Retrieve all products from the database
        const products = await ProductDataModel.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// FIND USER BY EMAIL
app.get('/user/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Find the user by email in the User collection of the CMSC100 database
        const user = await FormDataModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the user data as response
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});






app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
