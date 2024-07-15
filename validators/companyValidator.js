import { check } from "express-validator";

export const CompanyValidator = [
  check("name").not().isEmpty().withMessage("Name is required."),
  check("companyName").not().isEmpty().withMessage("Company Name is required."),

  check("contact.email")
    .not()
    .isEmpty()
    .withMessage("Contact email is required."),
  check("contact.phone")
    .not()
    .isEmpty()
    .withMessage("Contact Phone Number is required."),
  check("industry").not().isEmpty().withMessage("Industry is required."),
  check("size").not().isEmpty().withMessage("Company Size is required."),
  check("url").not().isEmpty().withMessage("Company  Website URL is required."),
  check("careerPage")
    .not()
    .isEmpty()
    .withMessage("Company Career Page is required."),
  check("posts").not().isEmpty().withMessage("Post Title is required."),
  // check("posts.date")
  //   .not()
  //   .isEmpty()
  //   .withMessage("Post date is required."),
  //   check("posts.desc")
  //   .not()
  //   .isEmpty()
  //   .withMessage("Post desc is required."),
  check("headquartersLocation")
    .not()
    .isEmpty()
    .withMessage("Headquarters Location is required."),
  check("recruitmentDetails")
    .not()
    .isEmpty()
    .withMessage("Contact Recruiter is required."),
  check("companySummary")
    .not()
    .isEmpty()
    .withMessage("Company Summary is required."),
];
