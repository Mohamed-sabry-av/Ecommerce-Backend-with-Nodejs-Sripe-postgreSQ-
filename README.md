# 🛍️ Advanced E-Commerce Platform with Real-time Features

A sophisticated e-commerce solution built with Node.js, Express, PostgreSQL, and Socket.IO, featuring Stripe payments and real-time updates.

## ✨ Key Features

### 🔄 Real-time Functionality

- Live cart updates across multiple devices
- Real-time order status notifications
- Instant payment confirmations
- Live stock updates
- Real-time user notifications

### 💳 Payment Processing

- Secure Stripe payment integration
- Webhook handling for payment events
- Automatic order status updates
- Transaction management
- Payment failure handling

### 🛒 Shopping Cart System

- Real-time cart synchronization
- Guest cart functionality
- Persistent cart for authenticated users
- Stock validation
- Memory caching

### 📦 Order Management

- Real-time order tracking
- Comprehensive order history
- Transaction-based processing
- Webhook integration
- Status notifications

## 🛠️ Technical Stack

- **Backend Framework:** Node.js, Express.js
- **Database:** PostgreSQL
- **Real-time Communication:** Socket.IO
- **Payment Processing:** Stripe API
- **Caching:** Memory Cache
- **Authentication:** JWT, Session Management
- **API Design:** RESTful Architecture

## 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Mohamed-sabry-av/Ecommerce-with-stripe---nodejs---postgresSQL.git
cd Ecommerce-with-stripe---nodejs---postgresSQL
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

```bash
cp .env.example .env
```

Required environment variables:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SOCKET_CORS_ORIGIN=http://localhost:4200
```

4. **Initialize database:**

```bash
psql -U your_db_user -d your_db_name -f database/init.sql
```

5. **Start the server:**

```bash
npm run dev  # Development
npm start    # Production
```

## 🔌 Socket.IO Events

### Cart Events

- `cart-updated` - Cart contents changed
- `cart-item-added` - New item added to cart
- `cart-item-removed` - Item removed from cart

### Order Events

- `order-created` - New order created
- `order-status-updated` - Order status changed
- `payment-confirmed` - Payment successfully processed
- `payment-failed` - Payment processing failed

## 🔒 Security Features

- CORS protection
- Rate limiting
- WebSocket authentication
- SQL injection prevention
- XSS protection
- Secure payment processing
- Session security

## ⚡ Performance Optimizations

- Socket.IO room management
- Memory caching
- Database connection pooling
- Efficient error handling
- Transaction management
- Optimized queries

## 📚 API Documentation

### Socket.IO Connection

```javascript
const socket = io("http://localhost:3000", {
  auth: {
    token: "your-jwt-token",
  },
});

socket.on("connect", () => {
  console.log("Connected to server");
});
```

### REST Endpoints

Full API documentation available in `/docs/api.md`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE)

## 👤 Author

**Mohamed Sabry**

- GitHub: [@Mohamed-sabry-av](https://github.com/Mohamed-sabry-av)

## 🙏 Acknowledgments

- Socket.IO team for real-time capabilities
- Stripe for payment processing
- PostgreSQL community
- Node.js community
