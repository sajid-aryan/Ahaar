import React from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

const VerificationBadge = ({ isVerified, size = 'sm', showText = false, className = '' }) => {
    if (!isVerified) return null;

    const sizeClasses = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8'
    };

    const textSizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg'
    };

    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            <CheckBadgeIcon 
                className={`${sizeClasses[size]} text-blue-500`}
                title="Verified Organization"
            />
            {showText && (
                <span className={`text-blue-600 font-medium ${textSizeClasses[size]}`}>
                    Verified
                </span>
            )}
        </div>
    );
};

export default VerificationBadge;