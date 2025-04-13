import { useState, useEffect } from 'react';
import { dataProviders } from '@/lib/api-integrations';

export default function DataSourceManager() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations');
      const data = await response.json();
      setIntegrations(data);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data Sources</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Add New Source
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(dataProviders).map(([key, provider]) => (
          <div key={key} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">{provider.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {Object.keys(provider.endpoints).length} endpoints available
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Endpoints</h4>
                <ul className="mt-2 space-y-2">
                  {Object.entries(provider.endpoints).map(([name, path]) => (
                    <li key={name} className="text-sm">
                      {name}: <code className="text-xs">{path}</code>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Webhooks</h4>
                <ul className="mt-2 space-y-2">
                  {Object.entries(provider.webhooks).map(([name, path]) => (
                    <li key={name} className="text-sm">
                      {name}: <code className="text-xs">{path}</code>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex gap-2">
                <button className="text-sm text-primary hover:text-blue-700 transition">
                  Configure
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700 transition">
                  View Docs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
