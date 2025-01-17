const express = require("express");
const { login, registerUser, registerProvider, googleAuth } = require("../controller/authController");
const upload = require("../middlewares/multer");
const authRouter = express.Router();

authRouter.post("/register/user", registerUser);
authRouter.post("/register/provider",upload.array("certifications",5), registerProvider);
authRouter.post("/login", login);
authRouter.post("/googleauth",googleAuth);

module.exports = authRouter;
