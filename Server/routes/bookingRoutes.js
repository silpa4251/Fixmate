const express = require("express");
const { newBooking, getUserBookings, getProviderBookings, updateBookingStatus, availableSlots, rescheduleBookings, bookingById } = require("../controller/bookingController");
const auth = require("../middlewares/auth");
const bookingRouter = express.Router();


bookingRouter.get("/user", auth, getUserBookings);
bookingRouter.get("/provider", auth, getProviderBookings);
bookingRouter.get("/available-slots", auth, availableSlots);
bookingRouter.get("/:bookingId", auth, bookingById);

bookingRouter.post("/", auth, newBooking);
bookingRouter.patch("/:id/status", auth, updateBookingStatus);
bookingRouter.patch("/:bookingId/reschedule", auth, rescheduleBookings);

module.exports = bookingRouter;