import express from 'express';
import multer from 'multer';

import { runValidation } from '../validators/index.js';
import { CompanyValidator } from '../validators/companyValidator.js';
import { verifyRole } from '../middlewares/verifyRole.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
  createCompany,
  deleteCompany,
  getCompany,
  getCompanies,
  updateCompany,
  getCandidateProfilesByCompanyId,
} from '../controllers/companyController.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
});

router.post(
  '/',
  CompanyValidator,
  // runValidation,
  verifyToken,
  upload.array('imageFiles', 1),
  verifyRole(['platformOwner', 'companyOwner']), 
  createCompany
);

router.put(
  '/:companyId',
  CompanyValidator,
  runValidation,
  // verifyToken,
  // verifyRole(['platformOwner', 'companyOwner']),
  updateCompany
);

router.get('/find/:companyId', 
  // verifyToken, 
  getCompany);

router.get('/', 
  verifyToken,
   verifyRole(['platformOwner', 'companyOwner']), 
   getCompanies);

router.delete(
  '/:companyId',
  // verifyToken,
  // verifyRole(['platformOwner', 'companyOwner']),
  deleteCompany
);

// New route to get candidate profiles by company
router.get(
  '/:companyId/candidate-profiles',
  verifyToken,
  verifyRole(['platformOwner', 'companyOwner']),
  getCandidateProfilesByCompanyId
);

export default router;
