import jwt from "jsonwebtoken";
import logger from "../configs/logger.js";

// Middleware function that accepts multiple permissions
export const verifyPerms = (...perms) => {
  return (req, res, next) => {
    const token = req.cookies.token;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.error({
          code: "ADM-VA-100",
          message: "Illegal Permission Access with Token: " + token,
          err: err.message,
          mid: decoded.mid,
        });
        res.status(401).json({ error: "Illegal Permission Access Found" });
        return;
      }

      // Check if any of the specified permissions match the decoded permissions
      if (!perms.every((perm) => decoded.perms?.includes(perm)) && decoded.role !== "A") {
        logger.error({  
          code: "ADM-VA-101",
          message: "Unauthorized Permission Access with Token: " + token,
          err: "Token Permission Not Authorized",
          mid: decoded.mid,
        });
        res.status(401).json({ error: "Illegal Permission Access Found" });
        return;
      }

      req.user = decoded;
      next();
    });
  };
};
