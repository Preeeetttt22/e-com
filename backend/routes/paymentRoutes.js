import express from 'express';
import { createRazorpayOrder, verifyRazorpaySignature } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpaySignature);

router.post('/webhook', (req, res) => {
  // Razorpay sends JSON with headers including 'X-Razorpay-Signature'
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const crypto = require('crypto');
  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    // Process webhook event e.g. payment captured, failed, etc.
    console.log('Webhook verified:', req.body.event);
    // Update order/payment status in DB accordingly
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'invalid signature' });
  }
});

export default router;
