import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CreatorProfile = ({ isDarkMode }) => {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Mock: change to false to see the subscribe prompt
  const isSubscribed = true;
 console.log(isSubscribed);
  useEffect(() => {
    fetch(`http://localhost:3002/api/public/creator/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch creator');
        return res.json();
      })
      .then(data => {
        setCreator(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>Loading creator...</div>;
  }
  if (error || !creator) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Creator not found</h2>
          <Link to="/" className="text-blue-500 underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>  
      <div className="max-w-3xl mx-auto py-16 px-4">
        <Link to="/" className="text-blue-500 underline mb-8 inline-block">← Back to Home</Link>
        <div className="flex flex-col items-center mb-8">
          <img src={creator.profilePic?.url || '/images/creator.jpg'} alt={creator.username || creator.name} className="w-32 h-32 rounded-full mb-4 object-cover" />
          <h1 className="text-4xl font-bold mb-2">{creator.username || creator.name}</h1>
          <p className="text-lg text-center mb-4">{creator.bio || creator.description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Posts</h2>
          {isSubscribed ? (
            <div className="space-y-6">
              {(creator.posts || []).map(post => (
                <div key={post._id || post.id} className={`p-6 rounded-xl shadow border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p>{post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-xl bg-yellow-100 text-yellow-800">
              <p>You must subscribe to view this creator's posts.</p>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Subscribe</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile; 