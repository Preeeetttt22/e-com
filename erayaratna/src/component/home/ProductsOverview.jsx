import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const ProductsOverview = ({
  featuredProducts,
  onCardClick,
  onAddToCart,
  handleProtectedAction,
  navigate,
}) => (
  <section className="w-full px-6 py-14 bg-gradient-to-br from-[#FFD59F] to-[#FFB39F] rounded-2xl mt-10 shadow-2xl">
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-[#5D3A00] tracking-wide drop-shadow-sm">
          Featured Offerings
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-gradient-to-r from-[#FF9770] to-[#FF6F61] text-white px-5 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm font-medium"
        >
          View All Products
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product) => (
            <motion.div
              key={product._id}
              onClick={() => onCardClick(product._id)}
              className="bg-white/70 backdrop-blur-lg border border-[#FBD3C1] p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              variants={itemVariants}
            >
              <div className="h-44 bg-gradient-to-tr from-[#FFEFE8] to-[#FFF6F0] rounded-2xl mb-4 overflow-hidden flex items-center justify-center shadow-inner">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center text-[#8A2C02]">
                {product.name}
              </h3>
              <p className="text-sm text-[#6C3D00] mb-4 text-center">
                {product.description?.slice(0, 60)}...
              </p>
              <div className="flex justify-between items-center mt-auto">
                <button
                  onClick={(e) => onAddToCart(e, product._id)}
                  className="bg-[#FF6F61] text-white text-xs px-4 py-2 rounded-full hover:bg-[#e6574b] shadow-md transition"
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
                  className="text-[#8A2C02] text-xs font-medium hover:underline transition"
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-600 italic">
            No featured products available.
          </p>
        )}
      </motion.div>
    </div>
  </section>
);

export default ProductsOverview;
