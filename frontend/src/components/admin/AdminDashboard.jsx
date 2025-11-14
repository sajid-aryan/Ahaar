import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import AdminStats from './AdminStats';
import UserManagement from './UserManagement';
import ReportManagement from './ReportManagement';
import LoadingSpinner from '../LoadingSpinner';
import { 
    ChartBarIcon, 
    UsersIcon, 
    FlagIcon,
    ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        if (!user || user.userType !== 'admin') {
            // Redirect to home or show unauthorized message
            return;
        }
        setLoading(false);
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!user || user.userType !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <ShieldCheckIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'stats', name: 'Dashboard', icon: ChartBarIcon },
        { id: 'users', name: 'User Management', icon: UsersIcon },
        { id: 'reports', name: 'Reports', icon: FlagIcon }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-1">Manage users, donations, and reports</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
                            <span className="text-sm font-medium text-blue-600">Admin Panel</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === tab.id
                                            ? 'border-pink-500 text-pink-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'stats' && <AdminStats />}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'reports' && <ReportManagement />}
            </div>
        </div>
    );
};

export default AdminDashboard;