const express = require("express");
const dotenv = require("dotenv");
const corsMiddleware = require("./middlewares/cors.middlesware");
const cookieParser = require("cookie-parser");
const sessionMiddleware = require('./middlewares/session.middlesware')
const sanitizeBody = require('./middlewares/sanitize.middlesware')
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimit.middleware')
const app = express();

dotenv.config();

// middlewares
app.use(helmet());
app.use(express.json({limit:'10kb'}));
app.use(corsMiddleware);
app.use(cookieParser()); 
app.use(sessionMiddleware);
app.use(sanitizeBody)
app.use(limiter)


//routes
app.use("/user", require("./routes/users.route"));
app.use("/product", require("./routes/products.route"));
app.use("/cart", require("./routes/carts.route"));
app.use("/checkout", require("./routes/checkout.route"));
app.use("/order", require("./routes/orders.route"));

app.listen(process.env.PORT, () =>
  console.log(`server started at port ${process.env.PORT}`)
);
