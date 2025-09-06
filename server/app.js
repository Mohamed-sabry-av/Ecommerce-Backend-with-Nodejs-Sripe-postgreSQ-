const express = require("express");
const dotenv = require("dotenv");
const corsMiddleware = require("./middlewares/cors.middlesware");
const cookieParser = require("cookie-parser");
const session = require('express-session')
const app = express();

dotenv.config();

// middlewares
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser()); 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false ,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 ساعة
    },
}))
app.use((req, res, next) => {
  console.log("Session:", req.session);
  console.log("Cookies:", req.cookies);
  next();
});

//routes
app.use("/user", require("./routes/users.route"));
app.use("/product", require("./routes/products.route"));
app.use("/cart", require("./routes/carts.route"));

app.listen(process.env.PORT, () =>
  console.log(`server started at port ${process.env.PORT}`)
);
