import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Get Cart for a user
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to Cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Update existing cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists in cart, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Product does not exist, add new item
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const initialLength = cart.items.length;

    // Filter out the item by its _id
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error while removing cart item' });
  }
};

// Clear entire Cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(itemId); // Mongoose subdocument method

    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    item.quantity = quantity; // Update the quantity

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

