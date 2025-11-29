import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../component/Footer";
import {
  getUserAddresses,
  addUserAddress,
  setDefaultAddress,
  deleteUserAddress,
} from "../services/addressService";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getUserAddresses();
        setAddresses(res);
      } catch (error) {
        toast.error("Failed to load addresses.");
      }
    };
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addUserAddress(form);
      const updated = await getUserAddresses();
      setAddresses(updated);
      setForm({
        fullName: "",
        mobileNumber: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        isDefault: false,
      });
      toast.success("Address added!");
    } catch (error) {
      toast.error("Failed to add address.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      const updated = addresses.map((addr) => ({
        ...addr,
        isDefault: addr._id === id,
      }));
      setAddresses(updated);
      toast.success("Default address updated!");
    } catch (error) {
      toast.error("Failed to update default address.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserAddress(id);
      setAddresses(addresses.filter((addr) => addr._id !== id));
      toast.success("Address removed!");
    } catch (error) {
      toast.error("Failed to remove address.");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FFF7EA] to-[#FFE0D3] px-4 py-8 outfit text-[#4B2E2E]">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home */}
        <motion.div
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-[#4B2E2E] hover:text-[#8A2C02] hover:underline cursor-pointer transition w-fit"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaArrowLeft className="text-lg" />
          <span className="text-sm font-medium tracking-wide">
            Back to Home
          </span>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          📍 Your Delivery Addresses
        </motion.h2>

        {/* Saved Addresses */}
        <div className="space-y-6">
          {Array.isArray(addresses) && addresses.length > 0 ? (
            addresses.map((addr, i) => (
              <motion.div
                key={addr._id}
                className={`p-5 rounded-2xl shadow-md border ${
                  addr.isDefault ? "border-pink-600" : "border-[#FFD59F]"
                } bg-white/70 backdrop-blur-md`}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{addr.fullName}</h3>
                    <p className="text-gray-700 text-sm mt-1">
                      {addr.street}, {addr.city}, {addr.state} -{" "}
                      {addr.postalCode}, {addr.country}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      📞 {addr.mobileNumber}
                    </p>
                  </div>
                  <div className="text-right text-sm space-y-1">
                    {addr.isDefault ? (
                      <span className="text-pink-600 font-semibold">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(addr._id)}
                        className="text-blue-600 hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="text-red-600 hover:underline block"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-center text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No addresses found.
            </motion.p>
          )}
        </div>

        {/* Add New Address Form */}
        <motion.div
          className="mt-10 bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-[#FFD59F]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            ➕ Add New Address
          </h3>
          <form
            onSubmit={handleAddAddress}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              { name: "fullName", placeholder: "Full Name" },
              { name: "mobileNumber", placeholder: "Phone Number" },
              { name: "street", placeholder: "Street Address" },
              { name: "city", placeholder: "City" },
              { name: "state", placeholder: "State" },
              { name: "postalCode", placeholder: "Postal Code" },
              { name: "country", placeholder: "Country" },
            ].map((field, idx) => (
              <motion.input
                key={field.name}
                type="text"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="border px-3 py-2 rounded-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              />
            ))}

            <label className="flex items-center space-x-2 md:col-span-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />
              <span className="text-sm">Set as default</span>
            </label>

            <motion.button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition md:col-span-2"
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "Adding..." : "Add Address"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Footer
        navigate={navigate}
        handleProtectedAction={() => {}}
        quote="“A peaceful home begins with a sacred address.” 🕊️"
      />
    </section>
  );
};

export default Address;
