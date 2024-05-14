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
// Backend code (index.js or your main server file)

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
                        res.json({ message: "Success", userType: user.userType });
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
app.post('/cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Find the product by productId to get its details
        const product = await ProductDataModel.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Calculate total price
        const totalPrice = product.productPrice * quantity;

        // Create a new transaction/order
        const newTransaction = await TransactionModel.create({
            transactionId: uuidv4(),
            products: [{ productID: productId, quantity, productPrice: product.productPrice }],
            status: 0, // Assuming status is pending
            totalPrice,
            email: userId, // Assuming userId is the email of the user
            date: new Date().toISOString().slice(0, 10), // Current date
            time: new Date().toLocaleTimeString() // Current time
        });

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
