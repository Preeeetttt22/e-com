import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  searchProducts
} from '../controllers/productController.js';

const router = express.Router();
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.get('/search/query', searchProducts);
export default router;
