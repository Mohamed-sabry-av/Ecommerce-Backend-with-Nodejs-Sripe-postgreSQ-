const pool = require("../config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(401)
        .json({ message: "Username and password are required" });
    }

    const getUser = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    if (getUser.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const user = getUser.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie ("jwt",token,{
      httpOnly:true,
      secure:process.env.NODE_ENV === "production", //https in production
      maxAge:60*60*1000,
    })
    res.status(200).json({ Message: "Login successfully", token });
  } catch (err) {
    console.log(err.message);
  }
};
