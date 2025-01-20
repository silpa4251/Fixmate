const { registerValidation, loginValidation } = require("../validations/userValidations");
const { userRegisteration, providerRegisteration, userLogin, googleAuthService } = require("../services/authService");
const asyncErrorHandler = require("../utils/asyncErrorHandler")
const CustomError = require("../utils/customError");

// Registering a new user
const registerUser = asyncErrorHandler(async (req, res) => {
  const { error } = registerValidation(req.body)
  if (error) throw new CustomError(error.details[0].message, 400);

  const data = await userRegisteration(req.body);
  res.status(201).json({ status: "success", data})
});

// Registering a new provider
const registerProvider = asyncErrorHandler(async (req, res) => {
  const { error } = registerValidation(req.body)
  if (error) throw new CustomError(error.details[0].message, 400);
  console.log("Files:", req.files); // Logs uploaded files
  console.log("Body:", req.body); 
  const data = await providerRegisteration(req.body,req.files);
  res.status(201).json({ status: "success", data})
});

//Login a user
const login = asyncErrorHandler(async (req, res) => {
  const {error} = loginValidation(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);

  const data = await userLogin(req.body);
  res.status(200).json({ status: "success", data})
});

const googleAuth = asyncErrorHandler(async (req,res) => {

    const body = req.body;
     const data = await googleAuthService(body);
    
    res.status(200).json({
      status: "success",
      message: `${role} authenticated with Google successfully`,
      token: data.token,
      user: data.user,
  
  });
});
  

module.exports = { registerUser, registerProvider, login, googleAuth };
