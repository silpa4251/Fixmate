const express = require("express");
const { login, registerUser, registerProvider } = require("../controller/authController");
const authRouter = express.Router();

authRouter.post("/register/user", registerUser);
authRouter.post("/register/provider", registerProvider);
authRouter.post("/login", login);

module.exports = authRouter;
