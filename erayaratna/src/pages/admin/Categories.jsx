import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { motion } from "framer-motion";
import {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  toggleCategoryStatus,
} from "../../services/categoryService";
import { FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.15 },
  }),
};

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({ name: "", description: "" });

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const data = await addCategory(newCategory);
      setCategories([data, ...categories]);
      setNewCategory({ name: "", description: "" });
      toast.success("Category added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const data = await toggleCategoryStatus(id);
      setCategories(
        categories.map((c) =>
          c._id === id ? { ...c, isActive: data.isActive } : c
        )
      );
      toast.success("Status updated");
    } catch {
      toast.error("Toggle failed");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setFormState({ name: cat.name, description: cat.description });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormState({ name: "", description: "" });
  };

  const saveEdit = async (id) => {
    try {
      const data = await updateCategory(id, formState);
      setCategories(categories.map((c) => (c._id === id ? data : c)));
      cancelEdit();
      toast.success("Category updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleFormChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-tr from-[#FFF3E0] via-[#FFE0EC] to-[#FAF3DD] text-[#4B2E2E]">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className="text-4xl font-extrabold tracking-wide text-[#BF5F82]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🌼 Admin Category Management
        </motion.h1>
      </div>

      {/* Add Category Form */}
      <motion.form
        onSubmit={handleAddCategory}
        className="bg-white/90 p-6 rounded-2xl shadow max-w-xl border border-rose-100 space-y-4"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <h2 className="text-xl font-semibold text-rose-600">➕ Add New Category</h2>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          required
          className="w-full border border-rose-200 rounded px-3 py-2 focus:ring-2 focus:ring-rose-300 outline-none"
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          className="w-full border border-rose-200 rounded px-3 py-2 focus:ring-2 focus:ring-rose-300 outline-none"
        />
        <button
          type="submit"
          className="bg-rose-500 text-white w-full py-2 rounded hover:bg-rose-600 transition"
        >
          Add Category
        </button>
      </motion.form>

      {/* Category Table */}
      <motion.div
        className="bg-white/90 mt-10 p-6 rounded-2xl shadow-lg overflow-x-auto max-w-5xl border border-rose-100"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <h2 className="text-xl font-semibold text-rose-700 mb-4">📂 All Categories</h2>
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-[#FFF0F6] text-[#5A3E36]">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b text-center">Status</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => {
              const isEditing = editingId === cat._id;
              return (
                <motion.tr
                  key={cat._id}
                  className="hover:bg-[#FFF8F9] border-t"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <td className="px-4 py-2">
                    <input
                      name="name"
                      value={isEditing ? formState.name : cat.name}
                      onChange={handleFormChange}
                      disabled={!isEditing}
                      className={`w-full px-2 py-1 rounded ${
                        isEditing
                          ? "border border-gray-300 bg-white focus:ring-2 focus:ring-pink-200"
                          : "bg-transparent border-none"
                      }`}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      name="description"
                      value={isEditing ? formState.description : cat.description}
                      onChange={handleFormChange}
                      disabled={!isEditing}
                      className={`w-full px-2 py-1 rounded ${
                        isEditing
                          ? "border border-gray-300 bg-white focus:ring-2 focus:ring-pink-200"
                          : "bg-transparent border-none"
                      }`}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleToggleStatus(cat._id)}
                      className="relative inline-flex items-center h-6 w-11 rounded-full focus:outline-none transition"
                    >
                      <span
                        className={`absolute h-6 w-11 rounded-full transition-colors ${
                          cat.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></span>
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          cat.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      ></span>
                    </button>
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-3">
                    {isEditing ? (
                      <>
                        <button onClick={() => saveEdit(cat._id)} className="text-green-600 hover:text-green-800">
                          💾
                        </button>
                        <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-800">
                          ✖️
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(cat)} className="text-blue-600 hover:text-blue-800">
                          <FaRegEdit size={18} />
                        </button>
                        <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-800">
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Categories;
