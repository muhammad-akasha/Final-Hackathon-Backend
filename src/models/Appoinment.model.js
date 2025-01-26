import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    AppointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    ClientName: {
      type: String,
      required: [true, "Client name is required"],
    },
    ClientEmail: {
      type: String,
      required: [true, "Client email is required"],
    },
    ClientPhone: {
      type: String,
      required: [true, "Client phone is required"],
    },
    Status: {
      type: String,
      enum: ["scheduled", "completed", "canceled"],
      default: "scheduled",
    },
    Notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);
