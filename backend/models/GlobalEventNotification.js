// models/GlobalEventNotification.js
import mongoose from "mongoose";

const globalEventNotificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

export default mongoose.model("GlobalEventNotification", globalEventNotificationSchema);
