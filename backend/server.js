const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post'); 

const PORT = process.env.PORT || 3000;

const MONGODB_URI = 'mongodb+srv://anavik:AnaviKalvium123@cluster0.uutcmdf.mongodb.net/StoneFind?retryWrites=true&w=majority&appName=Cluster0';

// Middleware to parse JSON bodies
app.use(express.json());

async function Connect() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB database!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}

// Routes

// GET endpoint to retrieve all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ message: 'Users retrieved successfully', data: users });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
});

// GET endpoint to retrieve a specific user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('posts'); // Populate posts
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
});

// POST endpoint to create a new user
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// PUT endpoint to update an existing user
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

// DELETE endpoint to delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', data: deletedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

// POST endpoint to create a new post
app.post('/posts', async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    // Create the post
    const newPost = new Post({ title, content, user: userId });
    await newPost.save();

    // Update the user with the new post
    const user = await User.findById(userId);
    user.posts.push(newPost._id);
    await user.save();

    res.status(201).json({ message: 'Post created successfully', data: newPost });
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
});

// GET endpoint to retrieve all posts for a specific user
app.get('/users/:id/posts', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('posts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Posts retrieved successfully', data: user.posts });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving posts', error: err.message });
  }
});

Connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});