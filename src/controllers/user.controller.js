import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "./sendEmail.js";
import dotenv from "dotenv";
dotenv.config();

const getUserDetail = async (req) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "no refresh token found!" });

  const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
  const user = await User.findOne({ email: decodedToken.email });

  if (!user) return res.status(404).json({ message: "invalid token" });

  const generateToken = generateAccessToken(user);
  res.json({ message: "access token generated", accesstoken: generateToken });
};

const getLoginUser = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "User Not Found!" });
  }
  return res.status(200).json({ user });
};

// generate access token
const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "6h",
  });
};

// generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};

const getAllUsers = async (req, res) => {
  // pagination
  const { limit, page } = req.query;

  const skip = (page - 1) * limit;
  const users = await User.find({}).skip(skip).limit(limit);
  res.status(200).json({
    length: users.length,
    users,
  });
};

// register user
const registerUser = async (req, res) => {
  const { userName, email, password, role, cnic } = req.body;

  if (!userName) return res.status(400).json({ message: "UserName required" });
  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });
  if (!role) return res.status(400).json({ message: "role required" });
  if (!cnic) return res.status(400).json({ message: "CNIC required" });

  const user = await User.findOne({ email: email });
  // check email already used or not
  if (user) return res.status(401).json({ message: "user already exist" });
  try {
    const createUser = await User.create({
      email,
      password,
      userName,
      cnic,
      role,
    });
    const emailSend = await sendEmail(email);

    res.json({
      message: "user registered successfully",
      data: createUser,
      emailSend,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "no user found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "incorrect password" });

    // token generate
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.status(200).json({
      message: "user loggedIn successfully",
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// logout user
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "user logout successfully" });
};

// refreshtoken
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "no refresh token found!" });

  const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
  const user = await User.findOne({ email: decodedToken.email });

  if (!user) return res.status(404).json({ message: "invalid token" });

  const generateToken = generateAccessToken(user);
  res.json({ message: "access token generated", accesstoken: generateToken });
};

const updateProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User Not Found!" });
  }

  const { email, userName, password, image } = req.body;

  let accessToken;
  let refreshToken;

  try {
    let updatedField = {};

    // Handling email update
    if (email) {
      updatedField.email = email;
      accessToken = generateAccessToken(updatedField);
      refreshToken = generateRefreshToken(updatedField);

      // Set refresh token in cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // If in production with HTTPS, make sure the server is secure
        sameSite: "none", // For cross-origin requests
      });
    }

    // Handling userName update
    if (userName) {
      updatedField.userName = userName;
    }

    // Handling image update
    if (image) {
      updatedField.image = image;
    }

    // Handling password update
    if (password) {
      const hashedPass = await bcrypt.hash(password, 10);
      updatedField.password = hashedPass;
    }

    // If no fields to update
    if (Object.keys(updatedField).length === 0) {
      return res.status(400).json({ message: "No field to update" });
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(user._id, updatedField, {
      new: true, // Return the updated user document
    });

    // Send the response with updated user and tokens
    return res.status(200).json({ updatedUser, accessToken, refreshToken });
  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Send error response
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export {
  updateProfile,
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getAllUsers,
  getLoginUser,
  getUserDetail,
};
