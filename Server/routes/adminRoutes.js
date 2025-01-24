const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const { getUserById, getStats } = require("../controller/adminController");
const adminRouter = express.Router();

adminRouter.use(auth);
adminRouter.use(authorize("Admin"));

adminRouter.get("/stats", getStats);
adminRouter.get("/users/:id", getUserById);
// adminRouter.patch("/users/block/:id", blockUser);
// adminRouter.patch("/users/unblock/:id", unblockUser);

module.exports = adminRouter;