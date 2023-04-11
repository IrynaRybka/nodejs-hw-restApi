const { model, Schema } = require('mongoose');

const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
  },
  avatarURL: {
    type: String,
    default: 'public/avatars/garfield.png'
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
});
// Mongoose pre-save hook. Passwords auto-hashing
// eslint-disable-next-line func-names
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    // generate hash email to random avatar
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=monsterid`;
  }
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

const User = model('user', userSchema);

module.exports = User;
