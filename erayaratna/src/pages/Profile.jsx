import { useState } from "react";
import { updateUserProfile } from "../services/userService";
import { toast } from "react-hot-toast";
import { FaUserEdit, FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../component/Footer";
import { motion } from "framer-motion";

const Profile = () => {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({ name });
      toast.success("Username updated successfully!");
      setName("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update name");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      await updateUserProfile({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    }
  };

  const handleProtectedAction = (action) => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      action();
    }
  };

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-br from-[#FFF7EA] to-[#FFE0D3] px-6 py-10 outfit text-[#4B2E2E]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <motion.div
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 text-[#4B2E2E] hover:text-[#8A2C02] hover:underline cursor-pointer transition w-fit"
          whileHover={{ scale: 1.03 }}
        >
          <FaArrowLeft className="text-lg" />
          <span className="text-sm font-medium tracking-wide">
            Back to Home
          </span>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-center mb-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          ✨ Your Profile
        </motion.h2>

        {/* Username Change Section */}
        <motion.div
          className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 text-pink-600">
            <FaUserEdit className="text-xl" />
            <h3 className="text-xl font-semibold">Update Username</h3>
          </div>
          <form onSubmit={handleUpdateName} className="space-y-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New Username"
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white transition"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              className="w-full bg-gradient-to-r from-[#FFA07A] to-[#FF7F50] text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition"
            >
              Update Username
            </motion.button>
          </form>
        </motion.div>

        {/* Password Change Section */}
        <motion.div
          className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4 text-pink-600">
            <FaLock className="text-xl" />
            <h3 className="text-xl font-semibold">Change Password</h3>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white transition"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white transition"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white transition"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              className="w-full bg-gradient-to-r from-[#FFA07A] to-[#FF7F50] text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition"
            >
              Change Password
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Footer
        navigate={navigate}
        handleProtectedAction={handleProtectedAction}
        quote="“Your energy is sacred. Keep it safe.” 🧘‍♀️"
      />
    </motion.section>
  );
};

export default Profile;
