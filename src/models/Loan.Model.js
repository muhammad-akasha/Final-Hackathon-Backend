import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    loanPurpose: {
      type: String,
      required: true,
      trim: true, // Removes any leading or trailing whitespace
    },
    loanAmount: { type: Number, required: true },
    loanTunure: {
      type: String,
      required: [true, "turnure is required"],
    },
    initialDeposit: {
      type: Number,
      required: [true, "deposit is required"],
      minlength: 6, // Minimum length of 3 characters
      maxlength: 30, // Maximum length of 30 characters
      trim: true, // Removes any leading or trailing whitespace
    },
    loanholder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guarantorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guarantor",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", LoanSchema);
