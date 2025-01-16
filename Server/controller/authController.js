const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const {registerValidation,loginValidation,} = require("../validations/userValidations");
const CustomError = require("../utils/customError");

// Registering a new user
const register = async (req, res) => {
  const { error } = registerValidation(req.body)
  if (error) throw new CustomError(error.details[0].message, 400);

  const { name, email, password, role } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exits !", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newuser = new User({name,email,password: hashedPassword,role});
  await newuser.save();

  res.status(201).json({ status: "success", message: "User registered successfully" })
};


//Login a user
const login = async (req, res) => {
  const {error} = loginValidation(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", 400);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }

  const token = generateToken(user._id, user.role);
  res.status(200).json({ status: "success", message: "User logged in successfully", token , user:[user]})
};

module.exports = { register, login };
