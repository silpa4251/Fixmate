const express = require("express");
const { getUserById, getStats } = require("../controller/adminController");
const adminAuth = require("../middlewares/adminAuth");
const adminRouter = express.Router();

adminRouter.use(adminAuth);

adminRouter.get("/stats", getStats);
adminRouter.get("/users/:id", getUserById);
// adminRouter.patch("/users/block/:id", blockUser);
// adminRouter.patch("/users/unblock/:id", unblockUser);

module.exports = adminRouter;