const jwt = require('jsonwebtoken');

const User = require('../models/usersModel');
const { validators } = require('../utils');
const ImageService = require('../services/imageService');

const checkRegisterData = async (req, res, next) => {
  try {
    const { err, value } = validators.modules.registerUserValidator(req.body);

    if (err) {
      const error = new Error(err.details[0].message);
      error.status = 400;
      return next(error);
    }
    const { email } = value;

    const userExists = await User.exists({ email });

    if (userExists) {
      const error = new Error('Email in use');
      error.status = 409;
      return next(error);
    }

    req.body = value;

    next();
  } catch (err) {
    next(err);
  }
};
/**
 * allow only login users.
 */
const checkLoginUser = async (req, res, next) => {
  try {
    // eslint-disable-next-line max-len
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
      const error = new Error('Not authorized');
      error.status = 401;
      return next(error);
    }
    // Use async version of token verification
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id decoded from token
    const currentUser = await User.findById(decodedToken.id);

    if (!currentUser) {
      const error = new Error('You are not logged in');
      error.status = 401;
      return next(error);
    }

    req.user = currentUser;

    next();
  } catch (err) {
    next(err);
  }
};

const allowFor = (...subscription) => (req, res, next) => {
  if (subscription.includes(req.user.subscription)) return next();

  const error = new Error('You are not allowed to perform this action');
  error.status = 403;
  return next(error);
};

// add avatar when user registrating
const uploadUserPhoto = ImageService.upload('avatarURL');

module.exports = {
  checkRegisterData,
  checkLoginUser,
  allowFor,
  uploadUserPhoto,
};
