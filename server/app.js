const express = require("express");
const dotenv = require("dotenv");
const http = require('http');
const corsMiddleware = require("./middlewares/cors.middlesware");
const cookieParser = require("cookie-parser");
const sessionMiddleware = require('./middlewares/session.middlesware')
const sanitizeBody = require('./middlewares/sanitize.middlesware')
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimit.middleware')
const initializeSocket = require('./config/socket.io');

const app = express();
const server = http.createServer(app)
const io = initializeSocket(server)

dotenv.config();

app.post('/order/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  console.log('Webhook route hit, req.body type:', Buffer.isBuffer(req.body) ? 'Buffer' : typeof req.body);
  require('./routes/orders.route')(req, res, next);
});
// middlewares
app.use(helmet());
app.use(express.json()); //{limit:'10kb'}
app.use(corsMiddleware);
app.use(cookieParser()); 
app.use(sessionMiddleware);
// app.use(sanitizeBody)
app.use(limiter)
app.set('io', io);


//routes
app.use("/user", require("./routes/users.route"));
app.use("/product", require("./routes/products.route"));
app.use("/cart", require("./routes/carts.route"));
app.use("/checkout", require("./routes/checkout.route"));
app.use("/order", require("./routes/orders.route"));

server.listen(process.env.PORT, () =>
  console.log(`server started at port ${process.env.PORT}`)
);
