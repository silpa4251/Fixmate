const express = require("express");
const { newBooking, getUserBookings, getProviderBookings, updateBookingStatus, availableSlots } = require("../controller/bookingController");
const auth = require("../middlewares/auth");
const bookingRouter = express.Router();


bookingRouter.post("/",auth, newBooking);
bookingRouter.get("/available-slots",availableSlots)
bookingRouter.get("/user",auth, getUserBookings);
bookingRouter.get("/provider",auth, getProviderBookings);
bookingRouter.patch("/:id",auth,updateBookingStatus);

module.exports = bookingRouter;