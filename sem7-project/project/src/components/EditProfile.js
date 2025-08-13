import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';                  // already used elsewhere
const API = process.env.REACT_APP_API_URL;  // e.g. http://localhost:3000/api

const DEFAULT_IMAGE = '/images/creator-laptop.jpg';

const EditProfile = ({ isDarkMode, toggleTheme }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    password: '',
    image: DEFAULT_IMAGE,
  });
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
  const run = async () => {
    try {
      const { data } = await axios.get(`${API}/private/dashboard`);
      const pic = data.profilePic && (data.profilePic.url || data.profilePic);
      setProfile({
        name: data.username || data.name || '',
        email: data.email || '',
        bio: data.bio || '',
        password: '',
        image: pic || DEFAULT_IMAGE,
      });
      setImagePreview(pic || DEFAULT_IMAGE);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };
  run();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setImageFile(file);
  setImagePreview(URL.createObjectURL(file)); // preview
  // (do NOT put base64 in state you send to server)
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const fd = new FormData();
    fd.append('username', profile.name);   // backend reads req.body.username
    fd.append('bio', profile.bio || '');
    // optional: uncomment if you really intend to allow these here
    // fd.append('email', profile.email);
    // fd.append('password', profile.password);

    if (imageFile) fd.append('profilePic', imageFile); // MUST match upload.single('profilePic')

    await axios.patch(`${API}/private/dashboard`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Backend returns only role; fetch fresh user data to update UI
    const { data } = await axios.get(`${API}/private/dashboard`);
    const pic = data.profilePic && (data.profilePic.url || data.profilePic);
    setProfile({
      name: data.username || data.name || '',
      email: data.email || '',
      bio: data.bio || '',
      password: '',
      image: pic || DEFAULT_IMAGE,
    });
    setImagePreview(pic || DEFAULT_IMAGE);

    setSuccess('Profile saved!');
  } catch (err) {
    setError('Failed to update profile');
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>Loading profile...</div>;
  }
  if (error) {
    return <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>Error: {error}</div>;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="flex items-center justify-center min-h-screen pt-16">
        <form onSubmit={handleSubmit} className={`w-full max-w-lg p-8 rounded-2xl shadow-xl transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}> 
          <h2 className="text-2xl font-bold mb-8 text-center">Edit Profile</h2>
          {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
          <div className="flex flex-col items-center mb-6">
            <img
              src={imagePreview}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
            />
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Save Profile
          </button>
        </form>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default EditProfile; 