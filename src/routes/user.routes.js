import express from "express";
import {
  getAllUsers,
  getLoginUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { sendEmail } from "../controllers/sendEmail.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/users", getAllUsers);
router.get("/getuser", authenticateUser, getLoginUser);
router.post("/updateprofile", authenticateUser, updateProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refreshtoken", refreshToken);
router.post("/sendemail", sendEmail);

export default router;
