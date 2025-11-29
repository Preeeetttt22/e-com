import express from 'express';
import {
  addAddress,
  getUserAddresses,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addAddress);
router.get('/', protect, getUserAddresses);
router.delete('/:addressId', protect, deleteAddress);
router.put('/default/:addressId', protect, setDefaultAddress);

export default router;
