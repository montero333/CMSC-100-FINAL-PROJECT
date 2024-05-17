const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');
const ProductDataModel = require('./models/ProductData');
const OrderDataModel = require('./models/OrderData'); // Import OrderDataModel
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const app = express();


app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/CMSC100', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// FINISHED REGISTER
app.post('/register', async (req, res) => {
    const { firstName, middleName, lastName, email, password } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await FormDataModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate userId
        const userId = uuidv4();

        // Create new user with generated userId and hashed password
        const newUser = await FormDataModel.create({
            firstName,
            middleName,
            lastName,
            email,
            password: hashedPassword,
            userId
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// FINISHED LOGIN
// Modify your login function to store the email
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
                        // Store user email in localStorage on successful login
                        res.json({ message: "Success", userType: user.userType, email: user.email });
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


// TO DO: ADD PRODUCTS



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


// TO DO: ADD TRANSACTION (ADD TO CART)
app.post('/manage-cart', async (req, res) => {
    const { userID, products } = req.body;

    try {
        // Fetch product details (type and description) from the database based on productID
        const updatedProducts = await Promise.all(products.map(async (product) => {
            const productDetails = await ProductDataModel.findById(product.productID);
            return {
                ...product,
                type: productDetails.type,
                description: productDetails.description
            };
        }));

        // Create a new cart document in the database
        const newCart = await CartModel.create({
            userID,
            products: updatedProducts
        });

        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error adding cart items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// ADD TRANSACTION (ADD TO CART)
app.post('/transactions', async (req, res) => {
    const { products, email, totalPrice, date, time } = req.body;

    try {
        // Create new transaction
        const newTransaction = await OrderDataModel.create({
            products,
            email,
            totalPrice,
            date,
            time
        });

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
