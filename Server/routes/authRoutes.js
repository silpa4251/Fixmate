const express = require("express");
const { registerUser, registerProvider, forgotPassword, resetPassword, contact, userLogin, providerLogin, providerGoogleAuth, refreshToken, userGoogleAuth, logout } = require("../controller/authController");
const { adminLogin } = require("../controller/adminController");
const authRouter = express.Router();

authRouter.post("/register/user", registerUser);
authRouter.post("/register/provider", registerProvider);
authRouter.post("/login/user", userLogin);
authRouter.post("/login/provider", providerLogin);
authRouter.post("/login/admin", adminLogin);
authRouter.post("/googleauth",userGoogleAuth);
authRouter.post("/googleauth/provider",providerGoogleAuth);
authRouter.post("/log-out", logout);
authRouter.post("/refresh", refreshToken);
authRouter.post("/forgot-password",forgotPassword);
authRouter.post("/reset-password/:token",resetPassword);
authRouter.post("/contact",contact);

module.exports = authRouter;
