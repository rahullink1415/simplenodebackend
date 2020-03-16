const Joi = require("@hapi/joi");
exports.registerSchema = (req, res, next) => {
  const register = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  });
  const { error } = register.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

exports.loginSchema = (req, res, next) => {
  const register = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  });
  const { error } = register.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};
