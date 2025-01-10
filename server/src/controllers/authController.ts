import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import type { Context } from "hono";
import { sendError, sendSuccess } from "../utils/sendResponse.js";

const login = async (c: Context) => {
  const { mid, password } = await c.req.json();
  try {
    const findUser = await User.findOne({ mid: mid.toString() });
    if (!findUser) {
      return sendError(c, 401, "Invalid Credentials");
    }

    const verify = await bcrypt.compare(password, findUser.password);
    if (!verify) {
      return sendError(c, 401, "Invalid Credentials");
    }

    let token;
    if (findUser.role === "A") {
      token = jwt.sign(
        {
          mid,
          fname: findUser.fname,
          lname: findUser.lname,
          picture: findUser.profilePicture,
          role: "A",
        },
        process.env.JWT_SECRET!
      );
    } else if (findUser.role === "F") {
      const firstTime = findUser.defaultPW;
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
          process.env.JWT_SECRET!
        );
      }
    } else if (findUser.role === "S") {
      const firstTime = findUser.defaultPW;
      if (findUser.approved === false) {
        return sendError(
          c,
          403,
          "You have been not alloted to any house yet. Please try again after a while."
        );
      }
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
          process.env.JWT_SECRET!
        );
      }
    }

    const expirationTime = 4 * 60 * 60 * 1000;

    const roleName =
      findUser.role === "A"
        ? "Admin"
        : findUser.role === "F"
        ? "Faculty"
        : "Student";
    logger.info(`${roleName} ${mid} logged in at ${new Date().toISOString()}`);

    return sendSuccess(c, 200, "Logged In", {
      role: findUser.role,
      mid,
      colorMode: findUser.colorMode,
      token,
    });
  } catch (err) {
    sendError(c, 500, "Something went wrong");
  }
};

const firstTimePassword = async (c: Context) => {
  const { mid, password, password2 } = await c.req.json();
  try {
    if (password === password2) {
      const user = await User.findOne({ mid: mid.toString() });
      if (user) {
        await User.updateOne(
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
          process.env.JWT_SECRET!
        );
        const expirationTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        const expirationDate = new Date(Date.now() + expirationTime);

        return sendSuccess(c, 200, "Password Set Successfully", {
          role: user.role,
          mid,
          colorMode: user.colorMode,
          token,
        });
      } else {
        return sendError(c, 500, "Something went wrong");
      }
    } else {
      return sendError(c, 400, "Passwords do not match");
    }
  } catch (err) {
    return sendError(c, 500, "Something went wrong");
  }
};

export default {
  login,
  firstTimePassword,
};
