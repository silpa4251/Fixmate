const express = require("express");
const { getUserById, getAllUsers, blockUser, unblockUser, makePayment, paymentverify } = require("../controller/userController");
const userRouter = express.Router();

userRouter.post("/make-payment", makePayment);
userRouter.post("/verify-payment", paymentverify);
userRouter.get("/",getAllUsers);
userRouter.get("/:id",getUserById);
userRouter.patch("/block/:id",blockUser)
userRouter.patch("unblock/:id", unblockUser)



module.exports = userRouter;