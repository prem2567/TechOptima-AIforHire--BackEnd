import { check } from "express-validator";

export const JobValidator = [
  // check("companyId").not().isEmpty().withMessage("Company ID is required."),
  check("roleName").not().isEmpty().withMessage("Role Name is required."),
  check("level")
    .not()
    .isEmpty()
    .withMessage("Level is required.")
    .isNumeric()
    .withMessage("Level is must be a number."),
  check("address.country").not().isEmpty().withMessage("Country is required."),
  check("address.state").not().isEmpty().withMessage("State is required."),
  check("address.city").not().isEmpty().withMessage("City is required."),
  check("experience")
    .not()
    .isEmpty()
    .withMessage("Experience is required.")
    .isNumeric()
    .withMessage("Experience must be a number."),
  check("modeOfWork").not().isEmpty().withMessage("Mode Of Work is required."),
  check("domain").not().isEmpty().withMessage("Domain is required."),
  check("education").not().isEmpty().withMessage("Education is required."),
  check("description").not().isEmpty().withMessage("Description is required."),
];
