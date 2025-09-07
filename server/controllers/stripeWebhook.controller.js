const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

exports.connectWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).json({ error: "Webhook verification failed" });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Checkout session completed:", session);
      // Reminder
      // 1. تحديث حالة الطلب في الداتابيز
      // 2. إرسال إيميل تأكيد للمستخدم
      // مثال: تحديث حالة الطلب
      if (session.metadata.user_id !== "guest") {
        await pool.query(
          `UPDATE orders SET status = 'completed' WHERE user_id = $1 AND session_id = $2`,
          [session.metadata.user_id, session.id]
        );
      }
      break;
    case "payment_intent.succeeded":
      console.log("Payment intent succeeded:", event.data.object);
      break;
    case "payment_intent.payment_failed":
      console.log("Payment failed:", event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
};
