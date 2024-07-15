import { check } from "express-validator";

export const CompanyUserProfileValidator = [
  check("name").not().isEmpty().withMessage("Name is required."),
  check("email").isEmail().withMessage("Email must be a valid address."),
  check("phoneNumber").not().isEmpty().withMessage("Phone Number is required."),
  check("birthDate").not().isEmpty().withMessage("Birth Date is required."),
  check("address.country").not().isEmpty().withMessage("Country is required."),
  check("address.state").not().isEmpty().withMessage("State is required."),
  check("address.city").not().isEmpty().withMessage("City is required."),
  check("role").not().isEmpty().withMessage("Role is required."),
  check("zipCode").not().isEmpty().withMessage("Zip Code is required."),
  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean."),
];
