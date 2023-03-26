// const fs = require('fs').promises;
const {
  Types: { ObjectId },
} = require('mongoose');

const { validators } = require('../utils');
const Contacts = require('../models/contactsModel');
/*
 * Check new contact data.
 */
const checkContactData = async (req, res, next) => {
  const { err, value } = validators.modules.createContactValidator(req.body);

  if (err) {
    const error = new Error('Invalid user data.');

    error.status = 400;
    return next(error);
  }
  const { name } = value;

  const contactExist = await Contacts.exists({ name });

  if (contactExist) {
    return next(new Error(409, 'Contact with this name is already exist'));
  }

  req.body = value;

  next();
};
/*
 * Check contact id.
 */
const checkContactId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return next(new Error(400, 'Invalid ID parameter.'));
    }

    const contactExists = await Contacts.exists({ _id: id });

    if (!contactExists) {
      return next(new Error(404, 'Not Found'));
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
      return next(new Error(400, 'missing field favorite'));
    }
    const contactUpdate = await Contacts.exists({ id, favorite });

    if (!contactUpdate) {
      return next(new Error(404, 'Not found'));
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
