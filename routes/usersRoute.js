import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import {
  updateProfile,
  deleteProfile,
  myProfile,
} from "../controllers/usersController.js";
import { registerValidator } from "../validators/authValidator.js";
import { runValidation } from "../validators/index.js";

const router = express.Router();

router.get("/me", verifyToken, myProfile);

router.put(
  "/:userId",
  registerValidator,
  runValidation,
  verifyToken,
  updateProfile
);

router.delete(
  "/:userId",
  verifyToken,
  verifyRole(["platformOwner"]),
  deleteProfile
);

export default router;
