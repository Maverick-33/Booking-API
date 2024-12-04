import jwt from "jsonwebtoken";
import logger from "../logger.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("No token provided");
    return res.status(401).send("Access denied. No token provided.");
  }

  jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, user) => {
    if (err) {
      logger.warn("Invalid token");
      return res.status(403).send("Invalid token.");
    }
    req.user = user;
    next();
  });
};
