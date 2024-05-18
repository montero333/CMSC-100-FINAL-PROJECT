// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Project100', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Mongoose model for product data
const ProductModel = mongoose.model('Product', {
  id: String,
  name: String,
  type: String,
  price: Number,
  description: String,
  quantity: Number,
  imageUrl: String,
});

// Define a Mongoose model for user data
const UserModel = mongoose.model('User', {
  userId: String,
  firstName: String,
  lastName: String,
  UserName: String,
  UserType: String,
  email: String,
  password: String,
});

// Define a Mongoose model for transaction data
const TransactionModel = mongoose.model('Transaction', {
  transactionId: String,
  products: [
    {
      ProductId: String,
      quantity: Number,
    },
  ],
  status: Number,
  totalPrice: Number,
  userId: String,
  date: String,
  time: String,
});

// API endpoint for adding a new product
app.post('/api/products', async (req, res) => {
  const newProductData = req.body;

  try {
    const newProduct = new ProductModel(newProductData);
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for fetching all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for fetching email of users
app.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await UserModel.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ userEmail: user.email });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for fetching a product
app.get('/api/products/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    // Query the database to get product information based on the productId
    const product = await ProductModel.findOne({ id: productId });
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product information:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// API endpoint for fetching all user accounts
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for sign-in
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({
      $or: [
        { email: email },
        { UserName: email }
      ]
    });
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    } 

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Checks if the account is admin or customer
    if ((user.email === 'admin1@admin.uplb' || user.UserName === 'admin') && user.password === 'admin') {
      return res.status(200).json({ message: 'Sign-in successful', redirectTo: '/admin-dashboard' });
    } else {
      return res.status(200).json({ message: 'Sign-in successful', redirectTo: '/store' , userId: user.userId});
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for editing a product
app.put('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  const updatedProductData = req.body;
  
  try {
    // Find the product by ID and update its data
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id: String(productId) },
      updatedProductData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for checking the user using userID
app.get('/api/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for deleting a product
app.put('/api/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id: String(productId) },
      { $set: { quantity: 0 } },
      { new: true }
    );
    res.status(204).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for sign-up
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, UserName, email, password } = req.body;

  try {
    // Check if the user with the provided username exists
    const userByUserName = await UserModel.findOne({ UserName });
    if (userByUserName) {
      return res.status(401).json({ message: 'Username already taken. Please choose another one.' });
    }

    // Check if the user with the provided email exists
    const userByEmail = await UserModel.findOne({ email });
    if (userByEmail) {
      return res.status(401).json({ message: 'User already exists! Please sign-in instead' });
    }

    // Check if the password is at least 8 characters long
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      userId: uuidv4(),
      firstName,
      lastName,
      UserName,
      email,
      UserType: 'Customer', 
      password: hashedPassword,
    });

    console.log(newUser); // Log the newUser object
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', redirectTo: '/signin' });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for getting a transaction
app.patch('/api/transactions/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  try {
    // Update the transaction status and product statuses in the database using the transactionId
    const updatedTransaction = await TransactionModel.findOneAndUpdate(
      { transactionId },
      {
        $set: {
          status,
          'products.$[].status': status,
        },
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    // Send a success response
    res.status(200).json({ message: 'Transaction and related products cancelled successfully.' });
  } catch (error) {
    // Handle errors
    console.error('Error updating transaction status:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// API endpoint for checking out
app.post('/api/checkout', async (req, res) => {
  const { userId, cart } = req.body;
  const transactionId = uuidv4();

  try {
    const totalPrice = cart.reduce((total, item) => total + item.price * item.displayedQuantity, 0);

    const transaction = new TransactionModel({
      transactionId,
      products: cart.map(item => ({
        ProductId: item.id, 
        quantity: item.displayedQuantity,
      })),
      status: 0,
      totalPrice,
      userId,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });

    await transaction.save();

    res.status(200).json({ message: 'Checkout successful', transaction });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for getting all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await TransactionModel.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for updating a user
app.patch('/api/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedFields = req.body;

  try {
    // Check if the user with the updated username already exists
    const existingUser = await UserModel.findOne({ UserName: updatedFields.userName });
    if (existingUser && existingUser.userId !== userId) {
      return res.status(409).json({ message: 'Username already exists. Please choose another one.' });
    }

    // Check if the input is the same as the original
    const originalUser = await UserModel.findOne({ userId });
    if (originalUser.UserName === updatedFields.userName && originalUser.password === updatedFields.password){
      return res.status(410).json({ message: 'Please enter a new username or password' });
    }

    // Check if the updated password has a length of 8 characters
    if (updatedFields.password && updatedFields.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    // Hash the password if it is being updated
    const hashedPassword = updatedFields.password ? await bcrypt.hash(updatedFields.password, 10) : originalUser.password;

    const updatedUser = await UserModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          UserName: updatedFields.userName, 
          password: hashedPassword, 
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint for canceling transactions
app.patch('/api/transactions/cancel/:transactionId', async (req, res) => {
  const { transactionId } = req.params;

  try {
    // Update all transactions with the same transactionId to mark them as canceled
    const result = await TransactionModel.updateMany({ transactionId }, { status: 2 });

    if (result.nModified > 0) {
      // Send a success response if at least one transaction was updated
      res.status(200).json({ message: 'Transactions canceled successfully.' });
    } else {
      // Send a not found response if no transactions were found to cancel
      res.status(404).json({ message: 'No matching transactions found.' });
    }
  } catch (error) {
    console.error('Error canceling transactions:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// API endpoint for counting products, orders, and sales
app.get('/api/dashboard-counts', async (req, res) => {
  try {
    const productCount = await ProductModel.countDocuments();
    const userCount = await UserModel.countDocuments() - 1;

    // Count only pending orders (status: 0)
    const pendingOrderCount = await TransactionModel.countDocuments({ status: 0 });

    const totalSalesAggregate = await TransactionModel.aggregate([
      {
        $match: { status: 1 }, // Match only confirmed orders (status: 1)
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
        },
      },
    ]);

    const totalSales = totalSalesAggregate.length > 0 ? totalSalesAggregate[0].total : 0;

    const counts = {
      productCount,
      userCount,
      pendingOrderCount,
      totalSales,
    };

    res.status(200).json(counts);
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Helper function to check if two dates are in the same week
const isSameWeek = (date1, date2) => {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  const diff = Math.abs(firstDate - secondDate);
  const daysInWeek = 7;

  return Math.floor(diff / (1000 * 60 * 60 * 24)) < daysInWeek && firstDate.getDay() === secondDate.getDay();
};

// API endpoint for fetching weekly, monthly, and annual sales data
app.get('/api/sales/:duration', async (req, res) => {
  const duration = req.params.duration;
    
  try {
    const transactions = await TransactionModel.find();
    const currentDate = new Date();

    let filteredTransactions;

    switch (duration) {
      case 'weekly':
        filteredTransactions = transactions.filter(transaction =>
          isSameWeek(new Date(transaction.date), currentDate) && transaction.status === 1
        );
        break;
      case 'monthly': 
        filteredTransactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getFullYear() === currentDate.getFullYear() &&
            transactionDate.getMonth() === currentDate.getMonth() &&
            transaction.status === 1
          ); 
        });
        break;
      case 'annual': 
        filteredTransactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getFullYear() === currentDate.getFullYear() &&
            transaction.status === 1
          ); 
        });
        break;
      default:
        filteredTransactions = transactions.filter(transaction => transaction.status === 1);
        break;
    }

    res.status(200).json(filteredTransactions);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
