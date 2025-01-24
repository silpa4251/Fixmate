const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");


// Middlewares for parsing request body
app.use(cors({
    origin: 'http://localhost:5173'
  }));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// User routes
app.use("/api/auth", authRoutes);

app.use("/api/admin",adminRoutes);


// Middleware for gobal error handling
app.use(errorHandler);

module.exports = app;
