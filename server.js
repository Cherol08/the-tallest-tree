const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const userRoutes = require('./routes/users') 

// init app
const app = express();

const PORT = process.env.PORT || 3500;

//cors
app.use(express.json())
app.use(cors());


//coonect to mongo
const DATABASE_URI = process.env.DATABASE_URI;

// use middleware to connect to application
app.use('/users', userRoutes);


mongoose.connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
.catch((error) => console.log(error.message));

