// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import { v2 as cloudinary } from "cloudinary";

// import authRoute from "./routes/authRoute.js";
// import usersRoute from "./routes/usersRoute.js";
// import candidateProfilesRoute from "./routes/candidateProfileRoute.js";
// import companiesRoute from "./routes/companiesRoute.js";
// import jobsRoute from "./routes/jobsRoute.js";
// import mailsRoute from "./routes/mailsRoute.js";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// mongoose
//   .connect(process.env.MONGO_CONNECTION_STRING)
//   .then(() => {
//     console.log("connected  to mongodb");
//   })
//   .catch((error) => {
//     console.log("error connecting to mongo", error);
//   });

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// //TODO: ADD CORS CONFIG
// app.use(
//   cors({
//     origin: "https://localhost:5173/",
//     credentials: true,
//   })
// );

// app.use(cookieParser());

// app.use("/api/auth", authRoute);
// app.use("/api/users", usersRoute);
// app.use("/api/candidate-profiles", candidateProfilesRoute);
// app.use("/api/companies", companiesRoute);
// app.use("/api/jobs", jobsRoute);
// app.use("/api/mails", mailsRoute);

// app.listen(8000, async () => {
//   console.log("server running on localhost:8000");
// });

import express from "express";
import cors from "cors";
import "dotenv/config"; // This will load the environment variables from .env file
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";

import authRoute from "./routes/authRoute.js";
import usersRoute from "./routes/usersRoute.js";
import candidateProfilesRoute from "./routes/candidateProfileRoute.js";
import companiesRoute from "./routes/companiesRoute.js";
import jobsRoute from "./routes/jobsRoute.js";
import mailsRoute from "./routes/mailsRoute.js";
import resumeParserRoute from "./routes/resumeParserRoute.js";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB using the connection string from the environment variables
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("error connecting to mongo", error);
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "*", // Removed trailing slash
    credentials: true,
  })
);

app.use(cookieParser());

// Middleware to handle JSON and urlencoded form data
app.use(bodyParser.json({ limit: "50mb" })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Define routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/candidate-profiles", candidateProfilesRoute);
app.use("/api/companies", companiesRoute);
app.use("/api/jobs", jobsRoute);
app.use("/api/mails", mailsRoute);
app.use("/api/resume-parser", resumeParserRoute);

// Start the server
app.listen(8000, async () => {
  console.log("server running on localhost:8000");
});
