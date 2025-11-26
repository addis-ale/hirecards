"use client";

import { useState } from "react";

export default function DebugScraperPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [testingPuppeteer, setTestingPuppeteer] = useState(false);
  const [puppeteerTest, setPuppeteerTest] = useState<any>(null);

  const testPuppeteerSetup = async () => {
    setTestingPuppeteer(true);
    setPuppeteerTest(null);

    try {
      const response = await fetch("/api/test-puppeteer");
      const data = await response.json();
      setPuppeteerTest(data);
    } catch (err: any) {
      setPuppeteerTest({
        error: "Failed to test Puppeteer setup",
        message: err.message,
      });
    } finally {
      setTestingPuppeteer(false);
    }
  };

  const testScraper = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/scrape-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError({
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Job Scraper Debug Tool</h1>
        <p className="text-gray-600 mb-8">
          Test the job scraper and see detailed error information
        </p>

        {/* Quick Test */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">
            🧪 Quick Puppeteer Test
          </h2>
          <p className="text-purple-800 mb-4">
            Test if Puppeteer/Chromium is working correctly on this server
          </p>
          <button
            onClick={testPuppeteerSetup}
            disabled={testingPuppeteer}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {testingPuppeteer ? "Testing..." : "Run Puppeteer Test"}
          </button>
        </div>

        {/* Puppeteer Test Results */}
        {puppeteerTest && (
          <div className={`border rounded-lg p-6 mb-6 ${
            puppeteerTest.error 
              ? "bg-red-50 border-red-200" 
              : puppeteerTest.summary?.status?.includes("✅")
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}>
            <h2 className="text-xl font-semibold mb-4">
              Puppeteer Test Results
            </h2>
            <pre className="bg-white p-4 rounded border overflow-x-auto text-sm">
              {JSON.stringify(puppeteerTest, null, 2)}
            </pre>
          </div>
        )}

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex">
              <span className="font-semibold w-48">User Agent:</span>
              <span className="text-gray-600 flex-1 break-all">
                {typeof window !== "undefined" ? navigator.userAgent : "N/A"}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-48">Window Location:</span>
              <span className="text-gray-600 flex-1 break-all">
                {typeof window !== "undefined" ? window.location.href : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Job URL</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={testScraper}
              disabled={!url || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Testing..." : "Test Scraper"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Try: https://www.linkedin.com/jobs/view/3989856448 or any job URL
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-900 font-medium">
                Scraping job posting... This may take 10-30 seconds
              </span>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              ✅ Success!
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Extracted Data:
                </h3>
                <pre className="bg-white p-4 rounded border border-green-200 overflow-x-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Error Result */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-4">
              ❌ Error Occurred
            </h2>
            <div className="space-y-4">
              {error.status && (
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    HTTP Status:
                  </h3>
                  <p className="bg-white p-3 rounded border border-red-200">
                    {error.status} - {error.statusText}
                  </p>
                </div>
              )}

              {error.data && (
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    Error Response:
                  </h3>
                  <pre className="bg-white p-4 rounded border border-red-200 overflow-x-auto text-sm">
                    {JSON.stringify(error.data, null, 2)}
                  </pre>
                </div>
              )}

              {error.message && (
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    Error Message:
                  </h3>
                  <p className="bg-white p-3 rounded border border-red-200 font-mono text-sm">
                    {error.message}
                  </p>
                </div>
              )}

              {error.stack && (
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    Stack Trace:
                  </h3>
                  <pre className="bg-white p-4 rounded border border-red-200 overflow-x-auto text-xs">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!loading && !result && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              💡 How to Use
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-900">
              <li>Paste a job URL from LinkedIn, Indeed, or other job boards</li>
              <li>Click &quot;Test Scraper&quot; to start the scraping process</li>
              <li>Wait for the result (may take 10-30 seconds)</li>
              <li>
                If there&apos;s an error, you&apos;ll see detailed information about what
                went wrong
              </li>
              <li>
                Copy the error details and share them for debugging
              </li>
            </ol>
          </div>
        )}

        {/* Additional Debug Info */}
        <div className="bg-gray-100 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Purpose:</strong> This page helps diagnose issues with the
              job scraper in production
            </p>
            <p>
              <strong>What to check:</strong> Error messages, HTTP status codes,
              timeout issues
            </p>
            <p>
              <strong>Common issues:</strong> Puppeteer not found, timeout
              errors, memory issues, blocked requests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
