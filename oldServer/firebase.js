import admin from "firebase-admin";
import serviceAccount from "./fbServiceAccount.js";

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
