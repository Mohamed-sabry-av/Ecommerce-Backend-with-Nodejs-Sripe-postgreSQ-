const jwt = require("jsonwebtoken");
const pool = require("../config/db.config");

exports.authenticate = async (req, res, next) => {
  let token ;

  if(req.cookies && req.cookies.jwt){
    token = req.cookies.jwt;
  }
  else if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
    token = req.headers.authorization.split(" ")[1];
  }
  if(!token){
    req.user = null;
   return next();
  }
  
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await pool.query(
      `SELECT id,username,email,role FROM users WHERE id = $1`,
      [decode.userId]
    );
   if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = userResult.rows[0]; 
    next();
} catch (err) {
    console.log(err.message )
      return res.status(404).json({error:"Token invalid or expired"});
  }
};


exports.adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}