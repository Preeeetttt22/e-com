import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: { type: Number, required: true },
      },
    ],
    address: {
      type: mongoose.Schema.Types.ObjectId, // just an ID reference to embedded user address
      required: true,
    },

    paymentMode: { type: String, default: "Cash on Delivery" },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Ready", "Delivered", "Cancelled"],
      default: "Pending",
    },
    orderedAt: { type: Date, default: Date.now },
    cancelledAt: Date,
    isPaid: { type: Boolean, default: true }, // assume true for COD
    paidAt: { type: Date, default: Date.now },
    totalPrice: { type: Number, required: true },
    cancelledBy: {
      type: String,
      enum: ["User", "Admin"],
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
