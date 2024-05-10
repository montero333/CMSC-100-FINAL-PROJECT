const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const userModel = require('./models/userModel');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/FinalProject100'; // Change this to your MongoDB URI
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful connection to MongoDB
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const User = require('./models/userModel');
  
  const SECRET_KEY = 'super-secret-key';
  
  // connect to express app
  const app = express();
  
  // connect to mongoDB
  const dbURI = 'mongodb://localhost:27017/FinalProject100';
  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      app.listen(3001, () => {
        console.log('Server connected to port 3001 and MongoDb');
      });
    })
    .catch((error) => {
      console.log('Unable to connect to Server and/or MongoDB', error);
    });
  
  // middleware
  app.use(bodyParser.json());
  app.use(cors());
  
  // Routes
  
  // REGISTER
  // POST REGISTER
  app.post('/register', async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, username, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).json({ error: 'Error signing up' });
    }
  });
  
  // LOGIN
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  });
  
  // GET Registered Users
  app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Unable to get users' });
    }
  });
  
  // Handle undefined routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
  
  // Error handler middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  });
  

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Example route to create a new user
app.post('/users', async (req, res) => {
  try {
    const { firstName, middleName, lastName, userType, email, password } = req.body;
    
    // Check if all required fields are provided
    if (!firstName || !lastName || !userType || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if userType is valid
    if (userType !== 'customer' && userType !== 'admin') {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new userModel({
      firstName,
      middleName,
      lastName,
      userType,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET Registered Users
app.get('/users', async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});
