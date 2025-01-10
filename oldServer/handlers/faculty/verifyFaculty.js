import jwt from "jsonwebtoken";
import logger from "../../configs/logger.js";

export const verifyFacultyPriviliges = (req, res, next) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error({ code: "ADM-VA-100", message: "Illegal Faculty Access with Token: " + token, err: err.message, mid: decoded.mid });
      res.status(401).json({ error: "Illegal Faculty Access Found" });
      return;
    }

    if (decoded.role !== "F") {
      logger.error({ code: "ADM-VA-101", message: "Unauthorized Faculty Access with Token: " + token, err: "Token Role Not Authorized", mid: decoded.mid });
      res.status(401).json({ error: "Illegal Faculty Access Found" });
      return;
    }

    req.user = decoded;
    next();
  });
};
