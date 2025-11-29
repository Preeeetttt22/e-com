import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllCategories } from "../../services/categoryService";
import { getAllProducts, updateFeaturedProducts } from "../../services/productService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const HomepageProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      setCategories(res);
      setSelectedCategory(res[0]?._id || "");
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory) {
        const res = await getAllProducts({ category: selectedCategory });
        setProducts(res);
        const featured = res.filter(p => p.isFeaturedOnHome).map(p => p._id);
        setTopProducts(featured);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const toggleTopProduct = (id) => {
    setTopProducts((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const saveSelection = async () => {
    try {
      await updateFeaturedProducts({ categoryId: selectedCategory, productIds: topProducts });
      toast.success("🌸 Homepage blessings updated!");
    } catch (error) {
      toast.error("❌ Failed to update featured products.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f8] via-[#fef9ef] to-[#f7f7ff] p-6 text-gray-700">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className="text-4xl font-extrabold tracking-tight text-rose-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🌼 Homepage Top Products
        </motion.h1>
      </div>

      {/* Category Selection */}
      <motion.div
        className="flex items-center gap-4 bg-white p-4 rounded-lg shadow max-w-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <label className="text-lg font-medium text-gray-700">🗂️ Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-rose-400 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
      >
        {products.map((p, index) => (
          <motion.div
            key={p._id}
            onClick={() => toggleTopProduct(p._id)}
            className={`cursor-pointer p-5 rounded-xl border-2 shadow-md transform hover:scale-[1.03] transition-all duration-300 ${
              topProducts.includes(p._id)
                ? "border-rose-500 bg-rose-50 shadow-rose-200"
                : "border-gray-200 bg-white"
            }`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: index * 0.05 } },
            }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{p.name}</h3>
            <p className="text-sm text-gray-500">
              {topProducts.includes(p._id)
                ? "🌟 Gracefully chosen for homepage"
                : "Click to spiritually select"}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Save Button */}
      <motion.button
        onClick={saveSelection}
        className="block mt-10 mx-auto bg-rose-600 text-white px-10 py-3 text-lg rounded-full shadow-lg hover:bg-rose-700 transition disabled:opacity-50"
        disabled={topProducts.length === 0}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        ✨ Save Blessed Picks
      </motion.button>
    </div>
  );
};

export default HomepageProducts;
