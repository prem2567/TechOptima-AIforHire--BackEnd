import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    candidateId: { type: String, required: true },
    isReferral: { type: Boolean, default: false },
    recommendation: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

const Mail = mongoose.model("Mail", mailSchema);

export default Mail;
