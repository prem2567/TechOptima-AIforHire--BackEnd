import User from "../models/userModal.js";
import jwt from 'jsonwebtoken';

export const verifyRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      // Ensure the Authorization header is present
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
      }

      // Extract the token from the Authorization header
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "Token missing" });
      }

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = decoded.userId;
      req.userRole = decoded.role;

      // Fetch the user from the database
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify the user role
      if (!requiredRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.log("[ERROR_VERIFY_ROLE]", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };
};
