import React, { useState, useEffect } from 'react';
import { getAllCreators } from '../../services/dashboard';
import StatCard from './components/StatCard';
import PlatformChart from './components/PlatformChart';
import UserTable from './components/UserTable';

const AdminDashboard = ({ isDarkMode }) => {
    const [platformStats, setPlatformStats] = useState({
        totalUsers: 0,
        totalCreators: 0,
        totalRevenue: 0,
        activeSubscriptions: 0,
        growth: '+23%'
    });
    const [creators, setCreators] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);

                // Fetch creators data
                const creatorsData = await getAllCreators().catch(err => ({ data: [] }));
                const creatorsArray = Array.isArray(creatorsData) ? creatorsData : (creatorsData?.data || []);
                setCreators(creatorsArray);

                // Calculate platform stats
                const totalCreators = creatorsArray.length;
                const estimatedUsers = totalCreators * 15; // Estimate 15 subscribers per creator
                const estimatedRevenue = totalCreators * 500; // Average revenue per creator
                const activeSubscriptions = Math.floor(estimatedUsers * 0.8);

                setPlatformStats({
                    totalUsers: estimatedUsers,
                    totalCreators: totalCreators,
                    totalRevenue: estimatedRevenue,
                    activeSubscriptions: activeSubscriptions,
                    growth: '+23%'
                });

                // Mock chart data for platform growth
                setChartData([
                    { month: 'Jan', users: Math.floor(estimatedUsers * 0.6), revenue: Math.floor(estimatedRevenue * 0.6) },
                    { month: 'Feb', users: Math.floor(estimatedUsers * 0.7), revenue: Math.floor(estimatedRevenue * 0.7) },
                    { month: 'Mar', users: Math.floor(estimatedUsers * 0.8), revenue: Math.floor(estimatedRevenue * 0.8) },
                    { month: 'Apr', users: Math.floor(estimatedUsers * 0.85), revenue: Math.floor(estimatedRevenue * 0.85) },
                    { month: 'May', users: Math.floor(estimatedUsers * 0.93), revenue: Math.floor(estimatedRevenue * 0.93) },
                    { month: 'Jun', users: estimatedUsers, revenue: estimatedRevenue }
                ]);

                // Mock recent activity
                setRecentActivity([
                    { type: 'user', action: 'New creator registered', user: 'TechGuru2024', time: '2 minutes ago' },
                    { type: 'revenue', action: 'Payment processed', amount: '$49.99', time: '15 minutes ago' },
                    { type: 'content', action: 'Post reported', post: 'Advanced React Tips', time: '1 hour ago' },
                    { type: 'user', action: 'User subscription cancelled', user: 'john_doe', time: '2 hours ago' },
                    { type: 'system', action: 'Database backup completed', time: '3 hours ago' }
                ]);

            } catch (error) {
                console.error('Failed to fetch admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className={`h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-6`}></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl`}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Admin Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Admin Dashboard 🛡️
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Platform overview and management center
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                        System Status: Healthy
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('adminToken');
                            localStorage.removeItem('adminUser');
                            window.location.href = '/';
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        Logout Admin
                    </button>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={platformStats.totalUsers.toLocaleString()}
                    icon="👤"
                    trend={platformStats.growth + " growth"}
                    isDarkMode={isDarkMode}
                    highlight={true}
                />
                <StatCard
                    title="Active Creators"
                    value={platformStats.totalCreators}
                    icon="🎨"
                    trend="+12 this month"
                    isDarkMode={isDarkMode}
                />
                <StatCard
                    title="Platform Revenue"
                    value={`$${platformStats.totalRevenue.toLocaleString()}`}
                    icon="💰"
                    trend="+18% vs last month"
                    isDarkMode={isDarkMode}
                    highlight={true}
                />
                <StatCard
                    title="Active Subscriptions"
                    value={platformStats.activeSubscriptions.toLocaleString()}
                    icon="📊"
                    trend="85% retention rate"
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <PlatformChart data={chartData} isDarkMode={isDarkMode} />

                {/* System Health */}
                <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        System Health
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Server Uptime</span>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>99.9%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Database Performance</span>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Optimal</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>API Response Time</span>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>142ms</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Storage Usage</span>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>68% Used</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Recent Activity
                            </h2>
                            <button className={`text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}>
                                View All →
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                                        activity.type === 'revenue' ? 'bg-green-100 text-green-600' :
                                            activity.type === 'content' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {activity.type === 'user' ? '👤' :
                                            activity.type === 'revenue' ? '💰' :
                                                activity.type === 'content' ? '📝' : '⚙️'}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {activity.action}
                                        </p>
                                        {activity.user && (
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                User: {activity.user}
                                            </p>
                                        )}
                                        {activity.amount && (
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Amount: {activity.amount}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {activity.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Admin Actions
                        </h3>
                        <div className="space-y-3">
                            <button className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                                <span className="flex items-center">
                                    👥 <span className="ml-3">Manage Users</span>
                                </span>
                            </button>
                            <button className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                                <span className="flex items-center">
                                    🎨 <span className="ml-3">Review Creators</span>
                                </span>
                            </button>
                            <button className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                                <span className="flex items-center">
                                    📊 <span className="ml-3">View Reports</span>
                                </span>
                            </button>
                            <button className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                                <span className="flex items-center">
                                    ⚙️ <span className="ml-3">System Settings</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Platform Alerts */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>
                            ⚠️ Platform Alerts
                        </h3>
                        <div className="space-y-3">
                            <div className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                                • 3 posts pending review
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                                • 1 payment dispute requires attention
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                                • Server maintenance scheduled for tonight
                            </div>
                        </div>
                    </div>

                    {/* Top Creators */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Top Creators
                        </h3>
                        <div className="space-y-3">
                            {creators.slice(0, 5).map((creator, index) => (
                                <div key={creator._id} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                        index === 1 ? 'bg-gray-100 text-gray-600' :
                                            index === 2 ? 'bg-orange-100 text-orange-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {creator.username}
                                        </p>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {creator.category || 'General'}
                                        </p>
                                    </div>
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        ${creator.fee || 15}/mo
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
