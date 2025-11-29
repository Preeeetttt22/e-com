import { motion } from "framer-motion";

const Footer = ({ navigate, handleProtectedAction, quote }) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="mt-16 px-4 py-10 bg-gradient-to-br from-[#FFEBDA] to-[#FFF5EF] text-[#5C3A00] text-center rounded-t-3xl shadow-inner"
    >
      <motion.p
        className="text-xl font-semibold mb-3 italic"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2 }}
      >
        {quote || "“Handcrafted with energy, intention & purpose.” ✨"}
      </motion.p>

      <motion.div
        className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { label: "Home", onClick: () => navigate("/") },
          { label: "Products", onClick: () => navigate("/products") },
          { label: "Events", onClick: () => navigate("/events") },
        ].map((btn, idx) => (
          <motion.button
            key={idx}
            onClick={btn.onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="hover:underline cursor-pointer"
          >
            {btn.label}
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        className="mt-6 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.6 }}
      >
        For inquiries, blessings or support:{" "}
        <a
          href="mailto:erayaratna@gmail.com"
          className="text-pink-600 hover:underline"
        >
          erayaratna@gmail.com
        </a>
      </motion.p>

      <motion.p
        className="mt-4 text-xs text-[#7A4B2C]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.8 }}
      >
        Designed & Developed by{" "}
        <a
          href="https://jeetmistry.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 font-semibold hover:underline"
        >
          Jeet Mistry
        </a>
      </motion.p>

      <motion.p
        className="mt-2 text-xs text-[#96724E]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} Eraya RATNA. All rights reserved.
      </motion.p>
    </motion.footer>
  );
};

export default Footer;
