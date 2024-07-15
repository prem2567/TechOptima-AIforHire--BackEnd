import nodemailer from "nodemailer";
import CandidateProfile from "../models/candidateProfileModal.js";
import Company from "../models/companyModel.js";
import sendEmail from "../helpers/mail.js";
// import User from "../models/userModal.js";

export const createCandidateProfile = async (req, res) => {
  try {
    const { companyId, ...profileData } = req.body;
    const candidateProfile = new CandidateProfile(profileData);

    if (companyId) {
      const company = await Company.findById(companyId);
      console.log('company', company)
      if (company) {
        candidateProfile.company = companyId;
        await candidateProfile.save();
        company.profiles.push(candidateProfile._id);
        await company.save();
      }
    } else {
      await candidateProfile.save();
    }

    res.status(201).json(candidateProfile);
  } catch (error) {
    console.log("[ERROR_CREATE_CANDIDATE_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getCandidatesProfile = async (req, res) => {
  try {
    let candidatesProfile = await CandidateProfile.find();

    res.status(200).json(candidatesProfile);
  } catch (error) {
    console.log("[ERROR_GET_CANDIDATES_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getCandidateProfile = async (req, res) => {
  try {
    let candidateProfile = await CandidateProfile.findById(
      req.params.candidateProfileId
    );
    if (!candidateProfile) {
      return res.status(400).json({ message: "CandidateProfile not found." });
    }

    res.status(200).json(candidateProfile);
  } catch (error) {
    console.log("[ERROR_GET_CANDIDATE_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateCandidateProfile = async (req, res) => {
  try {
    let candidateProfile = await CandidateProfile.findByIdAndUpdate(
      { _id: req.params.candidateProfileId },
      req.body,
      { new: true }
    );
    if (!candidateProfile) {
      return res.status(400).json({ message: "CandidateProfile not found." });
    }

    res.status(200).json(candidateProfile);
  } catch (error) {
    console.log("[ERROR_UPDATE_CANDIDATE_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteCandidateProfile = async (req, res) => {
  try {
    let candidateProfile = await CandidateProfile.findByIdAndDelete(
      req.params.candidateProfileId
    );
    if (!candidateProfile) {
      return res.status(400).json({ message: "Candidate Profile not found." });
    }

    res.status(200).json({ message: "CandidateProfile deleted." });
  } catch (error) {
    console.log("[ERROR_DELETE_CANDIDATE_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const addCandidateProfileToCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const { candidateProfileId } = req.params;

    if (!companyId) {
      return res.status(400).json("Company ID is required.");
    }

    if (!candidateProfileId) {
      return res.status(400).json("Candidate Profile ID is required.");
    }

    let candidateProfile = await CandidateProfile.findById(candidateProfileId);
    if (!candidateProfile) {
      return res.status(404).json({ message: "Candidate Profile not found." });
    }

    let company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    if (company.profiles.includes(candidateProfileId)) {
      return res.status(400).json({ message: "Candidate Profile already exists in the company." });
    }

    candidateProfile.company = companyId;
    await candidateProfile.save();
    company.profiles.push(candidateProfile._id);
    await company.save();

    res.status(200).json({ message: "Candidate Profile added to the company." });
  } catch (error) {
    console.log("[ERROR_ADDING_CANDIDATE_PROFILE_TO_COMPANY]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const removeCandidateProfileFromCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const { candidateProfileId } = req.params;

    if (!companyId) {
      return res.status(400).json("Company ID is required.");
    }

    if (!candidateProfileId) {
      return res.status(400).json("Candidate Profile ID is required.");
    }

    let company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    const profileIndex = company.profiles.indexOf(candidateProfileId);
    if (profileIndex === -1) {
      return res
        .status(400)
        .json({ message: "Candidate Profile does not exist in the company." });
    }

    // Remove the candidate profile from the company's profiles array
    company.profiles.splice(profileIndex, 1);
    await company.save();

    res
      .status(200)
      .json({ message: "Candidate Profile removed from the company." });
  } catch (error) {
    console.log("[ERROR_REMOVED_CANDIDATE_PROFILE_FROM_COMPANY]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getCandidateProfilesByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Find candidate profiles associated with the given company ID
    let candidateProfiles = await CandidateProfile.find({ company: companyId });
    
    if (!candidateProfiles) {
      return res.status(404).json({ message: "No candidate profiles found for this company." });
    }

    res.status(200).json(candidateProfiles);
  } catch (error) {
    console.log("[ERROR_GET_CANDIDATE_PROFILES_BY_COMPANY_ID]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const createCandidateProfileAndSendEmail = async (req, res) => {
  try {
    const { name, email, phoneNumber, birthDate, address, role, zipCode } = req.body;

    // Create the candidate profile
    const candidateProfile = new CandidateProfile({
      name,
      email,
      phoneNumber,
      birthDate,
      address,
      role,
      zipCode,
    });
    await candidateProfile.save();

    // Create user credentials
    const password = Math.random().toString(36).slice(-8); // Generate a random password
    const user = new CandidateProfile({ username: email, email, password, role: "user" });
    await user.save();

    // Send the welcome email
    const subject = "Welcome to the Company!";
    const text = `Hello ${name},\n\nYour profile has been created. Here are your login credentials:\n\nUsername: ${email}\nPassword: ${password}\n\nPlease log in and change your password.\n\nBest regards,\nCompany Team`;
    sendEmail(email, subject, text);

    res.status(201).json(candidateProfile);
  } catch (error) {
    console.log("[ERROR_CREATE_CANDIDATE_PROFILE_AND_SEND_EMAIL]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
