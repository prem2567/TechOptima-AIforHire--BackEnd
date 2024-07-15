import express from "express";
import { runValidation } from "../validators/index.js";
import { MailValidator } from "../validators/mailValidator.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  createMail,
  deleteMail,
  getMail,
  getMails,
  updateMail,
} from "../controllers/mailController.js";

const router = express.Router();

router.post(
  "/",
  MailValidator,
  runValidation,
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  createMail
);

router.put(
  "/:mailId",
  MailValidator,
  runValidation,
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  updateMail
);

router.get("/find/:mailId", verifyToken, getMail);

router.get("/", verifyToken, verifyRole(["platformOwner", "companyOwner"]), getMails);

router.delete(
  "/:mailId",
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  deleteMail
);

export default router;
