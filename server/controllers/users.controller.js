const pool = require("../config/db.config");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await pool.query(
      `INSERT INTO users (username,email,password_hash, role) VALUES ($1,$2,$3,$4) RETURNING *`,
      [username, email, hashedPassword, role]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ "Error from the server": err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const getUsers = await pool.query(`SELECT * FROM users`);
    res.status(201).json(getUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};
