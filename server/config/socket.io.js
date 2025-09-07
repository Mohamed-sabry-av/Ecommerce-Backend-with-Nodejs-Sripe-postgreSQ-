const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("authenticate", (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = { id: decoded.userId, role: decoded.role };
        console.log("Socket authenticated for user:", socket.user.id);
        socket.join(`user:${socket.user.id}`);
      } catch (err) {
        console.error("Socket authentication failed:", err.message);
      }
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  return io;
}

module.exports = initializeSocket;
