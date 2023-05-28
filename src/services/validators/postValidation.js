const Joi = require("joi");

function validatePost(post, partial = false) {
  let schema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    category_id: Joi.number().integer().required(),
    status: Joi.string().valid("Draft", "Published", "Pending Review").required(),
    label: Joi.string().valid("Normal", "Premium").required(),
  });

  if (partial) {
    schema = Joi.object({
      title: Joi.string(),
      body: Joi.string(),
      category_id: Joi.number().integer(),
      status: Joi.string().valid("Draft", "Published", "Pending Review"),
      label: Joi.string().valid("Normal", "Premium"),
    });
  }

  return schema.validate(post);
}

module.exports = { validatePost };
