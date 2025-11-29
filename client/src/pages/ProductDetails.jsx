import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { addToCart } from "../services/cartService";
import { getProductById, getAllProducts } from "../services/productService";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../component/Footer";
import { motion } from "framer-motion";
import LoginPromptModal from "../component/LoginPromptModal";
import { useDispatch } from "react-redux";
import { incrementCartCount } from "../redux/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);

        const allProducts = await getAllProducts();
        const similar = allProducts.filter(
          (p) =>
            p._id !== id &&
            p.tags?.some((tag) => fetchedProduct.tags?.includes(tag))
        );
        setSimilarProducts(similar);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = (productId) => {
    handleProtectedAction(async () => {
      try {
        await addToCart(productId);
        toast.success("Product added to cart!");
        dispatch(incrementCartCount(1));
      } catch (error) {
        toast.error("Failed to add to cart");
      }
    });
  };

  if (!product)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-10"
      >
        Loading product details...
      </motion.p>
    );

  const handleProtectedAction = (action) => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      action();
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FFF6F0] to-[#E8F2FF] p-6 text-[#4B2E2E] outfit">
      {/* Back to Home */}
      <motion.div
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 text-[#4B2E2E] hover:text-[#8A2C02] hover:underline cursor-pointer transition w-fit"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <FaArrowLeft className="text-lg" />
        <span className="text-sm font-medium tracking-wide">Back to Home</span>
      </motion.div>

      {/* Main Product Display */}
      <motion.div
        className="flex flex-col lg:flex-row gap-10 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="w-full max-w-md h-auto object-cover rounded-xl shadow-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <div className="flex-1 space-y-4">
          <motion.h1
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {product.name}
          </motion.h1>
          <motion.p
            className="text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {product.description}
          </motion.p>

          {product.tags?.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {product.tags.map((tag, idx) => (
                <motion.span
                  key={idx}
                  className="text-xs bg-[#FFF3E0] text-[#8A2C02] px-2 py-1 rounded-full"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  🔮 {tag}
                </motion.span>
              ))}
            </motion.div>
          )}

          <motion.p
            className="text-3xl text-pink-600 font-bold mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ₹{product.price}
          </motion.p>

          <motion.div
            className="flex gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => handleAddToCart(product._id)}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() =>
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
                )
              }
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Buy Now
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Similar Products */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4">🧿 Similar Products</h2>
        {similarProducts.length > 0 ? (
          <motion.div
            className="flex gap-6 overflow-x-auto pb-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {similarProducts.map((sp) => (
              <motion.div
                key={sp._id}
                onClick={() => navigate(`/product/${sp._id}`)}
                className="min-w-[220px] bg-white/90 p-4 rounded-2xl shadow backdrop-blur-md hover:shadow-lg transition cursor-pointer"
                whileHover={{ scale: 1.02 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <img
                  src={sp.images[0]}
                  alt={sp.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="text-md font-semibold mb-1">{sp.name}</h3>
                <p className="text-pink-600 font-bold mb-2">₹{sp.price}</p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click navigation
                      handleAddToCart(sp._id);
                    }}
                    className="flex-1 text-sm bg-gray-200 text-gray-800 py-1 rounded hover:bg-gray-300"
                  >
                    Cart
                  </button>
                  <button
                    onClick={() =>
                      handleProtectedAction(() =>
                        navigate("/payment", {
                          state: {
                            type: "BUY_NOW",
                            product: {
                              _id: similar._id,
                              name: similar.name,
                              price: similar.price,
                              image: similar.images?.[0],
                              qty: 1,
                            },
                          },
                        })
                      )
                    }
                    className="flex-1 text-sm bg-pink-600 text-white py-1 rounded hover:bg-pink-700"
                  >
                    Buy
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            className="text-gray-500 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No similar products found.
          </motion.p>
        )}
      </motion.div>
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}

      <Footer
        navigate={navigate}
        handleProtectedAction={handleProtectedAction}
        quote="“Let each product be a blessing that brings light, love, and harmony to your home.” 🕊️"
      />
    </section>
  );
};

export default ProductDetails;
