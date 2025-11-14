import React, { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';
import { apiRequest } from '../utils/api';

const ReportModal = ({ isOpen, onClose, donationId, donationTitle }) => {
    const [formData, setFormData] = useState({
        reportType: '',
        reason: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const reportTypes = [
        { value: 'inappropriate_content', label: 'Inappropriate Content' },
        { value: 'fake_donation', label: 'Fake Donation' },
        { value: 'spam', label: 'Spam' },
        { value: 'misleading_info', label: 'Misleading Information' },
        { value: 'other', label: 'Other' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.reportType || !formData.reason.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await apiRequest('/api/reports', {
                method: 'POST',
                body: JSON.stringify({
                    donationId,
                    reportType: formData.reportType,
                    reason: formData.reason
                })
            });

            if (response.ok) {
                setIsSuccess(true);
                // Reset form
                setFormData({ reportType: '', reason: '' });
                // Auto close after 2 seconds
                setTimeout(() => {
                    setIsSuccess(false);
                    onClose();
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({ reportType: '', reason: '' });
            setError('');
            setIsSuccess(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                        <h2 className="text-xl font-semibold text-gray-900">Report Donation</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Submitted</h3>
                            <p className="text-gray-600">Thank you for your report. Our team will review it shortly.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <p className="text-gray-600 mb-2">You are reporting:</p>
                                <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                                    {donationTitle}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Report Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Report Type *
                                    </label>
                                    <select
                                        value={formData.reportType}
                                        onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                                 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                        required
                                    >
                                        <option value="">Select a reason</option>
                                        {reportTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Details *
                                    </label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        placeholder="Please provide specific details about why you're reporting this donation..."
                                        rows={4}
                                        maxLength={500}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                                 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.reason.length}/500 characters
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                                                 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.reportType || !formData.reason.trim()}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                                                 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
                                                 flex items-center justify-center space-x-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <span>Submit Report</span>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-xs text-yellow-700">
                                    <strong>Note:</strong> False reports may result in account restrictions. 
                                    Please only report content that genuinely violates our community guidelines.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportModal;