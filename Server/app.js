const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const providerRoutes = require("./routes/providerRoutes");
const mapRoute = require("./routes/mapRoute");


// Middlewares for parsing request body
app.use(cors({
    origin: 'http://localhost:5173'
  }));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// User routes
app.use("/api/auth", authRoutes);
app.use("/api/providers",providerRoutes);
app.use("/api/map", mapRoute);

app.use("/api/admin",adminRoutes);


// Middleware for gobal error handling
app.use(errorHandler);

module.exports = app;
