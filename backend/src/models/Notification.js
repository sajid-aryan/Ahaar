import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['donation_claimed', 'feedback_received', 'donation_completed'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        donationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation'
        },
        claimerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        claimerName: String,
        rating: Number,
        feedback: String
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
