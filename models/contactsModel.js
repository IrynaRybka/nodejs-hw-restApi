const { model, Schema, Types: { ObjectId } } = require('mongoose');

const contactSchema = new Schema({
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
  },
  owner: {
    type: ObjectId,
    ref: 'user',
  },
});

const Contact = model('Contact', contactSchema);

module.exports = Contact;
