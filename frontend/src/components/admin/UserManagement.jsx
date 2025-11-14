import React, { useState, useEffect } from 'react';
import { 
    CheckBadgeIcon, 
    XMarkIcon,
    EyeIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../LoadingSpinner';
import VerificationBadge from '../VerificationBadge';
import { apiRequest } from '../../utils/api';

const UserManagement = () => {
    const [activeView, setActiveView] = useState('pending');
    const [pendingNGOs, setPendingNGOs] = useState([]);
    const [verifiedNGOs, setVerifiedNGOs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [pagination, setPagination] = useState({});
    const [selectedNGO, setSelectedNGO] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        if (activeView === 'pending') {
            fetchPendingVerifications();
        } else {
            fetchVerifiedNGOs();
        }
    }, [activeView]);

    const fetchPendingVerifications = async (page = 1) => {
        setLoading(true);
        try {
            const response = await apiRequest(`/api/admin/verifications/pending?page=${page}`);

            if (response.ok) {
                const data = await response.json();
                setPendingNGOs(data.ngos);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching pending verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVerifiedNGOs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await apiRequest(`/api/admin/verifications/verified?page=${page}`);

            if (response.ok) {
                const data = await response.json();
                setVerifiedNGOs(data.ngos);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching verified NGOs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (ngoId) => {
        setActionLoading({ ...actionLoading, [ngoId]: 'approving' });
        try {
            const response = await apiRequest(`/api/admin/verifications/${ngoId}/approve`, {
                method: 'POST'
            });

            if (response.ok) {
                // Remove from pending list
                setPendingNGOs(pendingNGOs.filter(ngo => ngo._id !== ngoId));
                // Show success message or refresh
                alert('NGO verification approved successfully!');
            } else {
                alert('Failed to approve verification');
            }
        } catch (error) {
            console.error('Error approving verification:', error);
            alert('Error approving verification');
        } finally {
            setActionLoading({ ...actionLoading, [ngoId]: null });
        }
    };

    const handleReject = async () => {
        if (!selectedNGO || !rejectReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        setActionLoading({ ...actionLoading, [selectedNGO._id]: 'rejecting' });
        try {
            const response = await apiRequest(`/api/admin/verifications/${selectedNGO._id}/reject`, {
                method: 'POST',
                body: JSON.stringify({ reason: rejectReason })
            });

            if (response.ok) {
                // Remove from pending list
                setPendingNGOs(pendingNGOs.filter(ngo => ngo._id !== selectedNGO._id));
                setShowRejectModal(false);
                setSelectedNGO(null);
                setRejectReason('');
                alert('Verification rejected and NGO notified');
            } else {
                alert('Failed to reject verification');
            }
        } catch (error) {
            console.error('Error rejecting verification:', error);
            alert('Error rejecting verification');
        } finally {
            setActionLoading({ ...actionLoading, [selectedNGO._id]: null });
        }
    };

    const NGOCard = ({ ngo, isPending = true }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
                <img
                    src={ngo.profilePicture || '/default-avatar.png'}
                    alt={ngo.name}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ngo.name}</h3>
                        {!isPending && <VerificationBadge isVerified={true} size="sm" />}
                    </div>
                    <p className="text-gray-600 text-sm">{ngo.email}</p>
                    <p className="text-gray-500 text-sm mt-1">
                        {ngo.organizationType && `Type: ${ngo.organizationType}`}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                        {isPending ? 'Applied' : 'Verified'}: {new Date(isPending ? ngo.createdAt : ngo.verifiedAt).toLocaleDateString()}
                    </p>
                    {!isPending && ngo.verifiedBy && (
                        <p className="text-gray-500 text-xs">
                            Verified by: {ngo.verifiedBy.name}
                        </p>
                    )}
                </div>
                {isPending && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleApprove(ngo._id)}
                            disabled={actionLoading[ngo._id]}
                            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg 
                                     hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {actionLoading[ngo._id] === 'approving' ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <CheckBadgeIcon className="h-4 w-4" />
                            )}
                            <span>Approve</span>
                        </button>
                        <button
                            onClick={() => {
                                setSelectedNGO(ngo);
                                setShowRejectModal(true);
                            }}
                            disabled={actionLoading[ngo._id]}
                            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg 
                                     hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {actionLoading[ngo._id] === 'rejecting' ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <XMarkIcon className="h-4 w-4" />
                            )}
                            <span>Reject</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header and Tabs */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setActiveView('pending')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            activeView === 'pending'
                                ? 'bg-pink-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <ClockIcon className="h-4 w-4" />
                        <span>Pending Verifications</span>
                    </button>
                    <button
                        onClick={() => setActiveView('verified')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            activeView === 'verified'
                                ? 'bg-pink-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <CheckBadgeIcon className="h-4 w-4" />
                        <span>Verified NGOs</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="space-y-4">
                    {activeView === 'pending' ? (
                        pendingNGOs.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Verifications</h3>
                                <p className="text-gray-600">All NGO verification requests have been processed.</p>
                            </div>
                        ) : (
                            pendingNGOs.map(ngo => (
                                <NGOCard key={ngo._id} ngo={ngo} isPending={true} />
                            ))
                        )
                    ) : (
                        verifiedNGOs.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <CheckBadgeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Verified NGOs</h3>
                                <p className="text-gray-600">No NGOs have been verified yet.</p>
                            </div>
                        ) : (
                            verifiedNGOs.map(ngo => (
                                <NGOCard key={ngo._id} ngo={ngo} isPending={false} />
                            ))
                        )
                    )}
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Reject Verification Request
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Please provide a reason for rejecting <strong>{selectedNGO?.name}</strong>'s verification request:
                            </p>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                         focus:ring-pink-500 focus:border-transparent resize-none"
                            />
                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setSelectedNGO(null);
                                        setRejectReason('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                                             hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectReason.trim() || actionLoading[selectedNGO?._id]}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                                             transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {actionLoading[selectedNGO?._id] ? (
                                        <>
                                            <LoadingSpinner size="sm" />
                                            <span>Rejecting...</span>
                                        </>
                                    ) : (
                                        <span>Reject</span>
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

export default UserManagement;