import { uploadImages } from "../helpers/index.js";
import Company from "../models/companyModel.js";
import CandidateProfile from "../models/candidateProfileModal.js";
import { sendWelcomeEmail } from "../helpers/emailServices.js";
import User from "../models/userModal.js";
import bcrypt from "bcrypt";

export const createCompany = async (req, res) => {
  try {
    const imageFiles = req.files;

    console.log("Received image files:", imageFiles); // Log the received files

    const imageUrls = await uploadImages(imageFiles);

    const {
      contact,
      companyName,
      industry,
      size,
      url,
      careerPage,
      headquartersLocation,
      companySummary,
      recruitmentDetails,
      posts,
    } = req.body;

    if (!contact || !contact.email || !companyName) {
      return res
        .status(400)
        .json({ message: "Contact email and company name are required." });
    }

    const company = new Company({
      name: companyName,
      contact,
      companyName,
      industry,
      size,
      url,
      careerPage,
      headquartersLocation,
      companySummary,      
      recruitmentDetails: {
        openPositions: recruitmentDetails.openPositions,
        contactRecruiter: recruitmentDetails.contactRecruiter
      },
      posts: posts || [],
      logo: imageUrls[0]?.file || "",
    });

    let companyDetails = await company.save();
    // console.log("Company created:", companyDetails);

    // const password = "12345"; // Fixed password for testing
    // const newPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed password:", newPassword);
    const newPassword = 'welcome@123'

    const user = new User({
      username: contact.email,
      email: contact.email,
      password: newPassword,
      role: "companyOwner",
      company: companyDetails._id,
      logo:imageUrls[0]?.file || "",
    });
    console.log(user)

    await user.save();
    console.log("User created:", user);

    const candidateProfile = new CandidateProfile({
      name: company.name,
      email: contact.email,
      phoneNumber: contact.phone,
      company: company._id,
      address: {
        country: "Unknown",
        state: "Unknown",
        city: "Unknown",
      },
      role: "Unknown",
      zipCode: "00000",
      isActive: true,
    });

    await candidateProfile.save();
    // console.log("Candidate profile created:", candidateProfile);

    company.profiles.push(candidateProfile._id);
    await company.save();
    // console.log("Updated company with candidate profile");

    sendWelcomeEmail(contact.email, company.name, newPassword);

    res.status(201).json(company);
  } catch (error) {
    console.log("[ERROR_CREATE_COMPANY]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'companyName', order = 'asc', search = '' } = req.query;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    // Correct sort fields
    const sortFields = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      asc: { companyName: 1 },
      desc: { companyName: -1 }
    };

    // Debugging log
    // console.log('Query Parameters:', { page, limit, sortBy, order, search });

    const query = search ? {
      $or: [
        { companyName: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { headquartersLocation: { $regex: search, $options: 'i' } },
      ]
    } : {};

    // Debugging log
    // console.log('Query:', query);

    const companies = await Company.find(query)
      .sort(sortFields[sortBy] || { companyName: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("profiles");

    const totalCompanies = await Company.countDocuments(query);

    // Debugging log
    // console.log('Companies Found:', companies);
    // console.log('Total Companies:', totalCompanies);

    res.status(200).json({
      companies,
      totalPages: Math.ceil(totalCompanies / limit),
    });
  } catch (error) {
    console.log("[ERROR_GET_COMPANIES]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};



export const getCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    let company = await Company.findById(companyId).populate("profiles");
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    res.status(200).json(company);
  } catch (error) {
    console.log("[ERROR_GET_COMPANY]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getCompanyWithProfiles = async (req, res) => {
  try {
    const { companyId } = req.params;

    let company = await Company.findById(companyId).populate({
      path: "profiles",
      model: "CandidateProfile",
    });

    if (!company) {
      return res.status(400).json({ message: "Company not found." });
    }

    res.status(200).json(company);
  } catch (error) {
    console.log("[ERROR_GET_COMPANY_WITH_PROFILES]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const addProfileToCompany = async (req, res) => {
  try {
    const { profileId, companyId } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({ message: "Company not found." });
    }

    const profile = await CandidateProfile.findById(profileId);
    if (!profile) {
      return res.status(400).json({ message: "Profile not found." });
    }

    company.profiles.push(profile._id);
    await company.save();

    res.status(200).json({ message: "Profile added to company.", company });
  } catch (error) {
    console.log("[ERROR_ADD_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const imageFiles = req.files;
    const imageUrls = await uploadImages(imageFiles);
    const logo = imageUrls[0] || "";

    let company = await Company.findByIdAndUpdate(
      { _id: req.params.companyId },
      { ...req.body, logo },
      { new: true }
    );
    if (!company) {
      return res.status(400).json({ message: "Company not found." });
    }

    res.status(200).json(company);
  } catch (error) {
    console.log("[ERROR_UPDATE_COMPANY]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    let company = await Company.findByIdAndDelete(req.params.companyId);
    if (!company) {
      return res.status(400).json({ message: "Company not found." });
    }

    res.status(200).json({ message: "Company deleted." });
  } catch (error) {
    console.log("[ERROR_DELETE_COMPANY]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getCandidateProfilesByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Find candidate profiles associated with the given company ID
    let candidateProfiles = await CandidateProfile.find({ company: companyId });

    if (!candidateProfiles || candidateProfiles.length === 0) {
      return res
        .status(404)
        .json({ message: "No candidate profiles found for this company." });
    }

    res.status(200).json(candidateProfiles);
  } catch (error) {
    console.log("[ERROR_GET_CANDIDATE_PROFILES_BY_COMPANY_ID]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

