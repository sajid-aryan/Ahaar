import Report from '../models/Report.js';
import Donation from '../models/Donation.js';
import { createNotification } from './notificationController.js';

// Create a new report
export const createReport = async (req, res) => {
    try {
        const { donationId, reportType, reason } = req.body;

        // Check if donation exists
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Check if user already reported this donation
        const existingReport = await Report.findOne({
            reportedBy: req.user._id,
            donationId: donationId
        });

        if (existingReport) {
            return res.status(400).json({ message: 'You have already reported this donation' });
        }

        // Create new report
        const report = new Report({
            reportedBy: req.user._id,
            donationId,
            reportType,
            reason
        });

        await report.save();

        // Notify admins about new report (you can implement admin notification system)
        // For now, we'll just send success response

        res.status(201).json({ 
            message: 'Report submitted successfully. Our team will review it shortly.',
            reportId: report._id
        });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's reports
export const getUserReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const reports = await Report.find({ reportedBy: req.user._id })
            .populate('donationId', 'title description images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Report.countDocuments({ reportedBy: req.user._id });

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
        console.error('Error fetching user reports:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get report details
export const getReportDetails = async (req, res) => {
    try {
        const { reportId } = req.params;

        const report = await Report.findById(reportId)
            .populate('reportedBy', 'name email')
            .populate('donationId', 'title description images createdBy')
            .populate('reviewedBy', 'name');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Check if user has permission to view this report
        if (req.user.userType !== 'admin' && report.reportedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(report);
    } catch (error) {
        console.error('Error fetching report details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update report status (for users to withdraw reports)
export const updateReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { action } = req.body;

        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Check if user owns this report
        if (report.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Only allow withdrawal if report is still pending
        if (report.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot modify report after it has been reviewed' });
        }

        if (action === 'withdraw') {
            report.status = 'dismissed';
            await report.save();
            
            res.json({ message: 'Report withdrawn successfully' });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
