import express from "express";
const router = express.Router();
import file from "fs";

router.post("/", (req, res) => {
  try {
    file.readFile("./server.log", "utf-8", (err, data) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
        log(err);
        return;
      }
      res.status(200).json({ data: data });
    });
  } catch (err) {
    logger.error({
      code: "ADM-LGH-100",
      message: "Failed to Retrive Log",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(500).json({ message: err });
  }
});

router.post("/delete", (req, res) => {
  try {
    file.writeFile("./server.log", "", (err) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
        log(err);
        return;
      }
      res.status(200).json({ message: "Log Cleared", success: true });
    });
  } catch (err) {
    logger.error({
      code: "ADM-LGH-101",
      message: "Failed to Clear Log",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(500).json({ message: err });
  }
});

export default router;
