const express = require("express");
const { getUserById, getAllUsers, blockUser, unblockUser } = require("../controller/userController");
const userRouter = express.Router();


userRouter.get("/",getAllUsers);
userRouter.get("/:id",getUserById);
userRouter.patch("/block/:id",blockUser)
userRouter.patch("unblock/:id", unblockUser)


module.exports = userRouter;