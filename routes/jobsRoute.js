import express from "express";
import multer from "multer";
import { runValidation } from "../validators/index.js";
import { JobValidator } from "../validators/jobValidator.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

router.post(
  "/",
  JobValidator,
  runValidation,
  // verifyToken,
  upload.array("candidates", 10), // Allow up to 10 files
  // verifyRole(['companyOwner', 'recruiter']),
  createJob
);

router.put(
  "/:jobId",
  JobValidator,
  runValidation,
  // verifyToken,
  upload.array("candidates", 10), // Allow up to 10 files
  // verifyRole(['companyOwner', 'recruiter']),
  updateJob
);

router.get(
  "/",
  // verifyToken,
  // verifyRole(["companyOwner", "recruiter", "user"]),
  getJobs
);
router.get(
  "/:jobId",
  // verifyToken,
  // verifyRole(["companyOwner", "recruiter", "user"]),
  getJob
);
router.delete(
  "/:jobId",
  // verifyToken,
  // verifyRole(["companyOwner", "recruiter"]),
  deleteJob
);

export default router;
