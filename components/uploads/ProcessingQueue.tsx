import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export interface ProcessingItem {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
}

interface ProcessingQueueProps {
  items: ProcessingItem[];
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

export default function ProcessingQueue({
  items,
  onRemove,
  onRetry,
}: ProcessingQueueProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Processing Queue</h3>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  item.status === 'completed'
                    ? 'bg-green-100'
                    : item.status === 'failed'
                    ? 'bg-red-100'
                    : 'bg-blue-100'
                }`}
              >
                {item.status === 'completed' ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : item.status === 'failed' ? (
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                )}
              </div>

              <div>
                <p className="font-medium">{item.filename}</p>
                <p className="text-sm text-gray-500">
                  {item.status === 'pending'
                    ? 'Waiting to process...'
                    : item.status === 'processing'
                    ? `Processing (${item.progress}%)`
                    : item.status === 'completed'
                    ? 'Processing complete'
                    : 'Processing failed'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {item.status === 'failed' && (
                <button
                  onClick={() => onRetry(item.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Retry
                </button>
              )}
              <button
                onClick={() => onRemove(item.id)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
