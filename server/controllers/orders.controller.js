const pool = require("../config/db.config");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cache = require("../util/memory-cache.utils");

exports.createOrder = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Must be logged in to create orders" });
  }

  try {
    // Get user's cart
    const cartResult = await pool.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartId = cartResult.rows[0].id;

    // Get cart items with product details
    const cartItemsResult = await pool.query(
      `SELECT ci.product_id, ci.quantity, p.price, p.name, p.stock 
             FROM cart_items ci 
             JOIN products p ON ci.product_id = p.id 
             WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (cartItemsResult.rows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total and check stock
    let total = 0;
    for (const item of cartItemsResult.rows) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${item.name}`,
        });
      }
      total += item.price * item.quantity;
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe expects amount in cents
      currency: "aed",
      metadata: { userId },
    });

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total_amount, payment_intent_id, status) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING id`,
        [userId, total, paymentIntent.id, "pending"]
      );
      const orderId = orderResult.rows[0].id;

      // Create order items and update product stock
      for (const item of cartItemsResult.rows) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
                     VALUES ($1, $2, $3, $4)`,
          [orderId, item.product_id, item.quantity, item.price]
        );

        await client.query(
          `UPDATE products 
                     SET stock = stock - $1 
                     WHERE id = $2`,
          [item.quantity, item.product_id]
        );
      }

      // Clear cart
      await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);

      await client.query("COMMIT");

      // Clear cart cache
      const cacheKey = `cart_user_${userId}`;
      cache.del(cacheKey);

      res.status(201).json({
        message: "Order created successfully",
        orderId,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({
      message: "Failed to create order",
      error: err.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const ordersResult = await pool.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at,
                    json_agg(json_build_object(
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price_at_purchase,
                        'name', p.name
                    )) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE o.user_id = $1
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: ordersResult.rows,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  const userId = req.user?.id;
  const orderId = parseInt(req.params.id);

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const orderResult = await pool.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at, o.payment_intent_id,
                    json_agg(json_build_object(
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price_at_purchase,
                        'name', p.name,
                        'description', p.description
                    )) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE o.id = $1 AND o.user_id = $2
             GROUP BY o.id`,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order retrieved successfully",
      order: orderResult.rows[0],
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({
      message: "Failed to fetch order",
      error: err.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const orderId = parseInt(req.params.id);
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const validStatuses = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const updateResult = await pool.query(
      `UPDATE orders 
             SET status = $1 
             WHERE id = $2 AND user_id = $3 
             RETURNING id, status`,
      [status, orderId, userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updateResult.rows[0],
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({
      message: "Failed to update order status",
      error: err.message,
    });
  }
};

// Stripe webhook handler for payment status updates
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      await pool.query(
        `UPDATE orders 
                 SET status = 'paid', 
                     payment_confirmed_at = CURRENT_TIMESTAMP 
                 WHERE payment_intent_id = $1`,
        [paymentIntent.id]
      );
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
