const Joi = require('joi');
/**
 * Validate create user data.
 */
const createContactValidator = (data) => Joi.object.keys({
  name: Joi.string().min(1).max(20),
  email: Joi.string(),
  phone: Joi.string()
    .pattern(/^\+?([0-9]{1,3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    .required(),
  favorite: Joi.boolean(),
}).validate(data);

exports.modules = {
  createContactValidator,
};
