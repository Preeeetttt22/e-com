import { useState, useEffect } from "react";
import { getMyOrders, cancelOrder } from "../services/orderService";
import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../component/Footer";
import { motion } from "framer-motion";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to load your orders");
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order");
    }
  };

  return (
    <section className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#FFF9ED] to-[#FFEBE0] outfit text-[#4B2E2E]">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-[#5D4037] hover:text-[#8A2C02] hover:underline cursor-pointer transition w-fit"
        >
          <FaArrowLeft className="text-lg" />
          <span className="text-sm font-medium tracking-wide">Back to Home</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-4xl font-bold text-center mb-10 text-[#7B3F00]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          🧾 Your Divine Orders
        </motion.h2>

        {orders.length === 0 ? (
          <motion.p
            className="text-center text-gray-600 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            You haven't placed any orders yet. The journey is just beginning. 🌱
          </motion.p>
        ) : (
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {orders.map((order) => {
              const total = order.items.reduce(
                (acc, item) => acc + item.product.price * item.qty,
                0
              );

              const placedTime = new Date(order.orderedAt);
              const now = new Date();
              const diffHours = (now - placedTime) / (1000 * 60 * 60);
              const canCancel = diffHours <= 24 && order.status === "Pending";

              const deliveryStart = new Date(placedTime);
              const deliveryEnd = new Date(placedTime);
              deliveryStart.setDate(deliveryStart.getDate() + 1);
              deliveryEnd.setDate(deliveryEnd.getDate() + 7);

              const formatDate = (d) =>
                d.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

              return (
                <motion.div
                  key={order._id}
                  className="bg-white/80 backdrop-blur-md border border-[#FFD59F] p-6 rounded-3xl shadow-xl hover:shadow-2xl transition"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-[#5D4037]">
                        📜 Order: #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(placedTime)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-4 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="mb-3 text-sm">
                    <p className="text-gray-600">📍 Delivered To:</p>
                    <p className="font-medium text-gray-800">
                      {order.address?.fullName}, {order.address?.street},{" "}
                      {order.address?.city}, {order.address?.state} -{" "}
                      {order.address?.pin}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-[#FFD59F]/50 text-sm">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2"
                      >
                        <div>
                          <p className="text-gray-700">
                            {item.product.name} × {item.qty}
                          </p>
                          <p className="text-gray-500 text-xs">
                            ₹{item.product.price} each
                          </p>
                        </div>
                        <div className="font-semibold text-[#B05050]">
                          ₹{item.qty * item.product.price}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-3 text-sm text-gray-600">
                    {order.status === "Delivered" && order.updatedAt ? (
                      <p className="text-green-700">
                        ✅ Delivered on {formatDate(new Date(order.updatedAt))}
                      </p>
                    ) : order.status === "Cancelled" ? (
                      <>
                        <p className="text-red-700">❌ Cancelled</p>
                        {order.cancelledBy === "Admin" &&
                          order.cancellationReason && (
                            <p className="text-sm text-red-500 italic mt-1">
                              Reason by Admin: {order.cancellationReason}
                            </p>
                          )}
                      </>
                    ) : (
                      <p>
                        🚚 Expected between {formatDate(deliveryStart)} –{" "}
                        {formatDate(deliveryEnd)}
                      </p>
                    )}
                  </div>

                  {/* Total & Cancel */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#FFD59F]/50">
                    <div className="font-bold text-lg text-[#6D1B7B]">
                      Total: ₹{total.toLocaleString("en-IN")}
                    </div>
                    {canCancel ? (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="text-sm bg-red-100 text-red-700 px-4 py-1 rounded-full hover:bg-red-200 transition"
                      >
                        Cancel Order
                      </button>
                    ) : order.status === "Pending" ? (
                      <p className="text-xs text-gray-500 italic">
                        Cancellation available within 24 hours.
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        Cannot cancel this order.
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <Footer
        navigate={navigate}
        handleProtectedAction={() => {}}
        quote="“Each purchase is a step toward balance and beauty.” 🕉️"
      />
    </section>
  );
};

export default OrderHistory;
