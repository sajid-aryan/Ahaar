import User from "../models/user.model.js";
import Donation from "../models/Donation.js";

// Get user profile
export const getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error in getUserProfile: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get user statistics
export const getUserStats = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("donationsCount totalMoneyDonated");
		
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Recalculate donations count based on claimed donations
		const claimedDonationsCount = await Donation.countDocuments({
			donorId: req.userId,
			status: { $in: ['claimed', 'completed'] }
		});

		// Update user's donation count if it doesn't match
		if (user.donationsCount !== claimedDonationsCount) {
			await User.findByIdAndUpdate(
				req.userId,
				{ donationsCount: claimedDonationsCount }
			);
		}

		res.status(200).json({
			stats: {
				donationsCount: claimedDonationsCount,
				totalMoneyDonated: user.totalMoneyDonated || 0
			}
		});
	} catch (error) {
		console.error("Error in getUserStats: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Update user profile
export const updateUserProfile = async (req, res) => {
	try {
		const { name, email, phone } = req.body;
		const userId = req.userId;

		// Check if user exists
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Validate required fields
		if (!name || !email) {
			return res.status(400).json({ message: "Name and email are required" });
		}

		// Check if email is already taken by another user
		if (email && email !== user.email) {
			const existingUser = await User.findOne({ email, _id: { $ne: userId } });
			if (existingUser) {
				return res.status(400).json({ message: "Email is already taken" });
			}
		}

		// Update user profile
		const updateData = {};
		if (name) updateData.name = name;
		if (email) updateData.email = email;
		if (phone !== undefined) updateData.phone = phone; // Allow empty string to remove phone

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			updateData,
			{ new: true }
		).select("-password");

		res.status(200).json({
			message: "Profile updated successfully",
			user: updatedUser
		});
	} catch (error) {
		console.error("Error in updateUserProfile: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Reset donation counts for all users (migration function)
export const resetDonationCounts = async (req, res) => {
	try {
		const users = await User.find({});
		
		for (const user of users) {
			const claimedDonationsCount = await Donation.countDocuments({
				donorId: user._id,
				status: { $in: ['claimed', 'completed'] }
			});
			
			await User.findByIdAndUpdate(
				user._id,
				{ donationsCount: claimedDonationsCount }
			);
		}
		
		res.status(200).json({
			message: `Reset donation counts for ${users.length} users`,
			success: true
		});
	} catch (error) {
		console.error("Error in resetDonationCounts: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
