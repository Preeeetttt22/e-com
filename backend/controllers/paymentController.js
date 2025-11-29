import razorpay from '../utils/razorpay.js';
import crypto from 'crypto';

export const createRazorpayOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // convert to paise
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Razorpay error', error: error.message });
  }
};

// Optional: Verify Razorpay Signature after payment
export const verifyRazorpaySignature = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.status(200).json({ valid: true });
  } else {
    res.status(400).json({ valid: false, message: 'Invalid signature' });
  }
};
