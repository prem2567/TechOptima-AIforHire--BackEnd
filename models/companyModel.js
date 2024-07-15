import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  industry: { type: String, required: true },
  size: { type: String, required: true },
  url: { type: String, required: true },
  careerPage: { type: String, required: true },
  headquartersLocation: { type: String, required: true },
  companySummary: { type: String, required: true },
  recruitmentDetails: {
    openPositions: { type: String, required: true },
    contactRecruiter: { type: String, required: true }
  },
  posts: { type: [String], default: [] },
  logo: { type: String },
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CandidateProfile' }]
});

export default mongoose.model('Company', CompanySchema);
