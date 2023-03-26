const {
  Types: { ObjectId },
} = require('mongoose');

const { validators } = require('../utils');
const Contacts = require('../models/contactsModel');
/*
 * Check new contact data.
 */
const checkContactData = async (req, res, next) => {
  try {
    const { err, value } = validators.modules.createContactValidator(req.body);

    if (err) {
      const error = new Error('Invalid user data.');

      error.status = 400;
      return next(error);
    }
    const { name } = value;

    const contactExist = await Contacts.exists({ name });

    if (contactExist) {
      const error = new Error('Contact with this name is already exists');
      error.status = 409;
      return next(error);
    }

    req.body = value;

    next();
  } catch (err) {
    next(err);
  }
};
/*
 * Check contact id.
 */
const checkContactId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      const error = new Error('Invalid ID parameter.');
      error.status = 400;
      return next(error);
    }

    const contactExists = await Contacts.exists({ _id: id });

    if (!contactExists) {
      const error = new Error('Not Found');
      error.status = 404;
      return next(error);
    }
    next();
  } catch (err) {
    next(err);
  }
};

const checkFavoriteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      favorite,
    } = req.body;
    if (!name || !email || !phone || !favorite) {
      const error = new Error('Missing field favorite');
      error.status = 400;
      return next(error);
    }
    const contactUpdate = await Contacts.exists({ id, favorite });

    if (!contactUpdate) {
      const error = new Error('Not found');
      error.status = 404;
      return next(error);
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkContactData,
  checkContactId,
  checkFavoriteContact,
};
