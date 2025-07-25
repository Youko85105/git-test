import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';

const creators = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: '/images/creator.jpg',
    description: 'Tech & Programming | Weekly coding tutorials and project breakdowns.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    image: '/images/creator.jpg',
    description: 'Digital Marketing | Advanced SEO strategies and case studies.'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    image: '/images/creator.jpg',
    description: 'Fitness & Wellness | Personalized workout plans and nutrition guides.'
  }
];

const Homepage = ({ isDarkMode, toggleTheme, isLoggedIn, logout }) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} logout={logout} />

      {/* Hero Section */}
      <div className="flex items-center justify-between max-w-6xl mx-auto px-8 py-16 mt-16 min-h-[80vh]">
        <div className="flex-1">
          <h1 className={`text-5xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Unlock Premium</h1>
          <h2 className={`text-4xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Content Today</h2>
          <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Join thousands of creators and subscribers on the ultimate content platform</p>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="/images/contentcreator.jpg" alt="Content Creators" className="max-w-md h-auto" />
        </div>
      </div>

      {/* Services Section */}
      <div className={`py-16 px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Platform Features
          </h2>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className={`p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
            <img src="/images/become.jpg" alt="Creator" className="w-20 h-20 mx-auto mb-4 rounded-xl" />
            <h3 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Become a Creator
            </h3>
            <p className={`text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Start monetizing your content and build a loyal subscriber base with our creator tools.
            </p>
          </div>
          
          <div className={`p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
            <img src="/images/premium.png" alt="Subscription" className="w-20 h-20 mx-auto mb-4 rounded-xl" />
            <h3 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Premium Subscriptions
            </h3>
            <p className={`text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Access exclusive content from your favorite creators with flexible subscription plans.
            </p>
          </div>
          
          <div className={`p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
            <img src="/images/join.png" alt="Co
            mmunity" className="w-20 h-20 mx-auto mb-4 rounded-xl" />
            <h3 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Join Communities
            </h3>
            <p className={`text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Connect with like-minded people in exclusive creator communities and discussions.
            </p>
          </div>
          
          <div className={`p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
            <img src="/images/analytics.png" alt="Analytics" className="w-20 h-20 mx-auto mb-4 rounded-xl" />
            <h3 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Creator Analytics
            </h3>
            <p className={`text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Track your growth and earnings with detailed analytics and insights dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Some Creators Section */}
      <div className={`py-16 px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}> 
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-4xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Some Creators</h2>
            <Link 
              to="/facts" 
              className={`font-semibold transition-colors duration-300 hover:opacity-80 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              See All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map((creator) => (
              <div 
                key={creator.id} 
                className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}
              >
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-article.jpg';
                  }}
                />
                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{creator.name}</h3>
                  <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{creator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={`py-16 px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-4xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
            <Link 
              to="/faq" 
              className={`font-semibold transition-colors duration-300 hover:opacity-80 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              See All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="text-center">
              <img src="/images/faq.png" alt="FAQ Icon" className="max-w-xs mx-auto h-auto" />
            </div>

            <div className="lg:col-span-2 space-y-4">
              {[
                { question: "How do I become a creator on SubHub?", answer: "Sign up for a creator account, set up your profile, and start creating content. You can monetize through subscriptions, tips, and exclusive content." },
                { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and digital wallets. Payments are processed securely and you can cancel anytime." },
                { question: "Can I cancel my subscription anytime?", answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period." },
                { question: "How much can creators earn?", answer: "Creator earnings depend on subscriber count and subscription price. Top creators can earn $5,000+ monthly with our platform." },
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl overflow-hidden border transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                >
                  <div className={`p-6 font-semibold cursor-pointer transition-colors duration-300 flex justify-between items-center ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                    {faq.question}
                    <span className="text-xl font-bold">+</span>
                  </div>
                  <div className={`p-6 leading-relaxed hidden ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Homepage; 