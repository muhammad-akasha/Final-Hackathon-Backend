import mongoose from "mongoose";

const GuarantorSchema = new mongoose.Schema(
  {
    GuarantorName: {
      type: String,
      required: [true, "Guarantor is required"],
    },
    GuarantorCNIC: {
      type: String,
      required: [true, "Guarantor is required"],
    },
    GuarantorPhone: {
      type: String,
      required: [true, "Guarantor is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Guarantor", GuarantorSchema);
