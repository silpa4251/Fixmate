const User = require("../models/userModel");
const Provider = require("../models/providerModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const CustomError = require("../utils/customError");
const cloudinary = require("../config/cloudinary");
const { OAuth2Client } = require("google-auth-library");


const userRegisteration = async (data) => {
  const { name, email, password } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();
  return { message: "User registered successfully" };
};

const providerRegisteration = async (data, files) => {
  const { name, email, password, services } = data;
  const existingProvider = await Provider.findOne({ email });
  if (existingProvider) {
    throw new CustomError("Provider already exists!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let certificateUrls = [];
  if (files && files.length > 0) {
    for (let file of files) {
      
      const uploadedFile = await cloudinary.uploader.upload(file.path, {
        folder: "providers/certificates", // Optional: Organize uploads in a folder
        resource_type: "auto", // Supports images and PDFs
      });
     
      certificateUrls.push(uploadedFile.secure_url);
    }
  }

  const newProvider = new Provider({ name, email, password: hashedPassword, services : services ? services.split(",") : [], certifications: certificateUrls });
  await newProvider.save();
  return { message: "Provider registered successfully" };
}

const userLogin = async (data) => {
  const { email, password } = data;
  let user = await User.findOne({ email });
  let role = "User";

  if (!user) {
    user = await Provider.findOne({ email });
    role = "Provider";
  }
  
  if (!user) {
    throw new CustomError("Invalid email or password", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }
  const token = generateToken(user._id, role);

  return {
    message: `${role} logged in successfully`,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role
    },
  };
};

const googleAuthService = async(Credentials) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  
  if (!Credentials) {
    throw new CustomError("No google credentials provided!", 400);
  }
  if (!Credentials || !Credentials.credential) {
    throw new CustomError("No valid Google credentials provided!", 400);
  }

  // Verify Google token
  const ticket = await client.verifyIdToken({
    idToken: Credentials.credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  // Get payload from verified token
  const payload = ticket.getPayload();
  const { email, name } = payload;

  let user = await User.findOne({ email });
  let role = "User";
  

  if (!user) {
    user = await Provider.findOne({ email });
    if (user) {
      role = "Provider";
    }
  }
  console.log("role6",role)
  if (!user) {
    // If user doesn't exist, create a new one
    const newUser = new User({ name, email, password: null });
    await newUser.save();
    user = newUser; 
    role = "User";
    console.log("role2",role)
  
  }


  const token = generateToken(user._id, role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role,
    },
    
    
  };
};

module.exports = { userRegisteration, providerRegisteration, userLogin, googleAuthService };
