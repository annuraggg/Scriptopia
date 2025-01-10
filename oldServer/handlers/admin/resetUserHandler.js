import express from "express";
const router = express.Router();
import { userDB } from "../../configs/mongo.js";
import bcrypt from "bcrypt";

router.post("/", async (req, res) => {
  const { mid } = req.body;
  const defaultpw = ""
  const password = bcrypt.hashSync(defaultpw, 10); 

  try {
    const user = await userDB.findOne({ mid });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await userDB.updateOne(
      { mid },
      {
        $set: {
          defaultPW: true,
          password,
        },
      }
    );
    res.status(200).json({ message: "User reset successfully", status: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
