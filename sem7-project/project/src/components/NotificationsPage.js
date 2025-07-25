import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const notifications = [
  {
    id: 1,
    title: 'New Follower',
    message: 'Alex Smith started following you.',
    time: '2 minutes ago',
    type: 'follow',
  },
  {
    id: 2,
    title: 'Subscription',
    message: 'You have a new subscriber: Jane Doe.',
    time: '10 minutes ago',
    type: 'subscription',
  },
  {
    id: 3,
    title: 'Comment',
    message: 'Emily commented on your post.',
    time: '1 hour ago',
    type: 'comment',
  },
];

const iconMap = {
  follow: (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9a3 3 0 11-6 0 3 3 0 016 0zM6 21v-2a4 4 0 014-4h0a4 4 0 014 4v2" />
    </svg>
  ),
  subscription: (
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v1a3 3 0 006 0v-1c0-1.657-1.343-3-3-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
    </svg>
  ),
  comment: (
    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
};

const NotificationsPage = ({ isDarkMode, toggleTheme, isLoggedIn, logout }) => (
  <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
    <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} logout={logout} />
    <div className="max-w-2xl mx-auto pt-24 pb-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-400">No notifications yet.</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-xl shadow transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div>{iconMap[notif.type]}</div>
              <div className="flex-1">
                <div className="font-semibold">{notif.title}</div>
                <div className="text-sm">{notif.message}</div>
                <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    <Footer isDarkMode={isDarkMode} />
  </div>
);

export default NotificationsPage; 