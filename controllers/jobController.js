import Job from "../models/jobModel.js";
import { uploadImages } from "../helpers/index.js";
import { sendWelcomeEmail } from "../helpers/emailServices.js";
import User from "../models/userModal.js";
import bcrypt from 'bcrypt';

export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();

    res.status(201).json(job);
  } catch (error) {
    console.log("[ERROR_CREATE_JOB]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getJobs = async (req, res) => {
  try {
    let jobs = await Job.find();

    res.status(200).json(jobs);
  } catch (error) {
    console.log("[ERROR_GET_JOBS]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(400).json({ message: "Job not found." });
    }

    res.status(200).json(job);
  } catch (error) {
    console.log("[ERROR_GET_JOB]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { files } = req;
    const { jobId } = req.params;

    const logoFile = files.find(file => file.fieldname === 'logo');
    const resumeFiles = files.filter(file => file.fieldname === 'resumes');

    const [logoUrl] = await uploadImages([logoFile]);
    const resumeUrls = await uploadImages(resumeFiles);

    const updateData = {
      ...req.body,
      logo: logoUrl || ''
    };

    let job = await Job.findByIdAndUpdate({ _id: jobId }, updateData, { new: true });
    if (!job) {
      return res.status(400).json({ message: "Job not found." });
    }

    // Add the resume URLs to the candidates field
    job.candidates = job.candidates.concat(resumeUrls);
    await job.save();

    res.status(200).json(job);
  } catch (error) {
    console.log("[ERROR_UPDATE_JOB]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};


export const deleteJob = async (req, res) => {
  try {
    let job = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) {
      return res.status(400).json({ message: "Job not found." });
    }

    res.status(200).json({ message: "Job deleted." });
  } catch (error) {
    console.log("[ERROR_DELETE_JOB]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
