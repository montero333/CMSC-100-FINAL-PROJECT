const express = require('express');
const router = express.Router();
const FormDataModel = require('../models/FormData'); // Ensure correct path to your model

// Route to add a product to the user's cart
router.post('/add-to-cart', async (req, res) => {
    const { userId, product } = req.body;
    try {
        const user = await FormDataModel.findOne({ userId });
        if (user) {
            user.userCart.push({
                productId: product._id,
                productName: product.productName,
                productPrice: product.productPrice
            });
            await user.save();
            res.status(200).send('Product added to cart');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error adding product to cart');
    }
});

module.exports = router;
