import jwt from "jsonwebtoken";
import logger from "../../configs/logger.js";

export const verifyAdminPrivilges = (req, res, next) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error({ code: "ADM-VA-100", message: "Illegal Admin Access with Token: " + token, err: err.message, mid: decoded.mid });
      res.status(401).json({ error: "Illegal Admin Access Found" });
      return;
    }

    if (decoded.role !== "A") {
      logger.error({ code: "ADM-VA-101", message: "Unauthorized Admin Access with Token: " + token, err: "Token Role Not Authorized", mid: decoded.mid });
      res.status(401).json({ error: "Illegal Admin Access Found" });
      return;
    }

    req.user = decoded;
    next();
  });
};
