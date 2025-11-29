import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Event from "../models/Event.js";
import Order from "../models/Order.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    if (typeof isAdmin === "boolean") user.isAdmin = isAdmin;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const [userCount, productCount, categoryCount, eventCount, orderCount] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Category.countDocuments(),
        Event.countDocuments(),
        Order.countDocuments(),
      ]);

    res.status(200).json({
      users: userCount,
      products: productCount,
      categories: categoryCount,
      events: eventCount,
      orders: orderCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch summary stats", error: err.message });
  }
};

export const getRevenueStats = async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: true });

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    const revenueByMonth = {};

    orders.forEach((order) => {
      const month = new Date(order.paidAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalPrice;
    });

    res.json({
      totalRevenue,
      avgOrderValue,
      revenueByMonth,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch revenue stats", error: err.message });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          qtySold: { $sum: "$items.qty" },
        },
      },
      { $sort: { qtySold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$productDetails._id",
          name: "$productDetails.name",
          image: { $arrayElemAt: ["$productDetails.images", 0] },
          price: "$productDetails.price", // ✅ include price
          qtySold: 1, // ✅ already renamed in group stage
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    console.error("Error in getTopProducts:", err.message);
    res.status(500).json({ message: "Failed to fetch top products" });
  }
};
