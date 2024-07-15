import { check } from "express-validator";

export const registerValidator = [
  check("username").not().isEmpty().withMessage("Username Name is required."),
  check("email").isEmail().withMessage("Email must be a valid address."),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  check("role")
    .optional()
    .isIn(["user", "companyOwner", "platformOwner"])
    .withMessage("Role must be one of 'user', 'companyOwner', or 'platformOwner'.")
    .default("user"),
];

export const loginValidator = [
  check("email").not().isEmpty().withMessage("Email is required."),
  check("password").not().isEmpty().withMessage("Password is required."),
];
