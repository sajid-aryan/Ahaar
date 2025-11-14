import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateToken = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
		}

		// Fetch the user from database
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res.status(401).json({ success: false, message: "Unauthorized - user not found" });
		}

		req.user = user;
		req.userId = decoded.userId; // Keep for backward compatibility
		next();
	} catch (error) {
		console.log("Error in authenticateToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};