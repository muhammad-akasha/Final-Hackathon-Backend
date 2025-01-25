import product from "../models/product.model.js";
import mongoose from "mongoose";
import orderModel from "../models/order.model.js";
import usermodel from "../models/usermodel.js";
import { uploadMultiple } from "./uploadImage.js";

// create product
const createProduct = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({
      message: "No Access to Create ad",
    });
  }
  console.log(req.body);
  const images = req.files;

  const { name, description, price } = req.body;
  if (!name || !description || !price || !images || images.length === 0) {
    const { name, description, price, image } = req.body;

    if ((!name || !description || !price, !image)) {
      return res.status(400).json({
        message: "all the field required",
      });
    }

    try {
      const imageUrl = await uploadMultiple(images);

      // Create and save the ad
      const newAd = await product.create({
        name,
        description,
        price,
        images: imageUrl,
        createdBy: user._id,
      });

      // Send success response
      res.status(201).json({
        message: "Ad created successfully",
        ad: newAd,
      });
    } catch (error) {
      console.error("Error creating ad:", error);
      res.status(500).json({
        message: "Failed to create ad",
        error: error.message,
      });
    }
  }
};

// get single product
const singleProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Not a Valid ID",
    });
  }
  const getSingleProduct = await product
    .findById(id)
    .populate("createdBy", "userName , email _id");

  if (!getSingleProduct) {
    return res.status(404).json({ message: "NO PRODUCT FOUND!" });
  }
  res.status(200).json({ getSingleProduct });
};

// edit product
const editProduct = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "No Access to edit product" });
  }
  const { id } = req.params;
  const { name, description, price, image } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Not a Valid ID",
    });
  }

  let updateObj = {};

  // Ensure the required fields are present

  if (name) {
    updateObj.name = name;
  }
  if (description) {
    updateObj.description = description;
  }
  if (price) {
    updateObj.price = price;
  }
  if (image) {
    updateObj.image = image;
  }

  const ad = await product.findByIdAndUpdate(id, updateObj, { new: true });
  res.status(200).json({ ad });
};

// delete product
const deleteProduct = async (req, res) => {
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
  const allUsers = await usermodel.find();
  const orders = await orderModel.find(); // Fetch all orders

  for (const order of orders) {
    const productIndex = order.products.findIndex(
      (item) => item.productId.toString() === id.toString()
    );

    if (productIndex !== -1) {
      if (order.products.length === 1) {
        await orderModel.deleteOne({ _id: order._id });
      }
      for (const user of allUsers) {
        const userOrderIndex = user.orders.findIndex(
          (item) => item.toString() === id.toString()
        );

        if (userOrderIndex !== -1) {
          user.orders.splice(userOrderIndex, 1);
          await user.save();
        }
      }
    } else {
      order.products.splice(productIndex, 1);
      await order.save();
    }
  }

  const ad = await product.findByIdAndDelete(id);
  return res
    .status(200)
    .json({ message: "Your Ad Has been Deleted Successfully", ad });
};

// get all product
const getAllProduct = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const skip = (page - 1) * limit;

  const ads = await product
    .find({})
    .skip(skip)
    .limit(limit)
    .populate("createdBy");

  if (!ads) {
    return res.status(404).json({ message: "NO ADS FOUND!" });
  }
  res.status(200).json({ ads });
};

// get all product
const getUserAds = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "No User Login" });
  }
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const skip = (page - 1) * limit;

  const ads = await product
    .find({})
    .skip(skip)
    .limit(limit)
    .populate("createdBy");
  if (ads.length === 0) {
    return res.status(404).json({ message: "NO ADS FOUND!" });
  }
  const userAds = ads.filter(
    (ad) => ad.createdBy._id.toString() === user._id.toString()
  );

  if (userAds.length === 0) {
    return res.status(404).json({ message: "No Ads Found!" });
  }

  res.status(200).json({ userAds });
};

export {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProduct,
  singleProduct,
  getUserAds,
};
