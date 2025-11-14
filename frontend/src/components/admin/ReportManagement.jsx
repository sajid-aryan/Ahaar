import React, { useState, useEffect } from 'react';
import { 
    FlagIcon, 
    EyeIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    TrashIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../LoadingSpinner';
import { apiRequest } from '../../utils/api';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({
        action: '',
        adminNotes: ''
    });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPendingReports();
    }, []);

    const fetchPendingReports = async () => {
        setLoading(true);
        try {
            const response = await apiRequest('/api/admin/reports/pending');

            if (response.ok) {
                const data = await response.json();
                setReports(data.reports);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewReport = async () => {
        if (!reviewData.action || !reviewData.adminNotes.trim()) {
            alert('Please provide both action and notes');
            return;
        }

        setActionLoading(true);
        try {
            const response = await apiRequest(`/api/admin/reports/${selectedReport._id}/review`, {
                method: 'POST',
                body: JSON.stringify(reviewData)
            });

            if (response.ok) {
                // Remove from reports list
                setReports(reports.filter(report => report._id !== selectedReport._id));
                setShowReviewModal(false);
                setSelectedReport(null);
                setReviewData({ action: '', adminNotes: '' });
                alert('Report reviewed successfully!');
            } else {
                alert('Failed to review report');
            }
        } catch (error) {
            console.error('Error reviewing report:', error);
            alert('Error reviewing report');
        } finally {
            setActionLoading(false);
        }
    };

    const getReportTypeLabel = (type) => {
        const labels = {
            'inappropriate_content': 'Inappropriate Content',
            'fake_donation': 'Fake Donation',
            'spam': 'Spam',
            'misleading_info': 'Misleading Information',
            'other': 'Other'
        };
        return labels[type] || type;
    };

    const getReportTypeColor = (type) => {
        const colors = {
            'inappropriate_content': 'bg-red-100 text-red-800',
            'fake_donation': 'bg-orange-100 text-orange-800',
            'spam': 'bg-yellow-100 text-yellow-800',
            'misleading_info': 'bg-blue-100 text-blue-800',
            'other': 'bg-gray-100 text-gray-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const actionOptions = [
        { value: 'none', label: 'No Action Required' },
        { value: 'warning_sent', label: 'Send Warning to User' },
        { value: 'donation_removed', label: 'Remove Donation' },
        { value: 'user_suspended', label: 'Suspend User' }
    ];

    const ReportCard = ({ report }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <FlagIcon className="h-5 w-5 text-red-500" />
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReportTypeColor(report.reportType)}`}>
                        {getReportTypeLabel(report.reportType)}
                    </span>
                </div>
                <span className="text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                </span>
            </div>

            <div className="space-y-3">
                <div>
                    <h4 className="font-medium text-gray-900 mb-1">Reported Donation:</h4>
                    <p className="text-gray-700">{report.donationId?.title || 'Donation not found'}</p>
                </div>

                <div>
                    <h4 className="font-medium text-gray-900 mb-1">Reported by:</h4>
                    <p className="text-gray-700">{report.reportedBy?.name} ({report.reportedBy?.email})</p>
                </div>

                <div>
                    <h4 className="font-medium text-gray-900 mb-1">Reason:</h4>
                    <p className="text-gray-700 text-sm">{report.reason}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Pending Review</span>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedReport(report);
                            setShowReviewModal(true);
                        }}
                        className="flex items-center space-x-1 px-3 py-2 bg-pink-600 text-white rounded-lg 
                                 hover:bg-pink-700 transition-colors text-sm"
                    >
                        <EyeIcon className="h-4 w-4" />
                        <span>Review</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Report Management</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FlagIcon className="h-4 w-4" />
                    <span>{reports.length} pending reports</span>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : reports.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <FlagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Reports</h3>
                    <p className="text-gray-600">All reports have been reviewed and resolved.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reports.map(report => (
                        <ReportCard key={report._id} report={report} />
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Review Report</h3>
                            
                            {/* Report Details */}
                            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Report Type:</label>
                                        <p className="text-gray-900">{getReportTypeLabel(selectedReport.reportType)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Reported on:</label>
                                        <p className="text-gray-900">{new Date(selectedReport.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Donation:</label>
                                    <p className="text-gray-900">{selectedReport.donationId?.title}</p>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Reported by:</label>
                                    <p className="text-gray-900">{selectedReport.reportedBy?.name} ({selectedReport.reportedBy?.email})</p>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Reason:</label>
                                    <p className="text-gray-900">{selectedReport.reason}</p>
                                </div>
                            </div>

                            {/* Review Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Action to Take *
                                    </label>
                                    <select
                                        value={reviewData.action}
                                        onChange={(e) => setReviewData({ ...reviewData, action: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                                 focus:ring-pink-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select an action</option>
                                        {actionOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Admin Notes *
                                    </label>
                                    <textarea
                                        value={reviewData.adminNotes}
                                        onChange={(e) => setReviewData({ ...reviewData, adminNotes: e.target.value })}
                                        placeholder="Provide detailed notes about your decision..."
                                        rows={4}
                                        maxLength={1000}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                                 focus:ring-pink-500 focus:border-transparent resize-none"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {reviewData.adminNotes.length}/1000 characters
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowReviewModal(false);
                                        setSelectedReport(null);
                                        setReviewData({ action: '', adminNotes: '' });
                                    }}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                                             hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReviewReport}
                                    disabled={actionLoading || !reviewData.action || !reviewData.adminNotes.trim()}
                                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 
                                             transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {actionLoading ? (
                                        <>
                                            <LoadingSpinner size="sm" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>Complete Review</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;