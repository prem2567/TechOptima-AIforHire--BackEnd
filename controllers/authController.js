import User from "../models/userModal.js";
import bcrypt from "bcryptjs";
import { error } from "console";
import { contextsKey } from "express-validator/lib/base.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    user = await User.findOne({ username: req.body.username });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this username." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "User has been created." });
  } catch (error) {
    console.log("ERROR_USERS_REGISTER", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Request Body:", req.body)
//     console.log('Login attempt:', { email, password });

//     const user = await User.findOne({ email });
//     console.log("user is existing", user)
//     if (!user) {
//       console.log('Invalid email:', email);
//       return res.status(400).json({ message: "Invalid email." });
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);
//     console.log("printing after password validation",isValidPassword)
//     if (!isValidPassword) {
//       console.log('Invalid password for user:', email);
//       return res.status(400).json({ message: "Invalid password." });
//     }

//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
//       expiresIn: "1d",
//     });
//     console.log('token', token)

//     res.cookie("auth_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     console.log('Login successful for user:', email);
//     return res.status(200).json({ message: "Login successful.",token, userId: user.id, role: user.role});
//   } catch (error) {
//     console.log("ERROR_AUTH_LOGIN", error);
//     return res.status(500).json({ message: "Something went wrong." });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password." });
    }
    console.log(user, "user");
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      // logo: {
      //   Company: {
      //     logo: company.logo,
      //   },
      // },
      // company:{
      // id:user.company._id,
      //   name:user.company.name,
      //   logo:user.logo  || user.company.logo,
      // }
    };

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful.",
      token,
      userData,
      userId: user.id,
      role: user.role,
    });
  } catch (error) {
    console.log("ERROR_AUTH_LOGIN", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

//test4
