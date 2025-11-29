import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CancelReasonModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = React.useState("");

  const handleSubmit = () => {
    if (reason.trim() === "") return;
    onConfirm(reason);
    setReason("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-orange-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-orange-700 mb-4 text-center">
              🙏 Reason for Cancellation
            </h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-orange-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows="4"
              placeholder="Please enter a reason for cancelling this order..."
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CancelReasonModal;