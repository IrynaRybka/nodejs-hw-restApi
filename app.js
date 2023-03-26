const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const contactsRouter = require('./routes/api/contactsRoutes');

const app = express();

const formatsLogger = dotenv.config({ path: './.env' });
// const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// MONGO DB
mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/db-contacts')
  .then((connection) => {
    if (connection) {
      console.log('Database connection successful');
    } else {
      mongoose.connection.on('error', console.error.bind(console, 'Error conection'));
    }
  });

// routes
app.use('/api/contacts', contactsRouter);
// app.use('/api/contacts/:id', contactsRouter);
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
  res.status(500).json({ message: err.message });
  next();
});

module.exports = app;
