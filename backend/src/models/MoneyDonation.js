import mongoose from "mongoose";

const moneyDonationSchema = new mongoose.Schema({
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
    donorEmail: {
        type: String,
        required: true,
        trim: true
    },
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ngoProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGOProfile',
        required: true
    },
    needId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    message: {
        type: String,
        trim: true,
        maxlength: [300, 'Message cannot exceed 300 characters']
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'bkash', 'bank_transfer'],
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed' // Mock payment always succeeds
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for better performance
moneyDonationSchema.index({ ngoId: 1 });
moneyDonationSchema.index({ donorId: 1 });
moneyDonationSchema.index({ ngoProfileId: 1 });
moneyDonationSchema.index({ createdAt: -1 });

const MoneyDonation = mongoose.model('MoneyDonation', moneyDonationSchema);
export default MoneyDonation;
