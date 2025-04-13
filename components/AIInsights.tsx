import { useState } from 'react';
import { ChartBarIcon, TrendingUpIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState('market');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">AI-Powered Market Insights</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex gap-4 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-300 ${
              activeTab === 'market'
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('market')}
          >
            <ChartBarIcon className="h-5 w-5" />
            Market Analysis
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-300 ${
              activeTab === 'trends'
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            <TrendingUpIcon className="h-5 w-5" />
            Price Trends
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-300 ${
              activeTab === 'recommendations'
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('recommendations')}
          >
            <HomeIcon className="h-5 w-5" />
            Recommendations
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'market' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Current Market Analysis</h3>
              <p className="text-gray-600">
                AI-generated insights about the current real estate market conditions,
                including supply and demand analysis, price trends, and market dynamics.
              </p>
            </div>
          )}

          {activeTab === 'trends' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Price Trends</h3>
              <p className="text-gray-600">
                Historical price trends and future predictions based on AI analysis of
                market data, economic indicators, and local factors.
              </p>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Personalized Recommendations</h3>
              <p className="text-gray-600">
                AI-powered property recommendations based on your preferences,
                budget, and investment goals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
