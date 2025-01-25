import express from "express";
import {
  cancelOrder,
  getAllOrderOfUser,
  getOrderById,
  placeOrder,
} from "../controllers/order.controller.js";

import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/placeorder", authenticateUser, placeOrder);
router.get("/order/:id", authenticateUser, getOrderById);
router.get("/getuserorder", authenticateUser, getAllOrderOfUser);
router.delete("/cancelorder/:id", authenticateUser, cancelOrder);

export default router;
