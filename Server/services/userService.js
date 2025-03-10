const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const CustomError = require("../utils/customError");
const cloudinary = require("../config/cloudinary");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Payment = require("../models/paymentModel");
const { uploadToS3, generatePresignedUrl } = require("../middlewares/multer");

const getAllUsersService = async (page, limit) => {
  const skip = (page - 1) * limit;

  const users = await User.aggregate([
    {
      $project: {
        name: 1,
        email: 1,
        phone: 1,
        address: 1,
        image: 1,
        isBlocked: 1,
        createdAt: 1,
      },
    },
    { $skip: skip }, 
    { $limit: limit }, 
  ]);

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      limit,
    },
  };
};

const blockUserService = async(userId) => {
  const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
  
    if (user.isBlocked) {
      throw new CustomError("User is already blocked", 400);
    }
  
    user.isBlocked = true;
    await user.save();
    return { user }
}

const unblockUserService = async(userId) => {
  const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
  
    if (!user.isBlocked) {
      throw new CustomError("User is not blocked", 400);
    }
  
    user.isBlocked = false;
    await user.save();
    return { user }
};

const createUserService = async(body) => {
  if (!body.email || !body.password || !body.name) {
    throw new CustomError('Please provide email, password and name', 400);
  }

  // Check if user with email already exists
  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) {
    throw new CustomError('User with this email already exists', 400);
  }

  // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

  const newUser = await User.create({
    name: body.name,
    email: body.email,
    password: hashedPassword,
  });

  // Remove password from response
  newUser.password = undefined;
return {newUser};
};

const updateUserService = async(userId, updateData) => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

    // Check if email is being changed and if it's already taken
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new CustomError('Email already in use', 400);
      }
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run model validators
      }
    ).select('-password'); // Exclude the password field from the response

    if (!updatedUser) {
      throw new CustomError('No user found with that ID', 404);
    }

    return updatedUser;
}

const updateProfileService = async(userId, body, file) => {
    const { name, email, phone, address } = body;
    let parsedAddress = [];
    if (typeof address === "string") {
        try {
            parsedAddress = JSON.parse(address);

      } catch (error) {
        throw new CustomError("Invalid address format", 400);
      }
    } else if (Array.isArray(address)) {
      parsedAddress = address;
    } else {
      throw new CustomError("Address must be an array", 400);
    }
    if (!Array.isArray(parsedAddress)) {
        throw new CustomError("Address must be an array", 400);
      }
    let profileImageUrl = undefined;

    // Handle image upload if present
    if (file) {
      const fileUrl = await uploadToS3(file)
      profileImageUrl = fileUrl ;
    }
    const updateData = {
        name,
        email,
        phone,
        address :  parsedAddress,
        ...(profileImageUrl && { image: profileImageUrl })
      };
      const updatedProfile = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
    return { updatedProfile } ;
};

const getProfileService = async(userId) => {
    const profile = await User.findById(userId);
    
    if (!profile) {
      throw new CustomError('Profile not found',404);
    }
    const profileData = profile.toObject();
        if (profileData.image) {
          profileData.image = await generatePresignedUrl(profileData.image);
        }
    return {profile: profileData};
}

const makePaymentService = async (amount, currency, bookingId) => {
    const options = {
      amount: amount,
      currency: currency || "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    const payment = await Payment.create({
      bookingId: bookingId,
      razorpayOrderId: order.id,
      amount: amount / 100, 
      currency: currency || "INR",
      status: 'pending',
    });

    return { ...order, paymentId: payment._id };
};

// Service: Verify Payment
const verifyPaymentService = async (razorpay_payment_id, razorpay_order_id, razorpay_signature) => {
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
          razorpaySignature: razorpay_signature,
          status: 'successful',
          paidAt: new Date(),
        },
        { new: true }
      );

      if (!payment) {
        throw new CustomError("Payment record not found", 404);
      }
      await Booking.findByIdAndUpdate(
        payment.bookingId,
        {
          paymentStatus: 'paid',
          paymentId: payment._id,
        },
        { new: true }
      );

      return payment;
    } else {
      throw new CustomError("Payment verification failed", 400);
    }
};

module.exports = { getAllUsersService, blockUserService, unblockUserService, updateUserService, createUserService, updateProfileService, getProfileService, makePaymentService, verifyPaymentService }