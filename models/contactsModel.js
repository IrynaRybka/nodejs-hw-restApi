const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    require: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
