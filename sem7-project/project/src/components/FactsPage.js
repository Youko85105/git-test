import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const FactsPage = ({ isDarkMode, toggleTheme }) => {
  const [subscribedCreators, setSubscribedCreators] = useState([]);

  const creators = [
    {
      id: 1,
      name: "Sarah Johnson",
      photo: "/images/creator.jpg",
      specialty: "Tech & Programming",
      facts: [
        "Weekly coding tutorials and project breakdowns",
        "Exclusive access to source code and resources",
        "Live Q&A sessions every Friday"
      ],
      subscribers: 15420,
      monthlyPrice: 9.99
    },
    {
      id: 2,
      name: "Michael Chen",
      photo: "/images/creator.jpg",
      specialty: "Digital Marketing",
      facts: [
        "Advanced SEO strategies and case studies",
        "Social media growth techniques",
        "Monthly strategy workshops"
      ],
      subscribers: 12850,
      monthlyPrice: 12.99
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      photo: "/images/creator.jpg",
      specialty: "Fitness & Wellness",
      facts: [
        "Personalized workout plans and nutrition guides",
        "Live fitness classes and challenges",
        "Exclusive meal prep recipes"
      ],
      subscribers: 9870,
      monthlyPrice: 7.99
    },
    {
      id: 4,
      name: "James Wilson",
      photo: "/images/creator.jpg",
      specialty: "Photography & Design",
      facts: [
        "Advanced editing tutorials and presets",
        "Equipment reviews and recommendations",
        "Monthly photo challenges and critiques"
      ],
      subscribers: 11230,
      monthlyPrice: 14.99
    },
    {
      id: 5,
      name: "Lisa Thompson",
      photo: "/images/creator.jpg",
      specialty: "Business & Entrepreneurship",
      facts: [
        "Startup strategies and funding insights",
        "Business model analysis and case studies",
        "Networking events and mentorship"
      ],
      subscribers: 14560,
      monthlyPrice: 19.99
    },
    {
      id: 6,
      name: "Robert Kim",
      photo: "/images/creator.jpg",
      specialty: "Gaming & Entertainment",
      facts: [
        "Exclusive gaming content and strategies",
        "Behind-the-scenes streaming insights",
        "Community events and tournaments"
      ],
      subscribers: 8760,
      monthlyPrice: 5.99
    }
  ];

  const handleSubscribe = (creatorId) => {
    if (subscribedCreators.includes(creatorId)) {
      setSubscribedCreators(subscribedCreators.filter(id => id !== creatorId));
    } else {
      setSubscribedCreators([...subscribedCreators, creatorId]);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <div className="pt-16">
        {/* Header Section */}
        <div className="text-center py-16 px-8">
          <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Premium Content Creators
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover amazing creators and unlock exclusive content with monthly subscriptions
          </p>
        </div>

        {/* Creators Section */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Featured Creators
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map((creator) => (
              <div 
                key={creator.id} 
                className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
              >
                <div className="relative">
                  <img 
                    src={creator.photo} 
                    alt={creator.name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face";
                      console.warn(`Failed to load image for ${creator.name}, using fallback`);
                    }}
                  />
                </div>
                
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {creator.name}
                  </h3>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {creator.specialty}
                  </p>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {creator.subscribers.toLocaleString()} subscribers
                  </p>
                  <p className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    ${creator.monthlyPrice}/month
                  </p>
                  
                  <div className="mb-6">
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      What you'll get:
                    </h4>
                    <ul className="space-y-2">
                      {creator.facts.map((fact, index) => (
                        <li key={index} className={`text-sm flex items-start ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="text-green-500 mr-2">✓</span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                      subscribedCreators.includes(creator.id) 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={() => handleSubscribe(creator.id)}
                  >
                    {subscribedCreators.includes(creator.id) ? 'Subscribed ✓' : `Subscribe $${creator.monthlyPrice}/mo`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className={`py-16 px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Choose SubHub?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <h3 className={`text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  🎯 Premium Content
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Access exclusive content that's not available anywhere else
                </p>
              </div>
              
              <div className="text-center">
                <h3 className={`text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  👥 Community Access
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Join exclusive communities and connect with like-minded people
                </p>
              </div>
              
              <div className="text-center">
                <h3 className={`text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  📱 Mobile Friendly
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Access your subscriptions on any device, anywhere
                </p>
              </div>
              
              <div className="text-center">
                <h3 className={`text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  💳 Secure Payments
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Safe and secure payment processing with instant access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default FactsPage; 