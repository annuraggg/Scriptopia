import jwt from "jsonwebtoken";
import logger from "../configs/logger.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error({code: "MN-JWT-100", message: "Invalid token: " + token});
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.user = decoded; 
    next();
  });
};
