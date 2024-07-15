import User from "../models/userModal.js";

export const myProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId)
      .select("-password")
      .populate("company", "companyName"); // Populate companyName
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    console.log("ERROR_FETCH_CURRENT_USER_PROFILE", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    const newUsername = req.body.username;
    const newRole = req.body.role;
    const logo = req.body.logo

    let user = await User.findOne({ email: newEmail });
    if (user) {
      return res.status(200).json("Email Taken.");
    }

    user = await User.findOne({ username: newUsername });
    if (user) {
      return res.status(200).json("Username Taken.");
    }

    user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isPlatformOwner = await User.findById(req.userId);

    if (isPlatformOwner?.role !== "platformOwner" && newRole) {
      return res.status(403).json({ message: "Access denied." });
    }

    user.email = newEmail;
    user.password = newPassword;
    user.username = newUsername;
    user.role = newRole;
    user.logo = logo

    await user.save();
    res.status(200).json({ message: "Profile updated." });
  } catch (error) {
    console.log("[ERROR_UPDATE_USER_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Profile deleted." });
  } catch (error) {
    console.log("[ERROR_DELETE_USER_PROFILE]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
