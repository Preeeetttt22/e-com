import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../component/Navbar";
import BackToTopButton from "../component/BackToTopButton";
import LoginPromptModal from "../component/LoginPromptModal";
import IntroSection from "../component/home/IntroSection";
import ProductsOverview from "../component/home/ProductsOverview";
import UpcomingEvents from "../component/home/UpcomingEvents";
import Footer from "../component/Footer";
import { getFeaturedProducts } from "../services/productService";
import { getEventsForHome } from "../services/eventService";
import { addToCart } from "../services/cartService";
import { useDispatch } from "react-redux";
import { incrementCartCount } from "../redux/cartSlice";


const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const products = await getFeaturedProducts();
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled);

        const eventsData = await getEventsForHome();
        setEvents(eventsData.slice(0, 4)); // Only latest 4 events
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFeatured();
  }, []);

  const handleProtectedAction = (action) => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      action();
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    handleProtectedAction(async () => {
      try {
        await addToCart(productId);
        toast.success("Added to cart!");
        dispatch(incrementCartCount(1));
      } catch (err) {
        console.error("Add to Cart Error:", err);
        toast.error("Failed to add to cart.");
      }
    });
  };

  return (
    <>
      <Navbar />
      <BackToTopButton />

      <div className="mt-16 px-4 md:px-10 outfit text-[#4B2E2E]">
        <IntroSection />

        <ProductsOverview
          featuredProducts={featuredProducts}
          onCardClick={handleCardClick}
          onAddToCart={handleAddToCart}
          handleProtectedAction={handleProtectedAction}
          navigate={navigate}
        />

        <UpcomingEvents events={events} navigate={navigate} />

        {showLoginPrompt && (
          <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
        )}

        <Footer
          navigate={navigate}
          handleProtectedAction={handleProtectedAction}
          quote="“Handcrafted with energy, intention & purpose.” ✨"
        />
      </div>
    </>
  );
};

export default Home;
