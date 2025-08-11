import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import FactsPage from './components/FactsPage';
import AboutPage from './components/AboutPage';
import LoginPage from './components/LoginPage';
import EditProfile from './components/EditProfile';
import NotificationsPage from './components/NotificationsPage';
import CommentsDemo from './components/CommentsDemo';
import './components/comments.css';
import PostPage from './components/PostPage'; // ✅ make sure this file exists
import PostPageWrapper from "./components/PostPageWrapper";
import CreatorProfile from './components/CreatorProfile';
import CreatorsPage from './components/CreatorsPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Simple auth state (mock)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Mock login/logout
  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage isDarkMode={isDarkMode} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} logout={logout} />} />
        <Route path="/facts" element={<FactsPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
        <Route path="/about" element={<AboutPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
        <Route path="/login" element={<LoginPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} login={login} />} />
        <Route path="/edit-profile" element={isLoggedIn ? <EditProfile isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> : <Navigate to="/login" replace />} />
        <Route path="/notifications" element={<NotificationsPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} logout={logout} />} />
        <Route path="/comments-demo" element={<CommentsDemo isDarkMode={isDarkMode} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} logout={logout} />} />
        <Route
          path="/posts/:id"
          element={
            <PostPageWrapper
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              isLoggedIn={isLoggedIn}
              logout={logout}
            />
          }
        />
        <Route path="/creator/:id" element={<CreatorProfile isDarkMode={isDarkMode} />} />
        <Route path="/creators" element={<CreatorsPage isDarkMode={isDarkMode} />} />
      </Routes>
    </div>
  );
}

export default App; 