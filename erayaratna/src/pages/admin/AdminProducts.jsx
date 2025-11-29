import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/categoryService";
import {
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../../services/productService";
import { toast } from "react-hot-toast";

const AdminProducts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    tags: "",
    images: null,
    category: "",
  });

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].name);
        setFormData((prev) => ({ ...prev, category: data[0]._id }));
      }
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCategories();
      await fetchProducts();
    })();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(previews);
    }
    setFormData((prev) => ({ ...prev, [name]: files || value }));
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "tags") {
        payload.append(key, JSON.stringify(val.split(",").map((t) => t.trim())));
      } else if (key === "images" && val) {
        Array.from(val).forEach((f) => payload.append("images", f));
      } else {
        payload.append(key, val);
      }
    });

    try {
      const action = editingProduct
        ? updateProduct(editingProduct._id, payload)
        : addProduct(payload);
      const result = await action;
      toast.success(editingProduct ? "Product updated" : "Product added");

      const updated = {
        ...result,
        category: categories.find((c) => c._id === result.category) || result.category,
      };

      setProducts((prev) =>
        editingProduct
          ? prev.map((p) => (p._id === result._id ? updated : p))
          : [result, ...prev]
      );
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags.join(", "),
      images: null,
      category:
        typeof product.category === "object"
          ? product.category._id
          : product.category,
    });
    setSelectedCategory(
      categories.find(
        (c) =>
          c._id ===
          (typeof product.category === "object"
            ? product.category._id
            : product.category)
      )?.name
    );
    setImagePreviews(product.images || []);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      tags: "",
      images: null,
      category: formData.category,
    });
    setImagePreviews([]);
  };

  const filteredProducts = products.filter((p) => {
    const catObj =
      typeof p.category === "object"
        ? p.category
        : categories.find((c) => c._id === p.category);
    return catObj?.name === selectedCategory;
  });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#FFF8EC] to-[#FFE6E1] text-[#4B2E2E]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-wide text-[#A0522D]">
          🛍️ Admin Products
        </h1>
      </div>

      {/* Category Selector */}
      <div className="bg-white/80 border border-[#F7D1B3] p-4 rounded-2xl max-w-xl mb-10 shadow">
        <label className="block mb-2 font-semibold text-[#5A3E36]">
          Select Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            const name = e.target.value;
            setSelectedCategory(name);
            const cat = categories.find((c) => c.name === name);
            if (cat)
              setFormData((prev) => ({ ...prev, category: cat._id }));
          }}
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Form */}
      <form
        onSubmit={handleAddOrUpdateProduct}
        className="bg-white/90 border border-[#FDE3CB] p-6 rounded-2xl shadow-lg max-w-3xl space-y-4"
      >
        <h2 className="text-xl font-semibold text-[#8B3A3A]">
          {editingProduct ? "Update Product" : "Add New Product"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleFormChange}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleFormChange}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleFormChange}
            className="col-span-1 md:col-span-2 border px-3 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleFormChange}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFormChange}
            className="file:px-4 file:py-2 file:bg-orange-600 file:text-white file:rounded hover:file:bg-orange-700"
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-3">
            {imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="preview"
                className="w-24 h-24 object-contain rounded border"
              />
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-2">
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            {editingProduct ? "Update" : "Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product Table */}
      <div className="bg-white/90 border border-[#FAD6C3] mt-10 p-6 rounded-xl shadow-lg max-w-5xl overflow-x-auto">
        <h2 className="text-xl font-semibold text-[#8A2C02] mb-4">
          Products in {selectedCategory}
        </h2>
        <table className="min-w-full text-sm border rounded overflow-hidden">
          <thead className="bg-[#FFF4E6] text-[#5A3E36]">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Tags</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="hover:bg-[#FFF9F2]">
                <td className="p-3 border">{p.name}</td>
                <td className="p-3 border">₹{p.price}</td>
                <td className="p-3 border">{p.tags.join(", ")}</td>
                <td className="p-3 border flex gap-3">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No products in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
