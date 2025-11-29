import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./redux/authSlice";
import { getProfile } from "./services/authService";
import { useNavigate, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails.jsx";
import OrderHistory from "./pages/OrderHistory";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import Profile from "./pages/Profile";
import PaymentPage from "./pages/PaymentPage";
import Events from "./pages/Events";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/Users";
import AdminCategories from "./pages/admin/Categories";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminHomepageProducts from "./pages/admin/HomepageProducts.jsx";
import AdminEvents from "./pages/admin/AdminEvents";
import ProtectedRoute from "./protection/ProtectedRoute";
import AdminRoute from "./protection/AdminRoute";
import AdminNewsletter from "./pages/admin/AdminNewsletter.jsx";
import ThankYou from "./pages/ThankYou";
import AdminOrders from "./pages/admin/AdminOrders.jsx";

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await getProfile();
        dispatch(setCredentials({ user }));

        if (user.role === "admin") {
          navigate("/admin/admindashboard", { replace: true });
        }
      } catch (error) {
        console.log("Not logged in or session expired");
      }
    };
    fetchProfile();
  }, []);

  return (
    <Routes>
      {/* User Routes with Navbar */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="events" element={<Events />} />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="address"
          element={
            <ProtectedRoute>
              <Address />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/thank-you"
          element={
            <ProtectedRoute>
              <ThankYou />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/top-products" element={<AdminHomepageProducts />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/newsletter" element={<AdminNewsletter />} />
      </Route>
    </Routes>
  );
};

export default AppContent;
