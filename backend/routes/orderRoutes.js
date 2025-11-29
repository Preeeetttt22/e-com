import express from "express";
import {
  placeOrder,
  getUserOrders,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

// User routes
router.post("/", placeOrder);
router.get("/my-orders", getUserOrders);
router.put("/:id/cancel", cancelOrder);

export default router;
