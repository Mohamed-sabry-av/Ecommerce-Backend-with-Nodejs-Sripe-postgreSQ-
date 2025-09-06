const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const pool = require("../config/db.config");

const sessionOptions = {
  store: new PgSession({
    pool: pool,
    tableName: "session",
  }),
  secret: process.env.SESSION_SECRET || "fallback_session_secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
};

module.exports = session(sessionOptions);