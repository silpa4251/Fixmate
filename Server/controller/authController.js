const { registerValidation, loginValidation, ProviderValidation } = require("../validations/userValidations");
const { userRegisteration, providerRegisteration, forgotPasswordService, resetPasswordService, contactService, userLoginService, providerLoginService, providerGoogleAuthService, refreshTokenService, userGoogleAuthService } = require("../services/authService");
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
  if (typeof req.body.address === "string") {
    try {
      req.body.address = JSON.parse(req.body.address);
    } catch (error) {
      throw new CustomError("Invalid address format", 400);
    }
  }
  const { error } = ProviderValidation(req.body)
  if (error) throw new CustomError(error.details[0].message, 400);
  const data = await providerRegisteration(req.body);
  res.status(201).json({ status: "success", data})
});

//Login a user
const userLogin = asyncErrorHandler(async (req, res) => {
  const {error} = loginValidation(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);

  const data = await userLoginService(req.body);
  res.cookie('refreshToken', data.refreshToken, {
    httpOnly: true,      
    secure: true,          
    sameSite: 'Strict',   
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ status: "success", data})
});

const providerLogin = asyncErrorHandler(async (req, res) => {
  const {error} = loginValidation(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);

  const data = await providerLoginService(req.body);
  res.cookie('refreshToken', data.refreshToken, {
    httpOnly: true,      
    secure: true,          
    sameSite: 'Strict',   
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ status: "success", data})
});

const userGoogleAuth = asyncErrorHandler(async (req,res) => {
    const body = req.body;
     const data = await userGoogleAuthService(body);
    
    res.status(200).json({
      status: "success",
      message: "user authenticated with Google successfully",
      token: data.token,
      user: data.user,
  
  });
});

const providerGoogleAuth = asyncErrorHandler(async (req,res) => {
  const body = req.body;
   const data = await providerGoogleAuthService(body);
  
  res.status(200).json({
    status: "success",
    message: "provider authenticated with Google successfully",
    token: data.token,
    provider: data.provider,

});
});

const refreshToken = asyncErrorHandler(async(req,res) =>{
  const token = req.cookies.refreshToken;
  const data = await refreshTokenService(token);
  res.cookie('refreshToken', data.refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ status: "success", data})

})

const forgotPassword = asyncErrorHandler(async(req, res) =>{
  const data =  await forgotPasswordService(req.body);
  res.status(200).json({ status: "success", data})

})

const resetPassword = asyncErrorHandler(async(req,res) => {
  const result = await resetPasswordService(req.body,req.params);
  res.status(200).json({ status: "success", result})
})

const contact = asyncErrorHandler(async(req,res) => {
  const result = await contactService(req.body);
  res.status(200).json({ status: "success", result})
})
  

module.exports = { registerUser, registerProvider, userLogin, providerLogin, userGoogleAuth,providerGoogleAuth,refreshToken, forgotPassword, resetPassword, contact };
