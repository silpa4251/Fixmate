const User = require("../models/userModel");
const Provider = require("../models/providerModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const CustomError = require("../utils/customError");

const userRegisteration = async (data) => {
  const { name, email, password, phone } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ name, email, password: hashedPassword, phone });
  await newUser.save();
  return { message: "User registered successfully" };
};

const providerRegisteration = async (data) => {
  const { name, email, password, services, certifications } = data;
  const existingProvider = await Provider.findOne({ email });
  if (existingProvider) {
    throw new CustomError("Provider already exists!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newProvider = new Provider({ name, email, password: hashedPassword, services : services ? services.split(",") : [], certifications: certifications ? certifications.split(",") : [] });
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

module.exports = { userRegisteration, providerRegisteration, userLogin };
