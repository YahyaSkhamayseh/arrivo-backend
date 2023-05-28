const Joi = require("joi");

function validatePayment(payment, partial = false) {
  let schema = Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    paymentMethod: Joi.string().required(),
    status: Joi.string().valid("Pending", "Completed", "Cancelled").required(),
  });

  if (partial) {
    schema = Joi.object({
      amount: Joi.number().positive().precision(2),
      paymentMethod: Joi.string(),
      status: Joi.string().valid("Pending", "Completed", "Cancelled"),
    });
  }

  return schema.validate(payment);
}

module.exports = { validatePayment };
