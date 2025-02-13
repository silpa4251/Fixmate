const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const providerRoutes = require("./routes/providerRoutes");
const mapRoute = require("./routes/mapRoute");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const ratingRoutes = require("./routes/ratingRoutes");


// Middlewares for parsing request body
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
  }));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// User routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers",providerRoutes);
app.use("/api/map", mapRoute);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin",adminRoutes);
app.use('/api/ratings', ratingRoutes);


// Middleware for gobal error handling
app.use(errorHandler);

module.exports = app;
