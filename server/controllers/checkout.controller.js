const pool = require("../config/db.config");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckout = async (req, res) => {
  const userId = req.user?.id;

  try {
    let lineItems = [];
    if (userId) {
      const cartResult = await pool.query(
        `SELECT id FROM carts WHERE user_id = $1`,
        [userId]
      );
      if (cartResult.rows.length === 0) {
        return res.status(400).json({ message: "Cart Not Found" });
      }
      const cartId = cartResult.rows[0].id;

      const itemResult = await pool.query(
        `SELECT ci.product_id, ci.quantity, p.name, p.price 
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.cart_id = $1`,
        [cartId]
      );

      lineItems = itemResult.rows.map((item) => ({
        price_data: {
          currency: "AED",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));
    }
    // Guestes
    else {
      if (!req.session || !req.session.cart) {
        return res.status(400).json({ message: "Cart Not Found" });
      }

      const productsId = req.session.cart.map((item) => item.product_id);
      const itemResult = await pool.query(
        `SELECT id AS product_id ,name,price FROM products WHERE id = ANY($1)`,
        [productsId]
      );

      const lineItems = itemResult.rows.map((item) => {
        const product = itemResult.rows.find(
          (p) => p.product_id === item.product_id
        );
        return {
          price_data: {
            currency: "AED",
            product_data: {
              name: product?.name,
            },
            unit_amount: product?.price * 100,
          },
          quantity: item.quantity,
        };
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      lineItems: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
      user_id: userId || 'guest',
      cart_id: cartId || 'session-based',
    },
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err.message);
    resc
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
