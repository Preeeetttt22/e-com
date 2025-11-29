// models/EventNotification.js
import mongoose from "mongoose";

const eventNotificationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  email: { type: String, required: true },
});

export default mongoose.model("EventNotification", eventNotificationSchema);
