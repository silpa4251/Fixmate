const {registerValidation,loginValidation,} = require("../validations/userValidations");
const { registerUser, loginUser} = require("../services/authService");
const asyncErrorHandler = require("../utils/asyncErrorHandler")
const CustomError = require("../utils/customError");

// Registering a new user
const register = asyncErrorHandler(async (req, res) => {
  const { error } = registerValidation(req.body)
  if (error) throw new CustomError(error.details[0].message, 400);

  const result = await registerUser(req.body);
  res.status(201).json({ status: "success", result})
});


//Login a user
const login = asyncErrorHandler(async (req, res) => {
  const {error} = loginValidation(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);

  const result = await loginUser(req.body);
  res.status(200).json({ status: "success",result})
});

module.exports = { register, login };
