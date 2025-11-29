import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardSummary,
  getRevenueStats,
  getTopProducts,
} from "../controllers/adminController.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getAllCategoriesAdmin,
} from "../controllers/categoryController.js";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
  getAllEventsAdmin,
} from "../controllers/eventController.js";
import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  bulkSoftDeleteProducts,
  updateFeaturedProducts,
} from "../controllers/productController.js";
import { sendNewsletter } from "../controllers/newsletterController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly); // Apply auth + admin check to all routes

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/dashboard", getDashboardSummary);
router.get("/stats/revenue", getRevenueStats);
router.get("/stats/top-products", getTopProducts);

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.put("/categories/:id/toggle", toggleCategoryStatus);
router.get("/categories/all", getAllCategoriesAdmin);

router.post("/events", upload.single("image"), createEvent);
router.put("/events/:id", upload.single("image"), updateEvent);
router.delete("/events/:id", deleteEvent);
router.put("/events/:id/toggle", toggleEventStatus);
router.get("/events/all", getAllEventsAdmin);

router.post("/products", upload.array("images", 5), createProduct);
router.put("/products/:id", upload.array("images", 5), updateProduct);
router.delete("/products/:id", deleteProduct);
router.put("/products/bulk-delete", bulkSoftDeleteProducts);
router.put("/products/featured/update", updateFeaturedProducts);

router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

router.post("/newsletter", sendNewsletter);

export default router;
