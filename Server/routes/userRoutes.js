const express = require("express");
const { booking, getUserById, getAllUsers, blockUser, unblockUser } = require("../controller/userController");
const userRouter = express.Router();


userRouter.get("/",getAllUsers);
userRouter.get("/:id",getUserById);
userRouter.patch("/block/:id",blockUser)
userRouter.patch("unblock/:id", unblockUser)
userRouter.post("/book", booking);

module.exports = userRouter;