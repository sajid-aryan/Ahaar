import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getUserProfile, updateUserProfile, getUserStats, resetDonationCounts } from "../controllers/userProfileController.js";

const router = express.Router();

// Get user profile
router.get("/", verifyToken, getUserProfile);

// Get user statistics
router.get("/stats", verifyToken, getUserStats);

// Reset donation counts for all users (migration endpoint)
router.post("/reset-counts", resetDonationCounts);

// Update user profile
router.put("/", verifyToken, updateUserProfile);

export default router;
