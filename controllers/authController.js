const jwt = require('jsonwebtoken');

const User = require('../models/usersModel');

// login jwt helper function
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES,
});

// Register user
const userRegister = async (req, res) => {
  try {
    const newUserData = { ...req.body };
    const newUser = await User.create(newUserData);

    newUser.password = undefined;
    const token = signToken(newUser.id);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
      token
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Email or password is wrong');
      return res.status(401).json({ error });
    }

    const passwordIsValid = await user.checkPassword(password, user.password);

    if (!passwordIsValid) {
      const error = new Error('Email or password is wrong');
      return res.status(401).json({ error });
    }

    user.password = undefined;

    const token = signToken(user.id);

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// LogOut user
const logOutUser = async (req, res) => {
  try {
    const { _id: id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      const error = new Error('Not authorized');
      return res.status(401).json({ error });
    }

    await User.findByIdAndUpdate(id, { token: '' });
    res.status(204).json();
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// Take current data user
const currentDataUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json({ email: user.email, subscription: user.subscription });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  userRegister,
  loginUser,
  logOutUser,
  currentDataUser,
};
