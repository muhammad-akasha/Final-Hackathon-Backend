import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    images: [
      {
        url: { type: String, required: [true, "Image URL is required"] }, // Image URL
        deleteUrl: { type: String, required: [true, "Delete URL is required"] }, // Delete URL
        _id: false,
      },
    ],
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItem: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], //order id
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
