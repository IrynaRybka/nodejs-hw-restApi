const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const contactsRouter = require('./routes/api/contactsRoutes');
const authRouter = require('./routes/api/authRoutes');

const app = express();

const formatsLogger = dotenv.config({ path: './.env' });

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
// serve static files
app.use(express.static('public'));

// MONGO DB
mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/db-contacts')
  .then((connection) => {
    if (connection) {
      console.log('Database connection successful');
    } else {
      console.log('Error conection');
    }
  });

// routes
app.use('/api/contacts', contactsRouter);
app.use('/api/auth/users', authRouter);
/**
 * Handle "not found" requests
 */
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

/**
 * Global error handler (middleware with 4 params)
 */
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message, stack: err.stack, });
  next();
});

module.exports = app;
