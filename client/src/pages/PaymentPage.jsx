import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserAddresses } from "../services/addressService";
import { createOrder } from "../services/orderService";
import { fetchCartCount } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaGift,
  FaShippingFast,
} from "react-icons/fa";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = location.state;

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressOptions, setShowAddressOptions] = useState(false);

  useEffect(() => {
    if (!state || (!state.product && !state.products)) {
      navigate("/products");
      return;
    }

    if (state.type === "BUY_NOW") {
      setSelectedProducts([state.product]);
    } else if (state.type === "FROM_CART") {
      setSelectedProducts(state.products);
    }

    const fetchAddresses = async () => {
      try {
        const res = await getUserAddresses();
        setAddresses(res);
        const defaultAddr = res.find((a) => a.isDefault);
        setSelectedAddressId(defaultAddr ? defaultAddr._id : res[0]?._id || "");
      } catch (err) {
        console.error("Error fetching addresses:", err);
        toast.error("Failed to load addresses");
      }
    };
    fetchAddresses();
  }, [state, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedProducts.length) {
      toast.error("Missing address or products");
      return;
    }

    try {
      const payload = {
        address: selectedAddressId,
        items: selectedProducts.map((p) => ({
          productId: p._id,
          qty: p.qty,
        })),
        paymentMode: "Cash on Delivery",
      };

      await createOrder(payload);
      if (state.type === "FROM_CART") dispatch(fetchCartCount());
      navigate("/thank-you");
    } catch (err) {
      toast.error("Failed to place order");
      console.error("Order error:", err);
    }
  };

  const formatDate = (d) =>
    d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const total = selectedProducts.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  return (
    <section className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#FFF7EA] to-[#FFE0D3] outfit text-[#4B2E2E]">
      <motion.div
        className="max-w-4xl mx-auto space-y-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Add this just below */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFCF9F] to-[#FFC1B6] text-[#5D3A00] font-medium rounded-full shadow hover:shadow-lg hover:scale-105 transition-all"
          >
            🕊️ Back to Home
          </button>
        </motion.div>
        <motion.h2
          className="text-4xl font-bold text-center text-[#6B2E15]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          🛒 Confirm Your Order
        </motion.h2>

        {/* Products */}
        <motion.div className="space-y-4">
          <h3 className="text-xl font-semibold">🎁 Selected Items</h3>
          {selectedProducts.map((p) => (
            <motion.div
              key={p._id}
              className="flex justify-between items-center p-4 bg-white/70 rounded-xl shadow border border-[#FFD59F] backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-600">Qty: {p.qty}</p>
                  <p className="text-sm text-gray-600">Price: ₹{p.price}</p>
                </div>
              </div>
              <div className="font-bold text-pink-700">₹{p.qty * p.price}</div>
            </motion.div>
          ))}
          <p className="text-right font-bold text-lg text-pink-700">
            Total: ₹{total}
          </p>
        </motion.div>

        {/* Address */}
        <motion.div className="space-y-2">
          <h3 className="text-xl font-semibold">📍 Delivery Address</h3>

          {!showAddressOptions && (
            <div className="bg-white/80 p-4 rounded-xl border border-[#FFE2C0] shadow backdrop-blur">
              {addresses.find((a) => a._id === selectedAddressId) ? (
                <>
                  <p className="font-medium flex items-center gap-2">
                    <FaMapMarkerAlt />{" "}
                    {
                      addresses.find((a) => a._id === selectedAddressId)
                        .fullName
                    }
                  </p>
                  <p className="text-sm text-gray-700">
                    {addresses.find((a) => a._id === selectedAddressId).street},{" "}
                    {addresses.find((a) => a._id === selectedAddressId).city},{" "}
                    {addresses.find((a) => a._id === selectedAddressId).state} -{" "}
                    {
                      addresses.find((a) => a._id === selectedAddressId)
                        .postalCode
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <FaPhone />{" "}
                    {
                      addresses.find((a) => a._id === selectedAddressId)
                        .mobileNumber
                    }
                  </p>
                </>
              ) : (
                <p className="text-gray-600">No address selected</p>
              )}
              {addresses.length > 1 && (
                <button
                  onClick={() => setShowAddressOptions(true)}
                  className="text-sm mt-2 text-blue-600 hover:underline"
                >
                  Change Address
                </button>
              )}
            </div>
          )}

          {showAddressOptions && (
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`cursor-pointer p-4 rounded-xl border-2 shadow backdrop-blur-sm bg-white/70 transition-all duration-200 ${
                    selectedAddressId === addr._id
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddressId === addr._id}
                    onChange={() => {
                      setSelectedAddressId(addr._id);
                      setShowAddressOptions(false);
                    }}
                    className="sr-only"
                  />
                  <div className="text-sm text-[#4B2E2E] space-y-1">
                    <p className="font-medium">{addr.fullName}</p>
                    <p>
                      {addr.street}, {addr.city}, {addr.state} -{" "}
                      {addr.postalCode}
                    </p>
                    <p className="text-xs text-gray-600">
                      📞 {addr.mobileNumber}
                    </p>
                  </div>
                </label>
              ))}
              <div className="sm:col-span-2 flex justify-center">
                <button
                  onClick={() => setShowAddressOptions(false)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Delivery & Payment Info */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-4 bg-white/80 rounded-xl border border-[#FFD59F] shadow backdrop-blur">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-[#6B2E15]">
              <FaShippingFast /> Expected Delivery
            </h4>
            <p>
              Between{" "}
              {formatDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000))} and{" "}
              {formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}
            </p>
          </div>
          <div className="p-4 bg-white/80 rounded-xl border border-[#FFD59F] shadow backdrop-blur">
            <h4 className="font-semibold mb-2 text-[#6B2E15]">
              💰 Payment Method
            </h4>
            <p>Cash on Delivery</p>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={handlePlaceOrder}
            className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 shadow-md transition"
          >
            Place Order
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PaymentPage;
