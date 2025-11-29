import Category from '../models/Category.js';

// Create category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({
      name,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      message: `Category is now ${category.isActive ? 'active' : 'inactive'}`,
      isActive: category.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};