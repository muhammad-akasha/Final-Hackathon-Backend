import express from "express";
import authenticateUser from "../middleware/auth.middleware.js";

import {
  createLoan,
  deleteLoan,
  editLoan,
  getAllLoans,
  getUserLoans,
  singleLoan,
} from "../controllers/loan.controller.js";

const router = express.Router();

router.post("/createloan", authenticateUser, createLoan);
router.get("/allloans", getAllLoans);
router.get("/singleloan/:id", singleLoan);
router.put("/editloan/:id", authenticateUser, editLoan);
router.delete("/deleteloan/:id", authenticateUser, deleteLoan);
router.get("/getuserloans", authenticateUser, getUserLoans);

export default router;
