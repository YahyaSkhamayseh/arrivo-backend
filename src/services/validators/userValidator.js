const Joi = require("joi");

// Validate user data using Joi schema
function validateUser(user, isPartialUpdate = false) {
  let schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),
    membership: Joi.string().valid("Premium", "Normal").required(),
  });

  if (isPartialUpdate) {
    schema = Joi.object().keys({
      username: Joi.string().optional(),
      password: Joi.string().optional(),
      email: Joi.string().email().optional(),
      fullName: Joi.string().optional(),
      membership: Joi.string().valid("Premium", "Normal").optional(),
    });
  }

  return schema.validate(user);
}

module.exports = { validateUser };
