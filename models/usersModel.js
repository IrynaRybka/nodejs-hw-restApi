const { model, Schema } = require('mongoose');

const bcrypt = require('bcrypt');

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter'
  },
  token: {
    type: String,
    default: null,
  }
});
// Mongoose pre-save hook. Passwords auto-hashing
// eslint-disable-next-line func-names
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

const User = model('user', userSchema);

module.exports = User;
