import express from "express";
const router = express.Router();
import logger from "../configs/logger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userDB } from "../configs/mongo.js";
import { body } from "express-validator";

router.post(
  "/",
  body("mid").not().isEmpty().trim().escape(),
  body("password").not().isEmpty().trim(),
  async (req, res) => {
    const { mid, password } = req.body;
    try {
      const findUser = await userDB.findOne({ mid: mid.toString() });
      if (!findUser) {
        res.status(401).json({
          title: "Invalid Credentials",
          message: "Please Check Your Credentials and Try Again",
        });
        return;
      }

      const verify = await bcrypt.compare(password, findUser.password);
      if (!verify) {
        res.status(401).json({
          title: "Invalid Credentials",
          message: "Please Check Your Credentials and Try Again",
        });
        return;
      }

      if (findUser.role == "A") {
        try {
          const token = jwt.sign(
            {
              mid,
              fname: findUser.fname,
              lname: findUser.lname,
              picture: findUser.profilePicture,
              role: "A",
            },
            process.env.JWT_SECRET
          );
          const expirationTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
          const expirationDate = new Date(Date.now() + expirationTime);

          res
            .status(200)
            .cookie("token", token, {
              expires: expirationDate,
              domain: process.env.COOKIE_DOMAIN,
            })
            .send({ role: "A", mid, colorMode: findUser.colorMode, token: token });

          logger.warn({
            code: "MN-LH-200",
            message: "Admin Logged In",
            mid: mid,
          });
        } catch (err) {
          logger.error("LH01: ", err.message);
          res.status(500).json({
            title: "Internal Server Error",
            message: "Please Try Again After Some Time.",
          });
        }
      } else if (findUser.role == "F") {
        const firstTime = findUser.defaultPW;
        let token;
        if (firstTime) {
          token = "Invalid";
        } else {
          token = jwt.sign(
            {
              mid,
              fname: findUser.fname,
              lname: findUser.lname,
              picture: findUser.profilePicture,
              role: "F",
              perms: findUser.perms,
            },
            process.env.JWT_SECRET
          );
        }

        const expirationTime = 4 * 60 * 60 * 1000; // *4 hours in milliseconds
        const expirationDate = new Date(Date.now() + expirationTime);

        res
          .status(200)
          .cookie("token", token, {
            expires: expirationDate,
            domain: process.env.COOKIE_DOMAIN,
          })
          .send({ role: "F", firstTime, mid, colorMode: findUser.colorMode, token: token });

        logger.info({
          code: "MN-LH-201",
          message: "Faculty Logged In",
          mid: mid,
        });
      } else if (findUser.role == "S") {
        const firstTime = findUser.defaultPW;

        try {
          if (findUser.approved === false) {
            res.status(401).json({
              title: "Not Alloted",
              message:
                "You have been not alloted to any house yet. Please try again after a while.",
            });
            return;
          }

          let token;
          if (firstTime) {
            token = "Invalid";
          } else {
            token = jwt.sign(
              {
                mid,
                fname: findUser.fname,
                lname: findUser.lname,
                ay: findUser.AY,
                branch: findUser.branch,
                picture: findUser.profilePicture,
                role: "S",
              },
              process.env.JWT_SECRET
            );
          }

          const expirationTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
          const expirationDate = new Date(Date.now() + expirationTime);
          res
            .status(200)
            .cookie("token", token, {
              expires: expirationDate,
              domain: process.env.COOKIE_DOMAIN,
            })
            .send({ role: "S", firstTime, mid, colorMode: findUser.colorMode, token: token });

          logger.info({
            code: "MN-LH-202",
            message: "Student Logged In",
            mid: mid,
          });
        } catch (err) {
          logger.error("LH01: ", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    } catch (err) {
      logger.error({
        code: "MN-LH-100",
        message: "Error in Login",
        err: err.message,
        mid: mid,
      });
      res.status(500).json({
        title: "Internal Server Error",
        message: "Please Try Again After Some Time.",
      });
    }
  }
);

router.post(
  "/firsttime",
  body("password").not().isEmpty().trim(),
  body("password2").not().isEmpty().trim(),
  async (req, res) => {
    const { mid, password, password2 } = req.body;
    try {
      if (password === password2) {
        const user = await userDB.findOne({ mid: mid.toString() });
        if (user) {
          await userDB.updateOne(
            { mid: mid.toString() },
            {
              $set: {
                password: await bcrypt.hash(password, 10),
                defaultPW: false,
              },
            }
          );

          const token = jwt.sign(
            {
              mid,
              fname: user.fname,
              lname: user.lname,
              ay: user.AY,
              branch: user.branch,
              picture: user.profilePicture,
              role: user.role,
            },
            process.env.JWT_SECRET
          );
          const expirationTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
          const expirationDate = new Date(Date.now() + expirationTime);

          res
            .status(200)
            .cookie("token", token, {
              expires: expirationDate,
              domain: process.env.COOKIE_DOMAIN,
            })
            .json({token: token, role: user.role});
        } else {
          res.status(500).send({
            title: "Something went wrong",
            message: "Please try again after some time.",
          });
        }
      } else {
        res.status(400).send({
          title: "Passwords do not match",
          message: "Please Enter the same password in both the fields.",
        });
      }
    } catch (err) {
      logger.error({
        code: "MN-LH-101",
        message: "Error in Setting First Time Password",
        err: err.message,
        mid: mid,
      });
      res.status(500).send({
        title: "Something went wrong",
        message: "Please try again after some time.",
      });
    }
  }
);

export default router;
