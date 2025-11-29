import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import './cron/eventReminders.js';

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import eventNotificationRoutes from './routes/eventNotificationRoutes.js';

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://eraya-ratna.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        // Allow no-origin (like health checks) and known origins
        callback(null, true);
      } else {
        console.warn("❌ CORS blocked for origin:", origin); // optional log
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/file', newsletterRoutes);
app.use("/api/events/notifications", eventNotificationRoutes);

app.get("/health", (req, res) => {
  console.log("🩺 Health check at:", new Date().toLocaleString());
  res.status(200).send("OK");
});

// root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
