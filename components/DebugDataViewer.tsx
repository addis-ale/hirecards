'use client';

import { useState, useEffect } from 'react';
import { Code, X, RefreshCw } from 'lucide-react';

interface DebugDataViewerProps {
  storageKey?: string;
  title?: string;
}

export default function DebugDataViewer({ 
  storageKey = 'formData',
  title = 'Debug: FormData'
}: DebugDataViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        setError(null);
      } else {
        setData(null);
        setError(`No data found in sessionStorage.${storageKey}`);
      }
    } catch (err) {
      setError('Failed to parse data: ' + (err as Error).message);
      setData(null);
    }
  };

  // Auto-refresh when open
  useEffect(() => {
    if (isOpen) {
      loadData();
      
      // Poll for changes every 500ms when open
      const interval = setInterval(() => {
        loadData();
      }, 500);
      
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, storageKey]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all"
        title="Open Debug Viewer"
      >
        <Code className="w-5 h-5" />
        <span className="text-sm font-medium">Debug Data</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border-2 border-purple-600 w-96 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-1 hover:bg-purple-700 rounded transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-purple-700 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        ) : data ? (
          <div className="space-y-3">
            {/* Field Count */}
            <div className="bg-purple-50 border border-purple-200 rounded p-3">
              <div className="text-xs text-purple-600 font-semibold mb-1">FIELD COUNT</div>
              <div className="text-2xl font-bold text-purple-700">
                {Object.entries(data).filter(([key, value]) => {
                  if (Array.isArray(value)) return value.length > 0;
                  return value !== null && value !== '' && value !== undefined;
                }).length} / {Object.keys(data).length}
              </div>
            </div>

            {/* Data Fields */}
            <div className="space-y-2">
              {Object.entries(data).map(([key, value]) => {
                const isEmpty = Array.isArray(value) 
                  ? value.length === 0 
                  : !value || value === '';
                
                return (
                  <div 
                    key={key}
                    className={`border rounded p-2 ${
                      isEmpty 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-semibold text-gray-700 uppercase">
                        {key}
                      </div>
                      {!isEmpty && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-600 text-white rounded">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm">
                      {Array.isArray(value) ? (
                        value.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {value.map((item, idx) => (
                              <span 
                                key={idx}
                                className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs"
                              >
                                {String(item)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Empty array</span>
                        )
                      ) : isEmpty ? (
                        <span className="text-gray-400 italic">Empty</span>
                      ) : (
                        <span className="text-gray-800 break-words">
                          {String(value)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Raw JSON */}
            <div className="mt-4">
              <details className="cursor-pointer">
                <summary className="text-xs font-semibold text-purple-600 hover:text-purple-700 mb-2">
                  Show Raw JSON
                </summary>
                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm text-center py-8">
            No data available
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-500">
          Storage Key: <code className="bg-gray-200 px-1 rounded">{storageKey}</code>
        </div>
      </div>
    </div>
  );
}
