import React, { useState, useEffect } from 'react';
import { 
    UsersIcon, 
    FlagIcon, 
    CheckBadgeIcon,
    GiftIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../LoadingSpinner';
import { apiRequest } from '../../utils/api';

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await apiRequest('/api/admin/stats');

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                setError('Failed to fetch stats');
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Pending Verifications',
            value: stats?.pendingVerifications || 0,
            icon: CheckBadgeIcon,
            color: 'blue',
            description: 'NGOs waiting for verification'
        },
        {
            title: 'Pending Reports',
            value: stats?.pendingReports || 0,
            icon: FlagIcon,
            color: 'red',
            description: 'Reports requiring review'
        },
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: UsersIcon,
            color: 'green',
            description: 'Registered users'
        },
        {
            title: 'Total Donations',
            value: stats?.totalDonations || 0,
            icon: GiftIcon,
            color: 'purple',
            description: 'Donations posted'
        },
        {
            title: 'Verified NGOs',
            value: stats?.verifiedNGOs || 0,
            icon: CheckBadgeIcon,
            color: 'emerald',
            description: 'Verified organizations'
        }
    ];

    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            icon: 'text-blue-600',
            accent: 'text-blue-600'
        },
        red: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            accent: 'text-red-600'
        },
        green: {
            bg: 'bg-green-50',
            icon: 'text-green-600',
            accent: 'text-green-600'
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'text-purple-600',
            accent: 'text-purple-600'
        },
        emerald: {
            bg: 'bg-emerald-50',
            icon: 'text-emerald-600',
            accent: 'text-emerald-600'
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    const colors = colorClasses[stat.color];
                    
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className={`text-3xl font-bold ${colors.accent}`}>
                                        {stat.value.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {stat.description}
                                    </p>
                                </div>
                                <div className={`${colors.bg} p-3 rounded-lg`}>
                                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed 
                                 border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 
                                 transition-all duration-200 group"
                    >
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-pink-500" fill="none" 
                             stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-gray-600 group-hover:text-pink-600">Refresh Stats</span>
                    </button>
                    
                    <div className="flex items-center justify-center space-x-2 p-4 bg-gray-50 rounded-lg">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-800 font-medium">Database Connection</span>
                        </div>
                        <span className="text-green-600 text-sm">Healthy</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-800 font-medium">API Services</span>
                        </div>
                        <span className="text-green-600 text-sm">Operational</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-800 font-medium">Notification System</span>
                        </div>
                        <span className="text-green-600 text-sm">Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;