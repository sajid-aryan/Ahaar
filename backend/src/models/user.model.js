import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		userType: {
			type: String,
			required: true,
			enum: ['ngo', 'individual', 'restaurant', 'admin'],
			default: 'individual'
		},
		isVerified: {
			type: Boolean,
			default: false
		},
		verifiedAt: {
			type: Date
		},
		verifiedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		donationsCount: {
			type: Number,
			default: 0,
		},
		totalMoneyDonated: {
			type: Number,
			default: 0,
		},
		averageRating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5
		},
		totalRatings: {
			type: Number,
			default: 0
		},
		ratingSum: {
			type: Number,
			default: 0
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export default User;