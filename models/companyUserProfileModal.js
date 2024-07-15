import mongoose from "mongoose";

const candidateProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    birthDate: { type: String, required: true },
    address: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
    },
    role: { type: String, required: true },
    zipCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' } // Added reference to Company
  },
  { timestamps: true }
);

const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);

export default CandidateProfile;
