const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");



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

module.exports = {getAllUsers, getUserById, blockUser, unblockUser };