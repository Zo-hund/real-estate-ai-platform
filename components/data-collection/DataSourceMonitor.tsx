import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function DataSourceMonitor() {
  const [sources, setSources] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchDataSources();
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchDataSources = async () => {
    try {
      const response = await fetch('/api/data-sources');
      const data = await response.json();
      setSources(data);
    } catch (error) {
      console.error('Error fetching data sources:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/data-sources/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          change={stats.propertyChange}
        />
        <StatCard
          title="Active Sources"
          value={stats.activeSources}
          change={stats.sourceChange}
        />
        <StatCard
          title="Daily Updates"
          value={stats.dailyUpdates}
          change={stats.updateChange}
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          change={stats.successChange}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Data Source Status</h3>
        </div>

        <div className="divide-y">
          {sources.map((source) => (
            <div
              key={source.id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium">{source.name}</h4>
                <p className="text-sm text-gray-500">
                  Last update: {new Date(source.lastUpdate).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {source.status === 'active' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      source.status === 'active'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {source.status}
                  </span>
                </div>

                <button className="text-primary hover:text-blue-700 transition text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change }: any) {
  const isPositive = change?.startsWith('+');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        {change && (
          <p
            className={`ml-2 text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
