const express = require("express");
const dotenv = require("dotenv");
const corsMiddleware = require("./middlewares/cors.middlesware");
const cookieParser = require("cookie-parser");
const sessionMiddleware = require('./middlewares/session.middlesware')
const app = express();

dotenv.config();

// middlewares
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser()); 
app.use(sessionMiddleware);


//routes
app.use("/user", require("./routes/users.route"));
app.use("/product", require("./routes/products.route"));
app.use("/cart", require("./routes/carts.route"));

app.listen(process.env.PORT, () =>
  console.log(`server started at port ${process.env.PORT}`)
);
