const express = require("express");
const { makePayment, paymentverify, getProfile, updateProfile } = require("../controller/userController");
const userRouter = express.Router();
const upload = require("../middlewares/multer");
const userAuth = require("../middlewares/userAuth");

userRouter.use(userAuth);

userRouter.post("/make-payment", makePayment);
userRouter.post("/verify-payment", paymentverify);
userRouter.get("/profile", getProfile);
userRouter.put("/profile", upload.single('profileImage'), updateProfile);
// userRouter.get("/",getAllUsers);
// userRouter.get("/:id",getUserById);
// userRouter.patch("/block/:id",blockUser)
// userRouter.patch("unblock/:id", unblockUser)



module.exports = userRouter;