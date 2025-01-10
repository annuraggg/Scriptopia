import { ObjectId } from "mongodb";
import Certificate from "../models/Certificate.js";
import { sendSuccess, sendError } from "../utils/sendResponse.js";
import type { Context } from "hono";
import fs from "fs";
import path from "path";

const getCertificate = async (c: Context) => {
  try {
    const { id } = await c.req.json();
    if (!id) return sendError(c, 400, "Invalid request body");

    const certificate = await Certificate.findOne({
      _id: new ObjectId(id),
    });
    if (!certificate) return sendError(c, 404, "Certificate not found");

    sendSuccess(c, 200, "Certificate retrieved successfully", certificate);
  } catch (error) {
    sendError(c, 500, "Internal server error");
  }
};

const downloadCertificate = async (c: Context) => {
  try {
    const { id } = await c.req.json();
    if (!id) return sendError(c, 400, "Invalid request body");

    const certificate = await Certificate.findOne({
      _id: new ObjectId(id),
    });
    if (!certificate) return sendError(c, 404, "Certificate not found");

    if (certificate.uploadType === "url") {
      return sendError(c, 400, "Certificate is not uploaded");
    }

    const certificatePath = path.join(
      __dirname,
      "../uploads",
      certificate.certificateURL
    );
    if (!fs.existsSync(certificatePath)) {
      return sendError(c, 404, "Certificate file not found on server");
    }

    c.header(
      "Content-Disposition", // ! fix
      `attachment; filename="${certificate.certificateName}.${certificate.ext}"`
    );
    c.header("Content-Type", "application/pdf");

    return new Promise<void>(async (resolve) => {
      const fileStream = fs
        .createReadStream(certificatePath)
        .on("error", () => sendError(c, 500, "Internal server error"))
        .on("end", () => resolve());

      // ! fix
      fileStream.pipe(c.res);
    });
  } catch (error) {
    sendError(c, 500, "Internal server error");
  }
};

export default { getCertificate, downloadCertificate };
