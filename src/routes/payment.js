const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order._id.toString() }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
});

router.post('/confirm', auth, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const order = await Order.findOneAndUpdate(
        { _id: orderId, user: req.user._id },
        { paymentStatus: 'completed' },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json({ message: 'Payment confirmed', order });
    } else {
      res.status(400).json({ message: 'Payment not completed', status: paymentIntent.status });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'completed' });
  }

  res.json({ received: true });
});

module.exports = router;
