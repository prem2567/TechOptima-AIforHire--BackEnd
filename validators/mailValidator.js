import { check } from "express-validator";

export const MailValidator = [
  check("candidateId").not().isEmpty().withMessage("Candidate ID is required."),
  check("isReferral")
    .optional()
    .isBoolean()
    .withMessage("isReferral must be a boolean."),
  check("recommendation")
    .not()
    .isEmpty()
    .withMessage("Recommendation is required.")
    .isInt({ min: 0, max: 100 })
    .withMessage("Recommendation must be in the range of 0 to 100."),
];
