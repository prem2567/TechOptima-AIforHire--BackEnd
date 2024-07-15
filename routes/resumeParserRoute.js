// routes/resumeParserRoute.js
import express from 'express';
import { parseResume } from '../controllers/resumeParserController.js';

const router = express.Router();

router.post('/parse', parseResume);

export default router;
