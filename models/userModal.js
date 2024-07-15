import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';


const userSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: String,
    //   default: uuidv4,
    // },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["platformOwner", "companyOwner", "admin", "user"],
      default: "user",
    },
    // companyName: { type: String, required: true }, // Add companyName field
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    // logo: {
    //   type: String, ref: 'Company',
    // }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
