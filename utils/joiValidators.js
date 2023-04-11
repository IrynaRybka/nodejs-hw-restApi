const Joi = require('joi');

const REGULAR_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{6,50})/;

const REGULAR_PHONE = /^\+?([0-9]{1,3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
/**
 * Validate create contact data.
 */
const createContactValidator = (data) => Joi.object()
  .options({ abortEarly: false }).keys({
    name: Joi.string().min(1).max(20),
    email: Joi.string(),
    phone: Joi.string()
      .pattern(REGULAR_PHONE)
      .required(),
    favorite: Joi.boolean().default(false),
  }).validate(data);

/**
 * Validate register user data.
 */
const registerUserValidator = (data) => Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(REGULAR_PASSWORD).required(),
    subscription: Joi.string().default('starter'),
    // token: Joi.string().default('null'),
  })
  .validate(data);

/**
 * Login validator
 */
const loginValidator = (data) => Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  })
  .validate(data);

// validate email
const verifyEmailSchema = Joi.object({
  email: Joi.string().required(),
});

exports.modules = {
  createContactValidator,
  registerUserValidator,
  loginValidator,
  verifyEmailSchema,
};
