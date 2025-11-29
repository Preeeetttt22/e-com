import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const LoginPromptModal = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, onClose]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        className="bg-gradient-to-br from-[#FFF3E2] to-[#FFE0D3] border-2 border-[#FFD59F] text-[#4B2E2E] px-8 py-6 rounded-3xl shadow-2xl text-center max-w-sm w-full"
      >
        <div className="flex flex-col items-center gap-3">
          <FaUserCircle className="text-5xl text-[#FF8A65]" />

          <h2 className="text-xl font-bold">Login Required</h2>
          <p className="text-sm text-[#6C3D00]">
            To access this feature, please log in to your account. <br />
            Redirecting you shortly...
          </p>

          <div className="mt-4 w-full flex justify-center">
            <span className="text-xs text-[#8A2C02] italic animate-pulse">
              Redirecting in 2 seconds ⏳
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPromptModal;
