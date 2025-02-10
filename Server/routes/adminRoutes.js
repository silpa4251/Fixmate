const express = require("express");
const { getUserById, getStats, getBookingByUser } = require("../controller/adminController");
const adminAuth = require("../middlewares/adminAuth");
const { getAllBookings } = require("../controller/bookingController");
const { blockUser, unblockUser, createUser, updateUser, getAllUsers } = require("../controller/userController");
const { getBookingByProvider, createProvider, updateProvider, blockProvider, unblockProvider } = require("../controller/providerController");
const adminRouter = express.Router();

adminRouter.use(adminAuth);

adminRouter.get("/stats", getStats);
adminRouter.get("/bookings", getAllBookings);
adminRouter.get("/bookings/user/:userId", getBookingByUser);
adminRouter.get("/users", getAllUsers);
adminRouter.post("/users", createUser);
adminRouter.get("/users/:id", getUserById);
adminRouter.patch("/users/:id", updateUser);
adminRouter.patch("/block-user/:userId", blockUser);
adminRouter.patch("/unblock-user/:userId", unblockUser);

adminRouter.get("/bookings/provider/:id", getBookingByProvider);
adminRouter.post("/providers", createProvider);
adminRouter.patch("/providers/:id", updateProvider);
adminRouter.patch("/block-provider/:id", blockProvider);
adminRouter.patch("/unblock-provider/:id", unblockProvider);

module.exports = adminRouter;