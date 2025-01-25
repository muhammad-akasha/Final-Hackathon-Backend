import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProduct,
  getUserAds,
  singleProduct,
} from "../controllers/product.controller.js";

import authenticateUser from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post(
  "/createproduct",
  authenticateUser,
  upload.array("images", 10),
  createProduct
);
router.get("/allproduct", getAllProduct);
router.get("/singleproduct/:id", singleProduct);
router.put("/product/:id", authenticateUser, editProduct);
router.delete("/deleteproduct/:id", authenticateUser, deleteProduct);
router.get("/getuserads", authenticateUser, getUserAds);

export default router;
