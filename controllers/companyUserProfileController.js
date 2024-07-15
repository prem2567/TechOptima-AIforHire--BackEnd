import CompanyUserProfile from "../models/companyUserProfileModal.js";
import Company from "../models/companyModel.js";

export const createCompanyUserProfile = async (req, res) => {
  try {
    const companyUserProfile = new CompanyUserProfile(req.body);
    await companyUserProfile.save();

    res.status(201).json(companyUserProfile);
  } catch (error) {
    console.log("[ERROR_CREATE_COMPANY_USER_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getCompanyUsersProfile = async (req, res) => {
  try {
    let candidatesProfile = await CompanyUserProfile.find();

    res.status(200).json(candidatesProfile);
  } catch (error) {
    console.log("[ERROR_GET_COMPANY_USER_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getCompanyUserProfile = async (req, res) => {
  try {
    let companyUserProfile = await CompanyUserProfile.findById(
      req.params.companyUserProfileId
    );
    if (!companyUserProfile) {
      return res.status(400).json({ message: "Company User Profile not found." });
    }

    res.status(200).json(companyUserProfile);
  } catch (error) {
    console.log("[ERROR_GET_COMPANY_USER_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateCompanyUserProfile = async (req, res) => {
  try {
    let companyUserProfile = await CompanyUserProfile.findByIdAndUpdate(
      { _id: req.params.companyUserProfileId },
      req.body,
      { new: true }
    );
    if (!companyUserProfile) {
      return res.status(400).json({ message: "Company User Profile not found." });
    }

    res.status(200).json(companyUserProfile);
  } catch (error) {
    console.log("[ERROR_UPDATE_COMPANY_USER_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteCompanyUserProfile = async (req, res) => {
  try {
    let companyUserProfile = await CompanyUserProfile.findByIdAndDelete(
      req.params.companyUserProfileId
    );
    if (!companyUserProfile) {
      return res.status(400).json({ message: "Company User Profile not found." });
    }

    res.status(200).json({ message: "Company User Profile deleted." });
  } catch (error) {
    console.log("[ERROR_DELETE_COMPANY_USER_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const addCompanyUserProfile = async (req, res) => {
  try {
    const { companyId } = req.body;
    const { companyUserProfileId } = req.params;

    if (!companyId) {
      return res.status(400).json("Company User Profile is required.");
    }

    if (!companyUserProfileId) {
      return res.status(400).json("Company User Profile ID is required.");
    }

    let companyUserProfile = await CompanyUserProfile.findById(companyUserProfileId);
    if (!companyUserProfile) {
      return res.status(404).json({ message: "Company User Profile not found." });
    }

    let company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    if (company.profiles.includes(companyUserProfileId)) {
      return res
        .status(400)
        .json({ message: "Company User Profile already exists in the company." });
    }

    company.profiles.push(companyUserProfileId);
    await company.save();

    res
      .status(200)
      .json({ message: "Company User Profile added to the company." });
  } catch (error) {
    console.log("[ERROR_ADDING_CANDIDATE_PROFILE_TO_COMPANY]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const removeCompanyUserProfileFromCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const { companyUserProfileId } = req.params;

    if (!companyId) {
      return res.status(400).json("Company ID is required.");
    }

    if (!companyUserProfileId) {
      return res.status(400).json("Company User Profile ID is required.");
    }

    let company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    const profileIndex = company.profiles.indexOf(companyUserProfileId);
    if (profileIndex === -1) {
      return res
        .status(400)
        .json({ message: "Company User Profile does not exist in the company." });
    }

    // Remove the Company User Profile from the company's profiles array
    company.profiles.splice(profileIndex, 1);
    await company.save();

    res
      .status(200)
      .json({ message: "Company User Profile removed from the company." });
  } catch (error) {
    console.log("[ERROR_REMOVED_CANDIDATE_PROFILE_FROM_COMPANY]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
