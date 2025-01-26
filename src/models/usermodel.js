import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 3, // Minimum length of 3 characters
      maxlength: 30, // Maximum length of 30 characters
      trim: true, // Removes any leading or trailing whitespace
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true, // Removes any leading or trailing whitespace
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: [true, "Please add role"],
    },
    cnic: {
      type: String,
      required: [true, "Please add Cnic"],
    },
    Loans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
