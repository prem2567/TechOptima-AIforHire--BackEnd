import mongoose from 'mongoose';

const candidateProfileSchema = new mongoose.Schema(
  {
    // name: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: false }, // true
    name: { type: String, ref: 'Company', required: false }, // true
    email: { type: String, required: true },
    phoneNumber: { type: String, required: false }, // true
    birthDate: { type: String },
    address: {
      country: { type: String, default: 'Unknown' },
      state: { type: String, default: 'Unknown' },
      city: { type: String, default: 'Unknown' },
    },
    role: { type: String, default: 'Unknown' },
    zipCode: { type: String, default: '00000' },
    isActive: { type: Boolean, default: true },
    company: { type: String, ref: 'Company', required: true }, // Reference to Company
  },
  { timestamps: true }
);

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfileSchema);

export default CandidateProfile;
