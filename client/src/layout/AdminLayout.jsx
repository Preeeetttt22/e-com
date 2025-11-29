import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import Cookies from 'js-cookie';
import { logoutUser } from '../services/authService';
import {
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import {
  FaUsers,
  FaThLarge,
  FaBoxOpen,
  FaStar,
  FaCalendarAlt,
  FaShoppingCart,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/admin/admindashboard', icon: <FaThLarge /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Categories', path: '/admin/categories', icon: <FaBoxOpen /> },
    { name: 'Products', path: '/admin/products', icon: <FaBoxOpen /> },
    { name: 'Top Products', path: '/admin/top-products', icon: <FaStar /> },
    { name: 'Events', path: '/admin/events', icon: <FaCalendarAlt /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaShoppingCart /> },
    { name: 'Newsletter', path: '/admin/newsletter', icon: <FaBoxOpen /> },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      Cookies.remove('token');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#f9f4f2] via-[#fffaf7] to-[#f3f9f7] text-[#2e3d49] font-[Georgia,serif]">
      {/* 🌸 Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-pink-600 to-purple-700 text-white shadow-lg">
        <h2 className="text-xl font-bold tracking-wide">🌟 Eraya Admin</h2>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="md:hidden bg-white text-gray-800 p-5 space-y-4 shadow-lg border-b border-pink-200 z-50"
          >
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 shadow'
                      : 'hover:bg-pink-50'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
            >
              <FiLogOut />
              Logout
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 🌿 Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-br from-indigo-800 to-purple-700 text-white p-6 flex-col shadow-xl">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">
            🌟 Admin Portal
          </h2>
          <nav className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium ${
                  location.pathname === link.path
                    ? 'bg-white text-indigo-700 shadow-inner'
                    : 'hover:bg-indigo-600'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* 🌼 Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
