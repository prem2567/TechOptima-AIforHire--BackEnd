import express from "express";
import { runValidation } from "../validators/index.js";
import { CompanyUserProfileValidator } from "../validators/companyUserProfileValidator.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  addCompanyUserProfileToCompany,
  createCompanyUserProfile,
  deleteCompanyUserProfile,
  getCompanyUserProfile,
  getCompanyUsersProfile,
  removeCompanyUserProfileFromCompany,
  updateCompanyUserProfile,
} from "../controllers/companyUserProfileController.js";

const router = express.Router();

router.post(
  "/",
  CompanyUserProfileValidator,
  runValidation,
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  createCompanyUserProfile
);

router.put(
  "/:candidateProfileId",
  CompanyUserProfileValidator,
  runValidation,
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  updateCompanyUserProfile
);

router.get("/find/:candidateProfileId", verifyToken, getCompanyUserProfile);

router.get(
  "/",
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  getCompanyUsersProfile
);

router.delete(
  "/:candidateProfileId",
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  deleteCompanyUserProfile
);

router.patch(
  "/add-candidate-to-company/:candidateProfileId",
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  addCompanyUserProfileToCompany
);

router.patch(
  "/remove-candidate-from-company/:candidateProfileId",
  verifyToken,
  verifyRole(["platformOwner", "companyOwner"]),
  removeCompanyUserProfileFromCompany
);

export default router;
