import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCreatorStats, getCreatorPosts } from '../../services/dashboard';
import StatCard from './components/StatCard';
import ActivityCard from './components/ActivityCard';
import RevenueChart from './components/RevenueChart';
import EngagementChart from './components/EngagementChart';
import PostCard from './components/PostCard';

const CreatorDashboard = ({ isDarkMode, user, dashboardData }) => {
    const [stats, setStats] = useState({
        totalSubscribers: 0,
        monthlyRevenue: 0,
        totalPosts: 0,
        engagement: 0,
        growth: '+12%'
    });
    const [posts, setPosts] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [engagementData, setEngagementData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCreatorData = async () => {
            try {
                setLoading(true);

                const [subscribersData, postsData] = await Promise.all([
                    getCreatorStats().catch(err => ({ data: [] })),
                    getCreatorPosts().catch(err => ({ data: [] }))
                ]);

                const subs = Array.isArray(subscribersData) ? subscribersData : (subscribersData?.data || []);
                const postsArray = Array.isArray(postsData) ? postsData : (postsData?.data || []);

                setSubscribers(subs);
                setPosts(postsArray);

                // Calculate stats
                const monthlyRevenue = subs.length * (dashboardData?.fee || 15); // Assuming average fee
                setStats({
                    totalSubscribers: subs.length,
                    monthlyRevenue: monthlyRevenue,
                    totalPosts: postsArray.length,
                    engagement: Math.floor(Math.random() * 95) + 60, // Mock engagement rate
                    growth: subs.length > 10 ? '+12%' : '+5%'
                });

                // Mock revenue data for chart
                setRevenueData([
                    { month: 'Jan', revenue: monthlyRevenue * 0.6 },
                    { month: 'Feb', revenue: monthlyRevenue * 0.7 },
                    { month: 'Mar', revenue: monthlyRevenue * 0.8 },
                    { month: 'Apr', revenue: monthlyRevenue * 0.9 },
                    { month: 'May', revenue: monthlyRevenue * 0.95 },
                    { month: 'Jun', revenue: monthlyRevenue }
                ]);

                // Mock engagement data
                setEngagementData([
                    { day: 'Mon', likes: 45, comments: 12, shares: 8 },
                    { day: 'Tue', likes: 52, comments: 18, shares: 6 },
                    { day: 'Wed', likes: 38, comments: 9, shares: 12 },
                    { day: 'Thu', likes: 61, comments: 22, shares: 15 },
                    { day: 'Fri', likes: 55, comments: 16, shares: 10 },
                    { day: 'Sat', likes: 48, comments: 14, shares: 7 },
                    { day: 'Sun', likes: 42, comments: 11, shares: 9 }
                ]);

            } catch (error) {
                console.error('Failed to fetch creator data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCreatorData();
    }, [dashboardData]);

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
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Creator Studio 🎨
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Welcome back, {user?.username || 'Creator'}! Here's how your content is performing
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Subscribers"
                    value={stats.totalSubscribers}
                    icon="👥"
                    trend={stats.growth + " this month"}
                    isDarkMode={isDarkMode}
                    highlight={true}
                />
                <StatCard
                    title="Monthly Revenue"
                    value={`$${stats.monthlyRevenue}`}
                    icon="💰"
                    trend="+15% vs last month"
                    isDarkMode={isDarkMode}
                />
                <StatCard
                    title="Total Posts"
                    value={stats.totalPosts}
                    icon="📝"
                    trend="+3 this week"
                    isDarkMode={isDarkMode}
                />
                <StatCard
                    title="Engagement Rate"
                    value={`${stats.engagement}%`}
                    icon="📊"
                    trend="Above average"
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <RevenueChart data={revenueData} isDarkMode={isDarkMode} />
                <EngagementChart data={engagementData} isDarkMode={isDarkMode} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Posts */}
                <div className="lg:col-span-2">
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Recent Posts
                            </h2>
                            <Link
                                to="/create-post"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                + Create Post
                            </Link>
                        </div>

                        {posts.length > 0 ? (
                            <div className="space-y-4">
                                {posts.slice(0, 3).map((post, index) => (
                                    <PostCard
                                        key={post._id || index}
                                        post={post}
                                        isDarkMode={isDarkMode}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    No posts yet
                                </h3>
                                <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Create your first post to start engaging with your audience
                                </p>
                                <Link
                                    to="/create-post"
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Create Your First Post
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Quick Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profile Views</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,234</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Post Views</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>5,678</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Likes</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>892</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comments</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>156</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <ActivityCard
                        title="Recent Activity"
                        activities={[
                            { action: "New subscriber joined", time: "1 hour ago", icon: "🎉" },
                            { action: "Post got 25 new likes", time: "3 hours ago", icon: "❤️" },
                            { action: "New comment received", time: "5 hours ago", icon: "💬" },
                            { action: "Revenue milestone reached", time: "1 day ago", icon: "🏆" }
                        ]}
                        isDarkMode={isDarkMode}
                    />

                    {/* Quick Actions */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Link
                                to="/create-post"
                                className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span className="flex items-center">
                                    📝 <span className="ml-3">Create New Post</span>
                                </span>
                            </Link>
                            <Link
                                to="/edit-profile"
                                className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span className="flex items-center">
                                    ⚙️ <span className="ml-3">Edit Profile</span>
                                </span>
                            </Link>
                            <Link
                                to="/analytics"
                                className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span className="flex items-center">
                                    📊 <span className="ml-3">View Analytics</span>
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gradient-to-br from-green-900 to-blue-900 border-green-700' : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            💡 Pro Tip
                        </h3>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Posting consistently increases subscriber engagement by 40%
                        </p>
                        <button className={`inline-flex items-center text-sm font-medium ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'} transition-colors`}>
                            Learn More Tips →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard;
