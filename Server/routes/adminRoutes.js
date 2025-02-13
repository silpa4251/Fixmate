const express = require("express");
const { 
  getUserById, 
  getStats, 
  getBookingByUser 
} = require("../controller/adminController");
const adminAuth = require("../middlewares/adminAuth");
const { 
  getAllBookings, 
  createBooking, 
  deleteBooking, 
  editBooking 
} = require("../controller/bookingController");
const { 
  blockUser, 
  unblockUser, 
  createUser, 
  updateUser, 
  getAllUsers 
} = require("../controller/userController");
const { 
  getBookingByProvider, 
  createProvider, 
  updateProvider, 
  blockProvider, 
  unblockProvider 
} = require("../controller/providerController");

const adminRouter = express.Router();

// Apply admin authentication middleware to all routes
adminRouter.use(adminAuth);

// Stats routes
adminRouter.get("/stats", getStats);

// Booking routes
adminRouter.get("/bookings", getAllBookings);
adminRouter.post("/bookings", createBooking);
adminRouter.patch("/bookings/:bookingId", deleteBooking);
adminRouter.patch("/bookings/:bookingId/edit", editBooking);
adminRouter.get("/bookings/user/:userId", getBookingByUser);
adminRouter.get("/bookings/provider/:id", getBookingByProvider);

// User routes
adminRouter.get("/users", getAllUsers);
adminRouter.post("/users", createUser);
adminRouter.get("/users/:id", getUserById);
adminRouter.patch("/users/:id", updateUser);
adminRouter.patch("/block-user/:userId", blockUser);
adminRouter.patch("/unblock-user/:userId", unblockUser);

// Provider routes
adminRouter.post("/providers", createProvider);
adminRouter.patch("/providers/:id", updateProvider);
adminRouter.patch("/block-provider/:id", blockProvider);
adminRouter.patch("/unblock-provider/:id", unblockProvider);

module.exports = adminRouter;