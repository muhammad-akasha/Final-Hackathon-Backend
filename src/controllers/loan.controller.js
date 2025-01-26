import mongoose from "mongoose";
import usermodel from "../models/usermodel.js";
import LoanModel from "../models/Loan.Model.js";
import { sendEmail } from "./sendEmail.js";
import { createGuarantor } from "./guarantor.controller.js";

// create Loan
const createLoan = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({
      message: "No Access to Create Loan",
    });
  }

  const {
    loanPurpose,
    loanAmount,
    initialDeposit,
    loanTunure,
    GuarantorName,
    GuarantorCNIC,
    GuarantorPhone,
  } = req.body;

  if (
    !loanPurpose ||
    !loanAmount ||
    !initialDeposit ||
    !GuarantorName ||
    !GuarantorCNIC ||
    !GuarantorPhone ||
    !loanTunure
  ) {
    return res.status(400).json({
      message: "all the field required",
    });
  }
  const guarantor = createGuarantor(
    GuarantorName,
    GuarantorCNIC,
    GuarantorPhone
  );
  try {
    // Create and save the ad
    const newLoan = await LoanModel.create({
      loanPurpose,
      loanAmount,
      initialDeposit,
      loanTunure,
      loanholder: user._id,
      guarantorId: guarantor._id,
    });
    user.Loans.push(newLoan._id);
    await user.save();
    await sendEmail(user.email, loanAmount, loanPurpose);
    // Send success response
    res.status(201).json({
      message: "Loan created successfully",
      Loan: newLoan,
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).json({
      message: "Failed to create ad",
      error: error.message,
    });
  }
};

// get all loans
const getAllLoans = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const skip = (page - 1) * limit;
  const loans = await LoanModel.find({})
    .limit(limit)
    .skip(skip)
    .populate("loanholder")
    .populate("guarantorId");

  if (!loans) {
    return res.status(404).json({ message: "NO loans FOUND!" });
  }
  res.status(200).json({ loans });
};

// get all User Loans
const getUserLoans = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "No User Login" });
  }
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const skip = (page - 1) * limit;

  const loans = await usermodel
    .find({ _id: user._id })
    .skip(skip)
    .limit(limit)
    .populate("Loans");
  if (loans.length === 0) {
    return res.status(404).json({ message: "NO loans FOUND!" });
  }
  if (loans.length === 0) {
    return res.status(404).json({ message: "No loans Found!" });
  }

  res.status(200).json({ loans });
};

// get single Loan
const singleLoan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Not a Valid ID",
    });
  }
  const getSingleLoan = await LoanModel.findById(id);

  if (!getSingleLoan) {
    return res.status(404).json({ message: "NO Loan FOUND!" });
  }
  res.status(200).json({ getSingleLoan });
};

// edit product
const editLoan = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "No Access to edit product" });
  }
  const { id } = req.params;
  const { loanPurpose, loanAmount, initialDeposit } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Not a Valid ID",
    });
  }

  let updateLoan = {};

  // Ensure the required fields are present

  if (loanPurpose) {
    updateLoan.loanPurpose = loanPurpose;
  }
  if (loanAmount) {
    updateLoan.loanAmount = loanAmount;
  }
  if (initialDeposit) {
    updateLoan.initialDeposit = initialDeposit;
  }

  const loan = await LoanModel.findByIdAndUpdate(id, updateLoan, { new: true });
  res.status(200).json({ loan });
};

// delete Loan
const deleteLoan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Not a Valid ID",
    });
  }

  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "Un-Authorized" });
  }

  // Find the user by their _id
  const findUser = await usermodel.findById(user._id);

  // Check if the loan is in the user's Loans array
  if (!findUser.Loans.includes(id)) {
    return res.status(404).json({ message: "Loan not found in user's loans" });
  }

  // Find the loan
  const loan = await LoanModel.findById(id);
  if (!loan) {
    return res.status(404).json({ message: "Loan not found" });
  }

  // Remove the loan from the user's Loans array
  findUser.Loans.pull(id);
  await findUser.save();

  // Delete the loan from the LoanModel
  await LoanModel.findByIdAndDelete(id);

  return res
    .status(200)
    .json({ message: "Loan has been deleted successfully" });
};

export {
  createLoan,
  deleteLoan,
  editLoan,
  getAllLoans,
  singleLoan,
  getUserLoans,
};
