const Joi = require("joi");

// Register data validator
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4),
    role: Joi.string(),
  });

  return schema.validate(data);
};

const ProviderValidation = (data) => {
  const schema = Joi.object({ 
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4),
    services: Joi.required(),
    address: Joi.array()
    .items(
      Joi.object({
        place: Joi.string().required(),
        district: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required(),
        coordinates: Joi.object({
          type: Joi.string().valid("Point").required(),
          coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }).optional(),
      })
    )
    .required(),
    // location:Joi.string().required(),
    // certifications: Joi.required(),
    role: Joi.string(),
  });

  return schema.validate(data);
};

// Login user validator
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  });

  return schema.validate(data);
};

module.exports = { registerValidation,ProviderValidation, loginValidation };
