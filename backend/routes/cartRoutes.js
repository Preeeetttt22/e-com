import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart, updateCartItem } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/remove/:itemId', protect, removeFromCart);
router.delete('/clear', protect, clearCart);
router.put('/update/:itemId', protect, updateCartItem);


export default router;
