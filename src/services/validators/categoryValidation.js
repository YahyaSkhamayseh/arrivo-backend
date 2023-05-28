const Joi = require("joi");

function validateCategory(category, partial = false) {
  let schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    activated: Joi.boolean(),
  });

  if (partial) {
    schema = Joi.object({
      name: Joi.string(),
      description: Joi.string().allow(""),
      activated: Joi.boolean(),
    });
  }

  return schema.validate(category);
}

module.exports = { validateCategory };
