import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  fileName: [{
    type: String,
    required: true
  }],
  fileType: [{
    type: String,
    required: true
  }],
  file: [{
    type: String, // Assuming you will store base64 string or a URL here
    required: true
  }]
});

const jobSchema = new mongoose.Schema(
  {
    // companyId: { type: String, default: "" },
    candidates: [candidateSchema], // Store candidate file URLs here
    roleName: { type: String, required: true },
    level: { type: Number, required: true },
    address: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
    },
    experience: { type: Number, required: true },
    modeOfWork: { type: String, required: true },
    domain: { type: String, required: true },
    education: { type: String, required: true },
    description: { type: String, required: true },
    primarySkills: [{ type: String, default: "" }],
    secondarySkills: [{ type: String, default: "" }],
    certification: [{ type: String, default: "" }],
    responsibility: [{ type: String, default: "" }],
    requirement: [{ type: String, default: "" }],
    preferredQualification: [{ type: String, default: "" }],
    // fileName: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
    // fileType: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
    // file: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
