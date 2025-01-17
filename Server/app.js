const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const authRoutes = require("./routes/authRoutes");
const asyncErrorHandler = require("./utils/asyncErrorHandler");
// const productRoutes = require("./routes/productRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const wishlistRoutes = require("./routes/wishlistRoutes");
// const profileRoutes = require("./routes/profileRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// Middlewares for parsing request body
app.use(cors({
    origin: 'http://localhost:5173'
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// User routes
app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/orders", orderRoutes);

// Admin routes
// app.use("/api/admin",adminRoutes);

// Other route
// app.all("*",(req,res,next) => {
//     const error = new customError(`Cannot find ${req.originalUrl} on this server!`,404);
//     next(error);
// })

// Middleware for gobal error handling
app.use(asyncErrorHandler);
app.use(errorHandler);

module.exports = app;
