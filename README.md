# E-Commerce Platform with Stripe Integration

A robust and secure e-commerce backend built with Node.js, Express, and PostgreSQL, featuring Stripe payment integration and real-time features.

## 🚀 Features

### Authentication & Authorization

- Secure JWT-based authentication
- Session management for guest users
- Role-based access control
- Robust middleware protection

### Shopping Cart System

- Real-time cart management
- Guest cart functionality with session storage
- Persistent cart for authenticated users
- Stock validation and management
- Memory caching for optimized performance

### Order Management

- Secure checkout process with Stripe
- Transaction-based order processing
- Comprehensive order history
- Real-time order status updates
- Webhook integration for payment confirmations

### Product Management

- Complete CRUD operations
- Stock tracking
- Category management
- Product search and filtering

## 🛠️ Technical Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT, Session Management
- **Payment Processing:** Stripe API
- **Caching:** Memory Cache
- **API Design:** RESTful Architecture

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/Mohamed-sabry-av/Ecommerce-with-stripe---nodejs---postgresSQL.git
cd Ecommerce-with-stripe---nodejs---postgresSQL
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. Initialize the database:

```bash
psql -U your_db_user -d your_db_name -f database/init.sql
```

5. Start the server:

```bash
npm run dev  # for development
npm start    # for production
```

## 🔑 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Cart Endpoints

- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart contents
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Order Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order status

### Product Endpoints

- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

## 🔒 Security Features

- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- Session security
- Secure payment processing

## ⚡ Performance Optimizations

- Memory caching for frequently accessed data
- Optimized database queries
- Efficient error handling
- Transaction management
- Connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Mohamed Sabry**

- GitHub: [@Mohamed-sabry-av](https://github.com/Mohamed-sabry-av)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped with code and bug reports
- Stripe for their excellent payment processing API
- The Node.js and PostgreSQL communities for their excellent documentation

---

⭐️ Star this repo if you find it helpful!
