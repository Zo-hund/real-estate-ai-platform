import { useState, useEffect } from 'react';
import { LineChart } from '@/components/charts';

export default function SocialMediaMonitor() {
  const [metrics, setMetrics] = useState({
    posts: [],
    engagement: {},
    trends: [],
  });

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/dashboard/social-metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching social media metrics:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Posts"
          value={metrics.posts.length}
          change="+24"
          platform="all"
        />
        <MetricCard
          title="Engagement Rate"
          value={`${(metrics.engagement.rate * 100).toFixed(1)}%`}
          change="+2.3%"
          platform="all"
        />
        <MetricCard
          title="Trending Topics"
          value={metrics.trends.length}
          change="+5"
          platform="all"
        />
        <MetricCard
          title="Active Listings"
          value={metrics.posts.filter(p => p.type === 'listing').length}
          change="+12"
          platform="all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Post Activity</h3>
          <LineChart
            data={metrics.posts.map(post => ({
              date: post.date,
              count: post.count,
            }))}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Platform Distribution</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(metrics.engagement.byPlatform || {}).map(([platform, data]) => (
              <div key={platform} className="p-4 rounded-lg bg-gray-50">
                <h4 className="text-sm font-medium text-gray-500">{platform}</h4>
                <p className="mt-2 text-2xl font-semibold">{data.posts}</p>
                <p className="text-sm text-gray-500">{data.engagement} engagement</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Trending Topics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {metrics.trends.map((trend, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900">#{trend.topic}</h4>
              <p className="text-sm text-gray-500 mt-1">{trend.mentions} mentions</p>
              <div className="mt-2">
                <div
                  className="h-1 bg-blue-500 rounded"
                  style={{ width: `${trend.sentiment * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, platform }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="text-xs font-medium text-gray-500">{platform}</span>
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        <p className={`ml-2 text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      </div>
    </div>
  );
}
