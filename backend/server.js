const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('colors'); // For colored console logs
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

app.use(cors());
app.use(express.json());

//MongoDB connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('✅ MongoDB connected'.green);
}).catch(err => {
  console.error('❌ MongoDB error:'.red, err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`.blue);
});