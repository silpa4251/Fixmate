const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { updateProfileService, getProfileService, getAllUsersService, blockUserService, unblockUserService, createUserService, updateUserService, makePaymentService, verifyPaymentService } = require("../services/userService");



const getAllUsers = asyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const data = await getAllUsersService(page, limit);

  res.status(200).json({
    message: "All users retrieved successfully",
    data,
  });
});

const blockUser = asyncErrorHandler(async (req, res) => {
  const { userId } = req.params;
  const data = await blockUserService(userId);
  
  res.status(200).json({ status: "success", message: "User blocked successfully", data});
});

// Unblock a user
const unblockUser = asyncErrorHandler(async (req, res) => {
  const { userId } = req.params;
  const data = await unblockUserService(userId);
  
  res.status(200).json({status: "success",message:"User unblocked successfully", data});
});

const createUser = asyncErrorHandler(async (req, res) => {
  const data = await createUserService(req.body);
  res.status(201).json({
    status: 'success',
    data
  });
});

// Update user
const updateUser = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.password) {
    updateData.password = req.body.password;
  }
  const updatedUser = await updateUserService(id, updateData);


  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

const updateProfile = asyncErrorHandler(async(req, res) => {
  const userId = req.user.id;
  const data = await updateProfileService(userId, req.body, req.file);
  res.status(200).json({status: 'success',message: "Profile updated successfully", data})
})

const getProfile = asyncErrorHandler(async(req, res) =>{
  const userId = req.user.id;
  const data = await getProfileService(userId);
  res.status(200).json({status:'success',message: "Profile retrived successfully", data})
})

const makePayment = asyncErrorHandler(async(req, res) => {
  const { amount, currency, bookingId } = req.body;
  const paymentResponse = await makePaymentService(amount, currency, bookingId);
  
  res.status(200).json({
    paymentResponse
  });
});


const paymentverify = asyncErrorHandler(async(req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const payment = await verifyPaymentService(razorpay_payment_id, razorpay_order_id, razorpay_signature);
  res.status(200).json({ status: "success", message: "Payment verified successfully", payment });
})


module.exports = {  getAllUsers, blockUser, unblockUser, createUser, updateUser, updateProfile, getProfile, makePayment, paymentverify };