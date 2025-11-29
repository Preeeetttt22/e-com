import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";
import { toast } from "react-hot-toast";
import { addToCart } from "../services/cartService";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../component/Footer";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import LoginPromptModal from "../component/LoginPromptModal";
import { useDispatch } from "react-redux";
import { incrementCartCount } from "../redux/cartSlice";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const dispatch = useDispatch();

  const handleProtectedAction = (action) => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      action();
    }
  };

  // handleAddToCart
  const handleAddToCart = (productId) => {
    handleProtectedAction(async () => {
      try {
        await addToCart(productId);
        toast.success("Added to cart!");
        dispatch(incrementCartCount(1));
      } catch (err) {
        toast.error("Failed to add to cart.");
      }
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res);
        setSelectedCategory(res[0]?._id || "");
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory) {
        try {
          const res = await getProducts({ category: selectedCategory });
          setProducts(res);
        } catch (err) {
          console.error("Failed to fetch products", err);
        }
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FFF6F0] to-[#F1EDF8] text-[#4B2E2E] outfit">
      <div className="max-w-7xl mx-auto flex px-4 py-10 gap-6">
        {/* Sidebar */}
        {/* Sidebar for Desktop */}
        <motion.aside
          className="w-1/4 hidden md:block"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">🧿 Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`cursor-pointer px-3 py-2 rounded-lg transition font-medium ${
                  selectedCategory === cat._id
                    ? "bg-[#FFEFE8] text-[#8A2C02] font-bold shadow"
                    : "hover:bg-white/70 hover:shadow"
                }`}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Back to Home */}
          <motion.div
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-[#4B2E2E] hover:text-[#8A2C02] hover:underline cursor-pointer transition w-fit"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <FaArrowLeft className="text-lg" />
            <span className="text-sm font-medium tracking-wide">
              Back to Home
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="text-3xl font-bold mb-6 text-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            🛍️ Our Divine Collection
          </motion.h2>
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="md:hidden w-full mb-6"
          >
            <label className="block text-sm font-semibold text-indigo-700 mb-2 tracking-wide">
              🌼 Select a Category to Work With
            </label>

            <div className="relative rounded-lg shadow-md bg-gradient-to-br from-white to-indigo-50 p-[2px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none px-4 py-2 rounded-md bg-white text-gray-800 font-medium shadow-inner border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.198l3.71-3.97a.75.75 0 111.1 1.02l-4.25 4.54a.75.75 0 01-1.1 0l-4.25-4.54a.75.75 0 01.02-1.06z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white/90 p-4 rounded-2xl shadow-md backdrop-blur-lg hover:shadow-xl transition cursor-pointer"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-pink-600 font-bold mb-3">₹{product.price}</p>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click
                      handleAddToCart(product._id);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-1 rounded hover:bg-gray-300 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProtectedAction(() =>
                        navigate("/payment", {
                          state: {
                            type: "BUY_NOW",
                            product: {
                              _id: product._id,
                              name: product.name,
                              price: product.price,
                              image: product.images?.[0],
                              qty: 1,
                            },
                          },
                        })
                      );
                    }}
                    className="flex-1 bg-pink-600 text-white py-1 rounded hover:bg-pink-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}

      {/* Footer */}
      <Footer
        navigate={navigate}
        handleProtectedAction={() => {}}
        quote="“In every item lies a little joy and a lot of peace.” 🌸"
      />
    </section>
  );
};

export default Products;
