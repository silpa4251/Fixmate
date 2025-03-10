const express = require("express");
const { getNearbyProviders, searchService, getProviderById, getAllProviders, getProviderProfile, updateProfile, uploadProfilePicture, uploadCertificate, getProviderStats, searchProvider, getBookingsByMonth, getEarningsByMonth, getTodaysBookings } = require("../controller/providerController");
const { uploadToS3, upload}= require("../middlewares/multer");
const providerAuth = require("../middlewares/providerAuth");
const { getProviderBookings } = require("../controller/bookingController");
const providerRouter = express.Router();

providerRouter.get("/",getAllProviders);
providerRouter.get("/nearby", getNearbyProviders);
providerRouter.get("/search", searchProvider);

providerRouter.get("/today-bookings", providerAuth, getTodaysBookings);
providerRouter.get("/stats", providerAuth, getProviderStats);
providerRouter.get("/monthly-bookings", providerAuth, getBookingsByMonth);
providerRouter.get("/monthly-earnings", providerAuth, getEarningsByMonth);
providerRouter.get("/profile",providerAuth, getProviderProfile);
providerRouter.put("/profile",providerAuth, updateProfile);
providerRouter.post("/upload-image",providerAuth, upload.single('image'), uploadProfilePicture);
providerRouter.post('/upload-certificate',providerAuth, upload.single('certificate'), uploadCertificate);
providerRouter.get("/bookings",providerAuth, getProviderBookings);
// providerRouter.get("/slots", availableSlots);
providerRouter.get("/:id", getProviderById);


module.exports = providerRouter;
