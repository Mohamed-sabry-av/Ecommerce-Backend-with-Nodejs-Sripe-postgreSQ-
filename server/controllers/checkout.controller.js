const pool = require("../config/db.config");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  const userId = req.user?.id;

  try {
    
    let total = 0;
    let cartId = null;

    if (userId) {
      const cartResult = await pool.query(
        `SELECT id FROM carts WHERE user_id = $1`,
        [userId]
      );
      if (cartResult.rows.length === 0) {
        return res.status(400).json({ message: "Cart Not Found" });
      }
      cartId = cartResult.rows[0].id;

      const itemResult = await pool.query(
        `SELECT ci.quantity, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1`,
        [cartId]
      );

      for (const item of itemResult.rows) {
        total += item.price * item.quantity;
      }
    } else {
      return res.status(401).json({ message: "User must be logged in" });
    }

    // انشاء Payment Intent
    if(userId === null || !userId){
      return res.status(400).json({ message: "User ID is required in metadata" });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "aed",
      metadata: {
  userId: userId.toString(),
  cartId: cartId ? cartId.toString() : "none",
},
      automatic_payment_methods: { enabled: true },
    });
    console.log("Payment INTERNNNNNNNNNNNNNNNNNNT",paymentIntent,"paymentIntent@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err.message);
    res.status(500).json({ message: "Creating payment intent failed", error: err.message });
  }
};

