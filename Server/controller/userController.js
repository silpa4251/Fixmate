const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Payment = require("../models/paymentModel");
const CustomError = require("../utils/customError");



const getAllUsers = asyncErrorHandler(async (req, res) => {
    const users = await User.aggregate([
      {
        $project: {
            name: 1,
            email: 1,
            phone: 1,
            address: 1,
            createdAt: 1,
          }
      }
  ]);
    res.status(200).json({message:"All users retrieved successfully", users});
});

// const getUserById = asyncErrorHandler(async (req,res) => {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     if(!user) {
//         throw new CustomError("User not found",404);
//     }
//     res.status(200).json({message:"User retrieved successfully",user });
// });

const blockUser = asyncErrorHandler(async (req, res) => {
    const { userId } = req.params;
   
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
  
    if (user.isBlocked) {
      throw new CustomError("User is already blocked", 400);
    }
  
    user.isBlocked = true;
    await user.save();
  
    res.status(200).json({ status: "success", message: "User blocked successfully", user});
});

// Unblock a user
const unblockUser = asyncErrorHandler(async (req, res) => {
    const { userId } = req.params;
  
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
  
    if (!user.isBlocked) {
      throw new CustomError("User is not blocked", 400);
    }
  
    user.isBlocked = false;
    await user.save();
  
    res.status(200).json({status: "success",message:"User unblocked successfully",user});
});

const createUser = asyncErrorHandler(async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    throw new CustomError('Please provide email, password and name', 400);
  }

  // Check if user with email already exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new CustomError('User with this email already exists', 400);
  }

  // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: newUser
  });
});

// Update user
const updateUser = asyncErrorHandler(async (req, res) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email,
  };

  // If password is provided, hash it
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password  = await bcrypt.hash(req.body.password, salt);
  }

  // Check if email is being changed and if it's already taken
  if (req.body.email) {
    const existingUser = await User.findOne({ 
      email: req.body.email,
      _id: { $ne: req.params.id }
    });
    
    if (existingUser) {
      throw new CustomError('Email already in use', 400);
    }
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  if (!user) {
    throw new CustomError('No user found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: user
  });
});

const makePayment = asyncErrorHandler(async(req, res) => {
  const { amount, currency } = req.body;
  const options = {
    amount: amount,
    currency: currency || "INR",
    receipt: `order_rcptid_${Date.now()}`,
  };

   const order = await razorpay.orders.create(options);
   res.status(200).json(order);
});

const paymentverify = asyncErrorHandler(async(req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
  if (generatedSignature === razorpay_signature) {
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        status: 'successful'
      },
      { new: true }
    );
    res.status(200).json({ status: "success", message: "Payment verified successfully", payment });
  } else {
    res.status(400).json({ status: "error", message: "Payment verification failed" });
  }
})


module.exports = {  getAllUsers, blockUser, unblockUser, createUser, updateUser, makePayment, paymentverify };