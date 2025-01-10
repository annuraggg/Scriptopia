import jwt from "jsonwebtoken";
import logger from "../../configs/logger.js";

export const verifyStudentPriviliges = (req, res, next) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error({ code: "ADM-VA-100", message: "Illegal Student Access with Token: " + token, err: err.message, mid: decoded.mid });
      res.status(401).json({ error: "Illegal Student Access Found" });
      return;
    }

    if (decoded.role !== "S") {
      logger.error({ code: "ADM-VA-101", message: "Unauthorized Student Access with Token: " + token, err: "Token Role Not Authorized", mid: decoded.mid });
      res.status(401).json({ error: "Illegal Student Access Found" });
      return;
    }

    req.user = decoded;
    next();
  });
};
