const User = require("../models/userModel");
const CustomError = require("../utils/customError");
const cloudinary = require("../config/cloudinary");

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
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'profile_images',
        width: 300,
        crop: "scale"
      });
      profileImageUrl = result.secure_url;
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
    return {profile};
}

module.exports = { updateProfileService, getProfileService }