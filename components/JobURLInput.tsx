'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface JobURLInputProps {
  onDataExtracted: (data: any) => void;
}

export default function JobURLInput({ onDataExtracted }: JobURLInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a job URL');
      return;
    }

    // Basic URL validation
    if (!url.includes('http') && !url.includes('www.')) {
      setError('Please enter a valid URL (e.g., https://...)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/scrape-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        // Check if this is an irrelevant URL (confidence 0 or no data extracted)
        const hasData = result.data && (
          result.data.roleTitle || 
          result.data.department || 
          result.data.criticalSkills?.length > 0 ||
          result.data.location ||
          result.data.workModel
        );
        
        if (!hasData || result.data.confidence === 0) {
          // Irrelevant URL detected
          setError('⚠️ That URL doesn\'t look like a job posting. Try a different link or just type the role details.');
          onDataExtracted(result.data); // Still pass data (will be empty) to trigger chat response
        } else {
          setSuccess(true);
          onDataExtracted(result.data);
          
          // Reset after a delay
          setTimeout(() => {
            setUrl('');
            setSuccess(false);
          }, 2000);
        }
      } else {
        setError(result.error || 'Failed to scrape job URL');
      }
    } catch (err) {
      console.error('Scraping error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleScrape}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Just drop your job description here"
              disabled={isLoading || success}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={!url.trim() || isLoading || success}
            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Extracting...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Done!
              </>
            ) : (
              'Extract'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-800">
                Successfully extracted job details!
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
