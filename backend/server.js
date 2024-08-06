const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongoose=require("mongoose")
const User = require('./models/user');

const PORT = process.env.PORT || 3000;

const MONGODB_URI = 'mongodb+srv://anavik:AnaviKalvium123@cluster0.uutcmdf.mongodb.net/StoneFind?retryWrites=true&w=majority&appName=Cluster0';

// Middleware to parse JSON bodies
app.use(express.json());

async function Connect(){
     try{
       await mongoose.connect(MONGODB_URI)
       console.log("Connected to DB")
     }catch(err){
        console.log(err)
     }
}

// GET endpoint
app.get('/', (req, res) => {
  res.json({ message: 'This is a GET request' });
});

// POST endpoint
app.post('/data', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: 'User created successfully', data: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// PUT endpoint
app.put('/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'This is a PUT request', data: data });
});

Connect().then(()=>{

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

})
