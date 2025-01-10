import { enrollmentDB, userDB } from "../configs/mongoose.js";
import logger from "../configs/logger.js";

export const createEnrollment = async (req, res) => {
  const { mid, about, technical, projects, cgpa } = req.body;
  try {
    const user = await userDB.findOne({ mid: mid.toString() });
    if (user) {
      await userDB.updateOne(
        { mid: mid.toString() },
        { $set: { firstTime: false } }
      );
      await enrollmentDB.create({
        mid: mid.toString(),
        about,
        technical,
        projects,
        cgpa: parseFloat(cgpa),
      });
      res.status(200).send({ success: true });
    } else {
      res.status(500).send({ success: false });
    }
  } catch (error) {
    logger.error({
      code: "MN-FTH-100",
      message: "Error updating first time data",
      err: error.message,
      mid: req.user.mid,
    });
    res.status(500).send({ success: false });
  }
};

export default { createEnrollment };
