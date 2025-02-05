const User = require("../models/userModel");
const Provider = require("../models/providerModel");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken, verifyRefreshToken, sentRefreshToken } = require("../utils/jwt");
const CustomError = require("../utils/customError");
const cloudinary = require("../config/cloudinary");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Admin = require("../models/adminModel");
const axios = require("axios");


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

const providerRegisteration = async (data) => {
  const { name, email, password, address, services } = data;
  // Check if provider already exists
  const existingProvider = await Provider.findOne({ email });
  if (existingProvider) {
    throw new CustomError("Provider already exists!", 400);
  }

  if (!Array.isArray(address) || address.length === 0) {
    throw new CustomError("Invalid address provided", 400);
  }
  const { place, district, state, pincode } = address[0];

  // **Run hashing and geolocation in parallel**
  const [hashedPassword, geoResponse] = await Promise.all([
    bcrypt.hash(password, 10), // Hash password
    axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {
        q: `${place}, ${district}, ${state}, ${pincode}`,
        key: process.env.GEO_API_KEY,
      },
    }),
  ]);

  // Extract coordinates
  if (geoResponse.data.results.length === 0) {
    throw new CustomError("Unable to fetch coordinates for the provided address", 400);
  }
  const { lat, lng } = geoResponse.data.results[0].geometry;
  const coordinates = [lng, lat];
  const newProvider = new Provider({
    name,
    email,
    password: hashedPassword,
    address: [
      {
        place,
        district,
        state,
        pincode,
        coordinates: {
          type: "Point",
          coordinates,
        },
      },
    ],
    services: Array.isArray(services) ? services : services.split(",")
  });

  await newProvider.save();
  return { message: "Provider registered successfully" };
};


const userLoginService = async (res,data) => {
  const { email, password } = data;
  const user = await User.findOne({ email });
  const role = "User";

  if (!user) {
    throw new CustomError("Invalid email", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }
  const token = generateToken(user._id, role);
  const refreshToken = generateRefreshToken(user._id, role);
  sentRefreshToken(res, refreshToken);

  return {
    message: "user logged in successfully",
    token,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role
    },
  };
};

const providerLoginService = async (res,data) => {
  const { email, password } = data;
  const provider = await Provider.findOne({ email });

  if (!provider) {
    throw new CustomError("Invalid email or password", 400);
  }

  const isMatch = await bcrypt.compare(password, provider.password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }
  const token = generateToken(provider._id, "Provider");
  const refreshToken = generateRefreshToken(provider._id, "Provider");
  sentRefreshToken(res, refreshToken);

  return {
    message: "Provider logged in successfully",
    token,
    refreshToken,
    user: {
      id: provider._id,
      name: provider.name,
      email: provider.email,
      role: "Provider",
    },
  };
};

const userGoogleAuthService = async(res, Credentials) => {
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

  const user = await User.findOne({ email });
  const role = "User";
  

  if (!user) {
    const newUser = new User({ name, email, password: null });
    await newUser.save();
    user = newUser; 
    role = "User";
  
  }


  const token = generateToken(user._id, role);
  const refreshToken = generateRefreshToken(user._id, role);
  sentRefreshToken(res, refreshToken);

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

const providerGoogleAuthService = async (res, Credentials) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

  const provider = await Provider.findOne({ email });
  const role = "Provider";
  // If provider doesn't exist, create a new one
  if (!provider) {
    provider = new Provider({ name, email, password: null });
    await provider.save();
  }

  // Generate token using the provider's ID
  const token = generateToken(provider._id, role);
  const refreshToken = generateRefreshToken(provider._id, role);
  sentRefreshToken(res, refreshToken);
  return {
    token,
    provider: {
      id: provider._id,
      name: provider.name,
      email: provider.email,
      role: "Provider",
    },
  };
};

const refreshTokenService = async(token) => {
  if (!token) {
    throw new CustomError('Refresh token missing', 401);
  }
  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      throw new CustomError("Invalid refresh token", 403);
    }
    console.log("decoded", decoded);
  const newToken = generateToken(decoded.userId,decoded.role);
  return {token: newToken};

}



const forgotPasswordService = async(data) => {
  const { email } = data;
  const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User not found",400);
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000;
await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

  return  { message: "Password reset email sent!"};

}

const resetPasswordService = async(data,params) => {
  const { password } = data;
  const { token } = params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomError("Invalid or expired token",400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return  { message: "Password has been reset successfully" };

}

const contactService = async(data) => {
  const { name, email, message } = data;
  if (!name || !email || !message) {
    throw new CustomError("All fields are required!",400);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.APP_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: email,
    to: process.env.EMAIL, // Receiver's email (your email)
    subject: `New Contact Form Submission from ${name}`,
    text: `You received a new message from ${name} (${email}):\n\n${message}`,
  };

  await transporter.sendMail(mailOptions);
  return { message: "Your message has been sent successfully!" };
}

module.exports = { userRegisteration, providerRegisteration, userLoginService, providerLoginService, userGoogleAuthService,providerGoogleAuthService,refreshTokenService, forgotPasswordService, resetPasswordService, contactService };
