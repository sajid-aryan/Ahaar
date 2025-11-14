import User from '../models/user.model.js';
import Donation from '../models/Donation.js';
import Report from '../models/Report.js';
import { createNotification } from './notificationController.js';

// Get admin dashboard stats
export const getAdminStats = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        const stats = {
            pendingVerifications: await User.countDocuments({ 
                userType: 'ngo', 
                isVerified: false 
            }),
            pendingReports: await Report.countDocuments({ status: 'pending' }),
            totalUsers: await User.countDocuments(),
            totalDonations: await Donation.countDocuments(),
            verifiedNGOs: await User.countDocuments({ 
                userType: 'ngo', 
                isVerified: true 
            })
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get pending NGO verifications
export const getPendingVerifications = async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const pendingNGOs = await User.find({ 
            userType: 'ngo', 
            isVerified: false 
        })
        .select('name email profilePicture createdAt organizationType')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await User.countDocuments({ 
            userType: 'ngo', 
            isVerified: false 
        });

        res.json({
            ngos: pendingNGOs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalCount: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching pending verifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify an NGO
export const verifyNGO = async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        const { ngoId } = req.params;
        const { adminNotes } = req.body;

        const ngo = await User.findById(ngoId);
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        if (ngo.userType !== 'ngo') {
            return res.status(400).json({ message: 'User is not an NGO' });
        }

        // Update NGO verification status
        ngo.isVerified = true;
        ngo.verifiedAt = new Date();
        ngo.verifiedBy = req.user._id;
        await ngo.save();

        // Create notification for NGO
        await createNotification({
            userId: ngoId,
            type: 'verification_approved',
            title: '🎉 Verification Approved!',
            message: 'Congratulations! Your NGO has been verified. You now have a blue verification badge.',
            data: { actionUrl: '/profile' }
        });

        res.json({ 
            message: 'NGO verified successfully',
            ngo: {
                id: ngo._id,
                name: ngo.name,
                isVerified: ngo.isVerified,
                verifiedAt: ngo.verifiedAt
            }
        });
    } catch (error) {
        console.error('Error verifying NGO:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reject NGO verification
export const rejectNGOVerification = async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        const { ngoId } = req.params;
        const { reason } = req.body;

        const ngo = await User.findById(ngoId);
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        // Create notification for NGO
        await createNotification({
            userId: ngoId,
            type: 'verification_rejected',
            title: '❌ Verification Rejected',
            message: `Your verification request has been rejected. Reason: ${reason}`,
            data: { actionUrl: '/profile' }
        });

        res.json({ message: 'Verification rejected and NGO notified' });
    } catch (error) {
        console.error('Error rejecting verification:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get pending reports
export const getPendingReports = async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const reports = await Report.find({ status: 'pending' })
            .populate('reportedBy', 'name email')
            .populate('donationId', 'title description images createdBy')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Report.countDocuments({ status: 'pending' });

        res.json({
            reports,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalCount: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching pending reports:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Review a report
export const reviewReport = async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        const { reportId } = req.params;
        const { action, adminNotes } = req.body;

        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Update report
        report.status = 'reviewed';
        report.reviewedBy = req.user._id;
        report.reviewedAt = new Date();
        report.adminNotes = adminNotes;
        report.actionTaken = action;

        await report.save();

        // Take action based on admin decision
        if (action === 'donation_removed') {
            await Donation.findByIdAndUpdate(report.donationId, { 
                isActive: false,
                moderationNotes: 'Removed due to inappropriate content report'
            });
        }

        // Notify the reporter
        await createNotification({
            userId: report.reportedBy,
            type: 'report_reviewed',
            title: '📝 Report Reviewed',
            message: `Your report has been reviewed. Action taken: ${action.replace('_', ' ')}`,
            data: { actionUrl: '/reports' }
        });

        res.json({ message: 'Report reviewed successfully', report });
    } catch (error) {
        console.error('Error reviewing report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all verified NGOs
export const getVerifiedNGOs = async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const verifiedNGOs = await User.find({ 
            userType: 'ngo', 
            isVerified: true 
        })
        .select('name email profilePicture verifiedAt organizationType')
        .populate('verifiedBy', 'name')
        .sort({ verifiedAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await User.countDocuments({ 
            userType: 'ngo', 
            isVerified: true 
        });

        res.json({
            ngos: verifiedNGOs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalCount: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching verified NGOs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
