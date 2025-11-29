import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ThankYou = () => {
  const navigate = useNavigate();

  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);
  start.setDate(start.getDate() + 1);
  end.setDate(end.getDate() + 7);

  const formatDate = (d) =>
    d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-[#FFFBEA] via-[#FFF0F5] to-[#E7FBEA] text-[#4B2E2E] outfit"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="max-w-xl w-full space-y-8 bg-white/70 p-10 rounded-3xl backdrop-blur-md border border-[#FFD59F] shadow-lg"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Heading */}
        <motion.h1
          className="text-4xl font-bold text-[#7B3F00]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          🎉 Thank You for Your Order!
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-lg text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your sacred items are on their way. We’ll notify you once they ship. 🌸
        </motion.p>

        {/* Delivery Estimate */}
        <motion.div
          className="text-base text-green-700 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🚚 Expected Delivery:
          <br />
          <span className="text-[#005A4E] font-semibold text-lg">
            {formatDate(start)} – {formatDate(end)}
          </span>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => navigate("/products")}
            className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition shadow-md"
          >
            🛍️ Continue Shopping
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition shadow-md"
          >
            📦 See Order Details
          </button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default ThankYou;
