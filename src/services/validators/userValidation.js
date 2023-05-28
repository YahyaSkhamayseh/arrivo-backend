const Joi = require("joi");

// Validate user data using Joi schema
function validateUser(user, isPartialUpdate = false) {
  let schema = Joi.object({
    username: Joi.string().required().min(3).max(255),
    password: Joi.string().required().min(6).max(255),
    email: Joi.string().required().email().max(255),
    full_name: Joi.string().required().min(1).max(255),
    membership: Joi.string().valid("Premium", "Normal").required(),
    is_admin: Joi.boolean().default(false),
  });

  if (isPartialUpdate) {
    schema = Joi.object().keys({
      username: Joi.string().min(3).max(255),
      password: Joi.string().min(6).max(255),
      email: Joi.string().email().max(255),
      full_name: Joi.string().min(1).max(255),
      membership: Joi.string().valid("Premium", "Normal"),
      is_admin: Joi.boolean(),
    });
  }

  return schema.validate(user);
}

module.exports = { validateUser };
