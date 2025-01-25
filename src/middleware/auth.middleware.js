import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

const authenticateUser = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(404).json({ message: "no token found" });

  // Remove "Bearer " part before verification

  const tokenWithoutBearer = token.split(" ")[1];
  jwt.verify(
    tokenWithoutBearer,
    process.env.ACCESS_JWT_SECRET,
    async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "invalid token" });
      }
      const userFind = await User.findOne({ email: user.email });
      req.user = userFind;
      next();
    }
  );
};

export default authenticateUser;
