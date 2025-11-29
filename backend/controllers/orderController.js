import Order from "../models/Order.js";
import sendEmail from "../utils/sendEmail.js"; // or your Web3Forms function
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Place new order
export const placeOrder = async (req, res) => {
  try {
    const { items, address, paymentMode } = req.body;
    if (!items?.length || !address) {
      return res.status(400).json({ message: "Missing order data" });
    }

    // 🔍 Fetch product prices
    const productDetails = await Product.find({
      _id: { $in: items.map((i) => i.productId) },
    });

    // 💰 Calculate total price
    let total = 0;
    for (let item of items) {
      const product = productDetails.find(
        (p) => p._id.toString() === item.productId
      );
      if (product) {
        total += product.price * item.qty;
      }
    }

    // 🧾 Create order with full pricing info
    const newOrder = await Order.create({
      user: req.user._id,
      items: items.map((item) => ({
        product: item.productId,
        qty: item.qty,
      })),
      address,
      paymentMode,
      isPaid: true, // ✅ assume paid for COD
      paidAt: new Date(),
      totalPrice: total,
    });

    // 🛒 Remove items from cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      const orderedProductIds = items.map((item) => item.productId.toString());
      cart.items = cart.items.filter(
        (item) => !orderedProductIds.includes(item.product.toString())
      );
      await cart.save();
    }

    if (!req.user.addresses) req.user.addresses = [];
    const matchedAddress = req.user.addresses.find(
      (addr) => addr._id.toString() === address.toString()
    );

    const formattedItems = productDetails
      .map((product) => {
        const item = items.find((i) => i.productId === product._id.toString());
        return `<li>${product.name} × ${item.qty} = ₹${
          product.price * item.qty
        }</li>`;
      })
      .join("");

    const formattedAddress = matchedAddress
      ? `${matchedAddress.fullName}, ${matchedAddress.street}, ${matchedAddress.city}, ${matchedAddress.state} - ${matchedAddress.pin}`
      : "Address not found";

    await sendEmail({
      subject: "📦 New Order Placed on Eraya Ratna",
      to: process.env.ADMIN_EMAIL,
      html: `
  <div style="background: #fff7f5; padding: 30px; font-family: 'Georgia', serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 8px 24px rgba(0,0,0,0.05);">
      <h2 style="text-align: center; color: #b83280;">🌼 A New Order Blossomed 🌼</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        A soul has made a purchase on <strong>Eraya Ratna</strong>.
      </p>
      <p><strong>🧘 Customer:</strong> ${req.user.name} (${req.user.email})</p>
      <p><strong>🏡 Address:</strong> ${formattedAddress}</p>
      <p><strong>💳 Payment Mode:</strong> ${paymentMode}</p>
      <p><strong>💰 Total:</strong> ₹${total}</p>
      <p><strong>📦 Items:</strong></p>
      <ul style="padding-left: 20px; color: #555;">${formattedItems}</ul>
      <hr style="margin: 30px 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; font-size: 14px; color: #777;">With gratitude and light, <br> Team Eraya Ratna 🕉️</p>
    </div>
  </div>
`,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const user = req.user;

    const orders = await Order.find({ user: user._id })
      .populate("items.product")
      .sort({ orderedAt: -1 });

    // Attach full address from user's embedded addresses
    const response = orders.map((order) => {
      const matchedAddress = user.addresses.find(
        (addr) => addr._id.toString() === order.address.toString()
      );
      return {
        ...order.toObject(),
        address: matchedAddress || null,
      };
    });

    res.json(response);
  } catch (err) {
    console.error("Error in getUserOrders:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    const now = new Date();
    const placedTime = new Date(order.orderedAt);
    const diffHours = (now - placedTime) / (1000 * 60 * 60);

    if (diffHours > 24) {
      return res.status(400).json({ message: "Cannot cancel after 24 hours" });
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    order.cancelledBy = "User";
    await order.save();

    // 🔔 Send cancellation email to admin
    const user = req.user;
    if (!user.addresses) user.addresses = [];

    const matchedAddress = user.addresses.find(
      (addr) => addr._id.toString() === order.address.toString()
    );

    const formattedAddress = matchedAddress
      ? `${matchedAddress.fullName}, ${matchedAddress.street}, ${matchedAddress.city}, ${matchedAddress.state} - ${matchedAddress.pin}`
      : "Address not found";

    const formattedItems = order.items
      .map(
        (item) =>
          `<li>${item.product.name} × ${item.qty} = ₹${
            item.product.price * item.qty
          }</li>`
      )
      .join("");

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "❌ Order Cancelled by Customer",
      html: `
  <div style="background: #fffaf7; padding: 30px; font-family: 'Georgia', serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
      <h2 style="text-align: center; color: #b83280;">❌ An Order Has Been Cancelled</h2>
      <p style="color: #444; font-size: 16px;">A mindful cancellation has occurred.</p>
      <p><strong>🧘 Customer:</strong> ${user.name} (${user.email})</p>
      <p><strong>🪪 Order ID:</strong> ${order._id}</p>
      <p><strong>🏡 Address:</strong> ${formattedAddress}</p>
      <p><strong>🧾 Items:</strong></p>
      <ul style="padding-left: 20px; color: #555;">${formattedItems}</ul>
      <p><strong>🕰️ Cancelled At:</strong> ${order.cancelledAt.toLocaleString()}</p>
      <hr style="margin: 30px 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; font-size: 14px; color: #777;">Let go and flow. <br> — Eraya Ratna 🌺</p>
    </div>
  </div>
`,
    });

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    // Step 1: Fetch orders with full user + product data
    const rawOrders = await Order.find()
      .populate("user", "name email addresses") // include addresses too
      .populate("items.product")
      .sort({ createdAt: -1 });

    // Step 2: Match the embedded address manually
    const orders = rawOrders.map((order) => {
      const user = order.user;
      const addressObj = user.addresses?.find(
        (addr) => addr._id.toString() === order.address.toString()
      );

      return {
        ...order.toObject(),
        address: addressObj || null,
      };
    });

    res.json(orders);
  } catch (err) {
    console.error("Error in getAllOrders:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    const previousStatus = order.status;
    const newStatus = req.body.status;

    // Update status
    order.status = newStatus;

    // ✅ If admin is cancelling, record additional info
    if (newStatus === "Cancelled") {
      order.cancelledAt = new Date();
      order.cancelledBy = "Admin";
      order.cancellationReason = req.body.reason || "No reason provided";
    }

    await order.save({ validateBeforeSave: false });

    // ✅ Notify user by email about status change
    const clientName = order.user.name;
    const clientEmail = order.user.email;
    const orderId = order._id;
    const websiteLink = process.env.CLIENT_BASE_URL || "https://your-site.com";

    await sendEmail({
      to: clientEmail,
      subject: `🛍️ Order Status Update [${orderId
        .toString()
        .slice(-6)
        .toUpperCase()}]`,
      html: `
  <div style="background: #fdf7f3; padding: 30px; font-family: 'Georgia', serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
      <h2 style="text-align: center; color: #b83280;">🕊️ Order Update from Eraya Ratna</h2>
      <p style="font-size: 16px; color: #444;">Dear ${clientName},</p>
      <p>Your order <strong>#${orderId
        .toString()
        .slice(-6)
        .toUpperCase()}</strong> has a new update:</p>
      <p><strong>Status:</strong> ${previousStatus} ➡️ <strong>${newStatus}</strong></p>
      ${
        newStatus === "Cancelled"
          ? `<p><strong>Reason:</strong> ${order.cancellationReason}</p>`
          : ""
      }
      <p>🧾 You can track your journey here:</p>
      <p><a href="${websiteLink}/orders" style="color: #b83280; font-weight: bold;">🔗 View My Orders</a></p>
      <hr style="margin: 30px 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; font-size: 14px; color: #777;">
        With gratitude and calm, <br> Team Eraya Ratna 🌸
      </p>
    </div>
  </div>
`,
    });

    res.json({ message: "Status updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
