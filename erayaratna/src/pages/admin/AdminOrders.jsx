import React, { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../../services/adminService";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import CancelReasonModal from "../../component/CancelReasonModal";
import { FaRegClock, FaBoxOpen, FaCheck, FaTimesCircle, FaUser } from "react-icons/fa";

const statusOptions = [
  "Pending",
  "Processing",
  "Ready",
  "Delivered",
  "Cancelled",
];

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Ready: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrders = async () => {
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === "Cancelled") {
      setSelectedOrderId(orderId);
      setShowModal(true);
    } else {
      try {
        await updateOrderStatus(orderId, { status: newStatus });
        toast.success("Status updated");
        loadOrders();
      } catch {
        toast.error("Failed to update status");
      }
    }
  };

  const handleConfirmCancel = async (reason) => {
    try {
      await updateOrderStatus(selectedOrderId, {
        status: "Cancelled",
        reason,
      });
      toast.success("Order cancelled");
      loadOrders();
    } catch {
      toast.error("Cancellation failed");
    } finally {
      setShowModal(false);
      setSelectedOrderId(null);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-[#5D4037] animate-pulse">
        🧘‍♂️ Loading divine orders...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFEBE0] to-[#FDEFE2] text-[#4E342E] font-[Outfit]">
      <motion.h1
        className="text-4xl font-bold mb-6 text-[#7B3F00] tracking-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧾 Manage Divine Orders
      </motion.h1>

      {orders.length === 0 ? (
        <div className="text-center mt-10 text-lg text-gray-500 italic">
          No orders placed yet. The universe is calm. 🧘‍♀️
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow-lg border border-orange-200"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex justify-between flex-wrap gap-4 items-start">
                <div>
                  <p className="font-semibold text-lg flex items-center gap-2">
                    <FaUser className="text-orange-500" /> {order.user?.name}
                  </p>
                  <p className="text-sm text-gray-700">{order.user?.email}</p>
                  <p className="text-sm mt-1 text-gray-700 flex items-center gap-2">
                    <FaRegClock /> {new Date(order.orderedAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#5E412F]">
                    Status:
                  </label>
                  <select
                    className={`ml-2 px-3 py-1 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 ${statusStyles[order.status]}`}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4">
                <p className="font-semibold mb-1 text-[#6D4C41]">📦 Items Ordered:</p>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {order.items.map((item) => (
                    <li key={item.product._id}>
                      {item.product.name} × {item.qty}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Address */}
              <div className="mt-4">
                <p className="font-semibold mb-1 text-[#6D4C41]">🏠 Delivery Address:</p>
                {order.address ? (
                  <p className="text-sm text-gray-700">
                    {order.address.fullName}, {order.address.street},{" "}
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.pin}
                  </p>
                ) : (
                  <p className="text-sm text-red-500">Address not found.</p>
                )}
              </div>

              {/* Total */}
              <div className="mt-4 flex justify-between items-center">
                <p className="font-semibold text-lg text-[#5D4037]">
                  💰 Total: ₹
                  {typeof order.totalPrice === "number"
                    ? order.totalPrice.toFixed(2)
                    : "0.00"}
                </p>

                {order.status === "Cancelled" && (
                  <div className="text-sm text-red-600 text-right">
                    <p>
                      <FaTimesCircle className="inline mr-1" />
                      Cancelled on:{" "}
                      {new Date(order.cancelledAt).toLocaleString()}
                    </p>
                    <p>
                      Cancelled by:{" "}
                      {order.cancelledBy === "User" ? "Customer" : "Admin"}
                    </p>
                    {order.cancelledBy === "Admin" &&
                      order.cancellationReason && (
                        <p className="italic">
                          Reason: {order.cancellationReason}
                        </p>
                      )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Custom Modal for Reason */}
      <CancelReasonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default AdminOrders;
