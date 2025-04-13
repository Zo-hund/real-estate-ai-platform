import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function PropertySearch() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Describe your ideal property..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5" />
            Search
          </button>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300">
            Houses
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300">
            Apartments
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300">
            Condos
          </button>
        </div>
      </div>
    </div>
  );
}
