import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'clothing', 'medical', 'other'],
        lowercase: true
    },
    quantity: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    expiryDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value > new Date();
            },
            message: 'Expiry date must be in the future'
        }
    },
    pickupInstructions: {
        type: String,
        trim: true,
        maxlength: [500, 'Pickup instructions cannot exceed 500 characters']
    },
    contactPhone: {
        type: String,
        trim: true
    },
    image: {
        type: String, // URL to the uploaded image
        trim: true
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donorName: {
        type: String,
        required: true,
        trim: true
    },
    donorType: {
        type: String,
        required: true,
        enum: ['individual', 'restaurant', 'ngo']
    },
    status: {
        type: String,
        enum: ['available', 'claimed', 'completed', 'expired'],
        default: 'available'
    },
    claimerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    claimerName: {
        type: String,
        trim: true
    },
    claimedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for better search performance
donationSchema.index({ category: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ donorId: 1 });
donationSchema.index({ claimerId: 1 });
donationSchema.index({ createdAt: -1 });

// Pre-save middleware to update status based on expiry
donationSchema.pre('save', function(next) {
    if (this.expiryDate && this.expiryDate <= new Date() && this.status === 'available') {
        this.status = 'expired';
    }
    next();
});

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
