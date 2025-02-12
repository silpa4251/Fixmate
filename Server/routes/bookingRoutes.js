const express = require("express");
const { newBooking, getUserBookings, getProviderBookings, updateBookingStatus, availableSlots, rescheduleBookings, bookingById, getProviderBookedDates, checkAvailability } = require("../controller/bookingController");
const userAuth = require("../middlewares/userAuth");
const bookingRouter = express.Router();

bookingRouter.use(userAuth);

bookingRouter.get("/user", getUserBookings);
bookingRouter.get("/provider", getProviderBookings);
// bookingRouter.get("/available-slots", availableSlots);
bookingRouter.get('/check-availability', checkAvailability);
bookingRouter.get('/provider/:providerId/booked-dates', getProviderBookedDates);
bookingRouter.post("/", newBooking);
bookingRouter.patch("/:id/status", updateBookingStatus);
bookingRouter.get("/:bookingId", bookingById);
bookingRouter.patch("/:bookingId/reschedule", rescheduleBookings);

module.exports = bookingRouter;