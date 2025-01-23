const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const authRoutes = require("./routes/authRoutes");


// Middlewares for parsing request body
app.use(cors({
    origin: 'http://localhost:5173'
  }));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// User routes
app.use("/api/auth", authRoutes);


// Middleware for gobal error handling
app.use(errorHandler);

module.exports = app;
