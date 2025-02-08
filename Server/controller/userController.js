const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");



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

const getUserById = asyncErrorHandler(async (req,res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if(!user) {
        throw new CustomError("User not found",404);
    }
    res.status(200).json({message:"User retrieved successfully",user });
});

const blockUser = asyncErrorHandler(async (req, res) => {
    const userId = req.params.id;
  
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
  
    if (user.isBlocked) {
      throw new CustomError("User is already blocked", 400);
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true }, // Set isBlocked to true
      { new: true } // Return the updated user object
    );
  
    res.status(200).json({message: "User blocked successfully", updatedUser });
});

// Unblock a user
const unblockUser = asyncErrorHandler(async (req, res) => {
    const userId = req.params.id;
  
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
  
    if (!user.isBlocked) {
      throw new CustomError("User is not blocked", 400);
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false }, // Set isBlocked to false
      { new: true } // Return the updated user object
    );
  
    res.status(200).json({message:"User unblocked successfully", updatedUser });
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


module.exports = {getAllUsers, getUserById, blockUser, unblockUser, makePayment, paymentverify };