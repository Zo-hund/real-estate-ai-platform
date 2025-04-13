import { useState } from 'react';
import ApiMetrics from './ApiMetrics';
import ApiKeyManager from './ApiKeyManager';
import DataSourceManager from './DataSourceManager';
import WebhookManager from './WebhookManager';

export default function ApiDashboard() {
  const [activeTab, setActiveTab] = useState('metrics');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Dashboard</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Add New Integration
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'metrics', name: 'API Metrics' },
              { id: 'keys', name: 'API Keys' },
              { id: 'sources', name: 'Data Sources' },
              { id: 'webhooks', name: 'Webhooks' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    : ''}
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'metrics' && <ApiMetrics />}
          {activeTab === 'keys' && <ApiKeyManager />}
          {activeTab === 'sources' && <DataSourceManager />}
          {activeTab === 'webhooks' && <WebhookManager />}
        </div>
      </div>
    </div>
  );
}
