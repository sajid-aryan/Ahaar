import mongoose from "mongoose";

const ngoProfileSchema = new mongoose.Schema({
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    organizationName: {
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
    location: {
        type: String,
        required: true,
        trim: true
    },
    contactInfo: {
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
        website: {
            type: String,
            trim: true
        }
    },
    logo: {
        type: String, // URL to uploaded logo
        trim: true
    },
    needs: [{
        type: {
            type: String,
            required: true,
            enum: ['food', 'medical', 'clothing', 'money', 'other']
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: [500, 'Need description cannot exceed 500 characters']
        },
        targetAmount: {
            type: Number,
            required: function() {
                return this.type === 'money';
            },
            min: 0
        },
        currentAmount: {
            type: Number,
            default: 0,
            min: 0
        },
        urgency: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalDonationsReceived: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better search performance
ngoProfileSchema.index({ ngoId: 1 });
ngoProfileSchema.index({ isPublic: 1 });
ngoProfileSchema.index({ location: 1 });

const NGOProfile = mongoose.model('NGOProfile', ngoProfileSchema);
export default NGOProfile;
