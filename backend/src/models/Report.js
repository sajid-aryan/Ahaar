import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        required: true
    },
    reportType: {
        type: String,
        enum: ['inappropriate_content', 'fake_donation', 'spam', 'misleading_info', 'other'],
        required: true
    },
    reason: {
        type: String,
        required: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    },
    adminNotes: {
        type: String,
        maxlength: 1000
    },
    actionTaken: {
        type: String,
        enum: ['none', 'warning_sent', 'donation_removed', 'user_suspended'],
        default: 'none'
    }
}, {
    timestamps: true
});

// Index for better query performance
reportSchema.index({ donationId: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
