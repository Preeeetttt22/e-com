import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../component/Footer";
import {
  getCart,
  updateCartItem,
  removeFromCart,
} from "../services/cartService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await getCart();
        setCartItems(res.items || []);
      } catch (error) {
        toast.error("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(cartItemId, { quantity: newQuantity });
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("Quantity updated!");
    } catch (error) {
      toast.error("Failed to update quantity.");
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
      toast.success("Item removed from cart!");
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  const getTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

  const handleProceedToPayment = () => {
    const selectedProducts = cartItems
      .filter((item) => selectedItemIds.includes(item._id))
      .map((item) => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images[0],
        qty: item.quantity,
      }));

    if (selectedProducts.length === 0) {
      toast.error("Select at least one item to proceed");
      return;
    }

    navigate("/payment", {
      state: {
        type: "FROM_CART",
        products: selectedProducts,
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FFF5EC] to-[#FFE5E0] px-4 py-10 outfit text-[#4B2E2E]">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-[#4B2E2E] hover:text-[#8A2C02] hover:underline cursor-pointer transition w-fit"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaArrowLeft className="text-lg" />
          <span className="text-sm font-medium tracking-wide">
            Back to Home
          </span>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🛒 Your Cart
        </motion.h2>

        {loading ? (
          <motion.p
            className="text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading...
          </motion.p>
        ) : cartItems.length === 0 ? (
          <motion.p
            className="text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Your cart is empty. 🕊️
          </motion.p>
        ) : (
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cartItems.map(({ _id, product, quantity }) => (
              <motion.div
                key={_id}
                className="flex flex-col md:flex-row items-center gap-4 bg-white/80 backdrop-blur-lg border border-[#FFD59F] p-4 rounded-2xl shadow"
                variants={itemVariants}
              >
                <input
                  type="checkbox"
                  checked={selectedItemIds.includes(_id)}
                  onChange={(e) => {
                    setSelectedItemIds((prev) =>
                      e.target.checked
                        ? [...prev, _id]
                        : prev.filter((id) => id !== _id)
                    );
                  }}
                  className="mr-4"
                />
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1 w-full">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Price: ₹{product.price}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => handleQuantityChange(_id, quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="min-w-[30px] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(_id, quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemove(_id)}
                      className="ml-4 text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right text-pink-600 font-semibold w-24 mt-2 md:mt-0">
                  ₹{product.price * quantity}
                </div>
              </motion.div>
            ))}

            {/* Total Section */}
            <motion.div
              className="flex justify-between items-center bg-white/90 p-4 rounded-xl shadow border border-[#FFD59F]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-semibold text-xl">Total:</span>
              <span className="text-pink-600 text-xl font-bold">
                ₹{getTotal()}
              </span>
            </motion.div>

            {/* Payment CTA */}
            <motion.div
              className="text-right"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleProceedToPayment}
                disabled={selectedItemIds.length === 0}
                className={`${
                  selectedItemIds.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-[#ff9472] hover:scale-105"
                } text-white px-6 py-3 rounded-xl font-medium shadow-lg transition`}
              >
                Proceed to Payment 💸
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      <Footer
        navigate={navigate}
        handleProtectedAction={() => {}}
        quote="“You don't need more things, you need the right things.” 🧘‍♂️"
      />
    </section>
  );
};

export default Cart;
