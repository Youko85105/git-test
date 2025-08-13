import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import FactsPage from './components/FactsPage';
import AboutPage from './components/AboutPage';
import LoginPage from './components/LoginPage';
import EditProfile from './components/EditProfile';
import NotificationsPage from './components/NotificationsPage';
import CommentsDemo from './components/CommentsDemo';
import './components/comments.css';
import PostPageWrapper from "./components/PostPageWrapper";
import CreatorProfile from './components/CreatorProfile';
import CreatorsPage from './components/CreatorsPage';
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Homepage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/facts" element={<FactsPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/about" element={<AboutPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/login" element={<LoginPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/creator/:id" element={<CreatorProfile isDarkMode={isDarkMode} />} />
          <Route path="/creators" element={<CreatorsPage isDarkMode={isDarkMode} />} />

          {/* Protected pages */}
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comments-demo"
            element={
              <ProtectedRoute>
                <CommentsDemo isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <PostPageWrapper isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
