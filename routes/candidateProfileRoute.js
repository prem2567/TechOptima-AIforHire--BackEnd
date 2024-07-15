import express from "express";
import { runValidation } from "../validators/index.js";
import { CandidateProfileValidator } from "../validators/candidateProfileValidator.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  addCandidateProfileToCompany,
  createCandidateProfile,
  deleteCandidateProfile,
  getCandidateProfile,
  getCandidatesProfile,
  removeCandidateProfileFromCompany,
  updateCandidateProfile,
  getCandidateProfilesByCompanyId,
  createCandidateProfileAndSendEmail
} from "../controllers/candidateProfileController.js";

const router = express.Router();

router.post(
  "/",
  CandidateProfileValidator,
  runValidation,
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  createCandidateProfile
);

router.put(
  "/:candidateProfileId",
  CandidateProfileValidator,
  runValidation,
  verifyToken,
  // verifyRole(["platformOwner", "companyOwner"]),
  updateCandidateProfile
);

router.get("/find/:candidateProfileId",
   verifyToken,
    getCandidateProfile);

router.get(
  "/",
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  getCandidatesProfile
);

router.delete(
  "/:candidateProfileId",
  // verifyToken,
  // verifyRole(["platformOwner", "companyOwner"]),
  deleteCandidateProfile
);

router.patch(
  "/add-candidate-to-company/:candidateProfileId",
  // verifyToken,
  // verifyRole(["platformOwner", "companyOwner"]),
  addCandidateProfileToCompany
);

router.patch(
  "/remove-candidate-from-company/:candidateProfileId",
  // verifyToken,
  // verifyRole(["platformOwner", "companyOwner"]),
  removeCandidateProfileFromCompany
);

// Add this route to get candidate profiles by company ID

router.get(
  "/company/:companyId",
  getCandidateProfilesByCompanyId
);

  router.post(
    "/",
    CandidateProfileValidator,
    runValidation,
    // verifyToken,
    verifyRole(["platformOwner", "companyOwner"]),
    createCandidateProfileAndSendEmail
  );

export default router;
