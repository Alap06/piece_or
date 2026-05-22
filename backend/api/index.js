require('dotenv').config();
const app = require('../app');
const connectDB = require('../config/db');

// Connect to DB once when the serverless function cold starts
connectDB();

module.exports = app;
