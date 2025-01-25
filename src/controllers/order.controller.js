import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import User from "../models/usermodel.js";
import orderModel from "../models/order.model.js";

// place order
const placeOrder = async (req, res) => {
  const { products } = req.body; // get array of products IDS
  if (!Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ message: "'products' should be an array or cart is empty" }); // check product id found or not
  }
  try {
    const user = req.user; // get Login user detail using cookie
    if (!user) {
      return res.status(404).json({ message: user });
    }

    const productsOrder = await productModel.find({
      _id: { $in: products.map((item) => item.id) },
    }); // get product using ID

    let totalPrice = 0;

    if (productsOrder.length === products.length) {
      totalPrice = productsOrder.reduce((total, item, index) => {
        return total + item.price * products[index].quantity;
      }, 0);
    } else {
      return res.status(404).json({ message: "Product not match by all IDS" });
    }

    const order = await orderModel.create({
      userId: user._id,
      products: productsOrder.map((item, index) => ({
        productId: item._id,
        quantity: products[index].quantity, // Store quantity for each product in the order
        price: item.price, // Store the price of each product
      })),
      totalPrice,
      status: "pending", // Set the order status to pending
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { orders: order._id },
    });

    await Promise.all(
      productsOrder.map(async (product) => {
        await productModel.findByIdAndUpdate(
          product._id,
          {
            $push: { orderItem: order._id },
          },
          { new: true }
        );
      })
    );

    const populatedOrder = await orderModel
      .findById(order._id)
      .populate("products.productId");

    return res
      .status(200)
      .json({ message: "Order Has Been Placed", populatedOrder });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

// get single order
const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Not A Valid ID" });
  }

  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: user });
    }

    const order = await orderModel.findById(id).populate("products.productId"); // Populate product details

    if (order.userId._id.toString() !== user._id.toString()) {
      return res.status(404).json({
        message: "No Access to View This Order",
      });
    }
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(400).json({ error: "Server error" });
  }
};

// get all login user orders
const getAllOrderOfUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: user });
    }
    if (!user) {
      return res.status(400).json({ message: "UnAuthorized" });
    }
    const orders = await User.findById(user._id)
      .populate("orders")
      .populate({ path: "orders", populate: "products.productId" });
    if (!orders) {
      return res.status(404).json({ message: "No Orders Found!" });
    }
    return res.status(200).json({ userOrders: orders });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!user || !mongoose.isValidObjectId(id)) {
    return res.status(401).json({ message: "User Not Found! or invalid Id" });
  }

  const order = await orderModel.findById(id);
  const products = await productModel.find({});
  if (!order) {
    return res.status(404).json({ message: "No Order Found!" });
  }
  const orderIndex = user.orders.findIndex(
    (item) => item.toString() === id.toString()
  );

  // Loop through all the products
  const updateProducts = products.map(async (product) => {
    // Find the index of the product ID in the orderItem array
    const productOrderIndex = product.orderItem.findIndex(
      (item) => item.toString() === id.toString() // Ensure to compare as strings
    );

    // If the product exists in orderItem, remove it
    if (productOrderIndex !== -1) {
      product.orderItem.splice(productOrderIndex, 1); // Remove the item
      await product.save(); // Save the updated product
    }
  });

  // Use Promise.all to save all products concurrently
  await Promise.all(updateProducts);

  if (orderIndex !== -1) {
    user.orders.splice(orderIndex, 1);
    await user.save();
  }
  await orderModel.deleteOne({ _id: id });
  res.status(200).json({ message: "Order Cancel Successfully" });
};

export { placeOrder, getOrderById, getAllOrderOfUser, cancelOrder };
