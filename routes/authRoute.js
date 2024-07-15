import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/authValidator.js";
import { runValidation } from "../validators/index.js";
import { login, register } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", registerValidator, runValidation, register);
router.post("/login", loginValidator, runValidation, login);

router.get("/validate-token", verifyToken, (req, res) => {
  res.status(200).json({ userId: req.userId });
});
router.post("/logout", (req, res) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });

  res.send();
});

export default router;
