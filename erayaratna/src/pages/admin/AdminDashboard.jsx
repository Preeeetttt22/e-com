import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardSummary,
  fetchRevenueStats,
  fetchTopProducts,
} from "../../services/adminService";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2 },
  }),
};

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryData, revenueData, topProductsData] = await Promise.all([
          fetchDashboardSummary(),
          fetchRevenueStats(),
          fetchTopProducts(),
        ]);
        setSummary(summaryData);
        setRevenue(revenueData);
        setTopProducts(topProductsData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium text-[#5D4037]">
        Loading your divine dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#FFF4E5] to-[#FFEBE0] text-[#4E342E]">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className="text-4xl font-extrabold tracking-wide text-[#7B3F00]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Admin Dashboard 🧘‍♀️
        </motion.h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {summary &&
          Object.entries(summary).map(([key, value], index) => (
            <motion.div
              key={key}
              className="bg-white p-5 rounded-xl border border-[#FCE8D5] shadow hover:shadow-lg transition"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <h2 className="text-sm text-gray-500 capitalize">{key}</h2>
              <p className="text-3xl font-bold text-[#8B4513]">{value}</p>
            </motion.div>
          ))}
      </div>

      {/* Revenue Stats */}
      <motion.div
        className="bg-white mt-10 p-6 rounded-xl border border-[#FAD1BD] shadow-md"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <h2 className="text-2xl font-semibold text-[#6D4C41] mb-4">
          Revenue Overview 💰
        </h2>
        <p className="text-gray-700 mb-1">
          <strong>Total Revenue:</strong> ₹
          {revenue?.totalRevenue != null
            ? Number(revenue.totalRevenue).toFixed(2)
            : "0.00"}
        </p>
        <p className="text-gray-700 mb-3">
          <strong>Avg Order Value:</strong> ₹
          {revenue?.avgOrderValue != null
            ? Number(revenue.avgOrderValue).toFixed(2)
            : "0.00"}
        </p>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Monthly Stats:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {Object.entries(revenue?.revenueByMonth || {}).map(
              ([month, value]) => (
                <li key={month}>
                  {month}: ₹{value != null ? Number(value).toFixed(2) : "0.00"}
                </li>
              )
            )}
          </ul>
        </div>
      </motion.div>

      {/* Top Products */}
      <motion.div
        className="bg-white mt-10 p-6 rounded-xl border border-[#FAD1BD] shadow-md"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <h2 className="text-2xl font-semibold text-[#6D4C41] mb-4">
          🌟 Top Selling Products
        </h2>
        <ul className="space-y-4">
          {topProducts.map((product, index) => (
            <motion.li
              key={index}
              className="flex items-center space-x-4 hover:bg-[#FFF7F3] p-3 rounded-lg transition"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              {product.image && (
                <img
                  src={
                    product.image
                      ? product.image
                      : "https://via.placeholder.com/60x60?text=No+Image"
                  }
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-md border border-pink-200"
                />
              )}
              <div>
                <p className="font-semibold text-[#5D4037]">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Sold: {product.qtySold} | ₹{product.price}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
