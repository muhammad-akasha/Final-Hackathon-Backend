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
    image: { type: String },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6, // Minimum length of 3 characters
      maxlength: 30, // Maximum length of 30 characters
      trim: true, // Removes any leading or trailing whitespace
    },
    profilePic: {
      type: {
        profilePic: { type: String, required: true }, // URL of the uploaded image
        deleteUrl: { type: String, required: true }, // URL for deleting the image
      },
      required: [true, "Profile picture is required"],
      _id: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: [true, "Please add role"],
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
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
