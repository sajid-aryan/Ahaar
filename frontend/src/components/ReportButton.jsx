import React, { useState } from 'react';
import { FlagIcon } from '@heroicons/react/24/outline';
import ReportModal from './ReportModal';

const ReportButton = ({ donationId, donationTitle, className = "" }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-red-600 
                           hover:bg-red-50 rounded-lg transition-all duration-200 text-sm ${className}`}
                title="Report inappropriate content"
            >
                <FlagIcon className="h-4 w-4" />
                <span>Report</span>
            </button>

            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                donationId={donationId}
                donationTitle={donationTitle}
            />
        </>
    );
};

export default ReportButton;