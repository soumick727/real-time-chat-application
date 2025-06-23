const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();
require('colors'); // For colored console logs
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const chatRoutes = require('./routes/chatRoute');
dotenv.config({path: './config.env'});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes for authentication
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);


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