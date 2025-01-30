const express = require("express");
const { registerUser, registerProvider, googleAuth, forgotPassword, resetPassword, contact, userLogin, providerLogin, providerGoogleAuth, refreshToken } = require("../controller/authController");
const upload = require("../middlewares/multer");
const authRouter = express.Router();

authRouter.post("/register/user", registerUser);
authRouter.post("/register/provider",upload.array("certifications",5), registerProvider);
authRouter.post("/login/user", userLogin);
authRouter.post("/login/provider", providerLogin);
authRouter.post("/googleauth",googleAuth);
authRouter.post("/googleauth/provider",providerGoogleAuth);
authRouter.post("/refresh", refreshToken);
authRouter.post("/forgot-password",forgotPassword);
authRouter.post("/reset-password/:token",resetPassword);
authRouter.post("/contact",contact);

module.exports = authRouter;
