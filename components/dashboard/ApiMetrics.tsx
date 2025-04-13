import { useEffect, useState } from 'react';
import { LineChart, BarChart } from '@/components/charts';

export default function ApiMetrics() {
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    averageLatency: 0,
    errorRate: 0,
    activeIntegrations: 0,
  });

  useEffect(() => {
    // Fetch real-time metrics
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/dashboard/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Requests"
          value={metrics.totalRequests}
          change="+12.3%"
        />
        <MetricCard
          title="Average Latency"
          value={`${metrics.averageLatency}ms`}
          change="-5.2%"
        />
        <MetricCard
          title="Error Rate"
          value={`${metrics.errorRate}%`}
          change="-2.1%"
        />
        <MetricCard
          title="Active Integrations"
          value={metrics.activeIntegrations}
          change="+3"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Request Volume</h3>
          <LineChart
            data={[/* Your chart data */]}
            xAxis="time"
            yAxis="requests"
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Response Times</h3>
          <BarChart
            data={[/* Your chart data */]}
            xAxis="endpoint"
            yAxis="latency"
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        <p className={`ml-2 text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      </div>
    </div>
  );
}
