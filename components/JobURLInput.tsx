"use client";

import { Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { useJobScraper } from "@/hooks/useJobScraper";
import { useLoadingProgress } from "@/hooks/useLoadingProgress";
import LoadingScreen from "./joburl/LoadingScreen";
import ClarityScoreModal from "./ClarityScoreModal";
import { useState } from "react";

interface JobURLInputProps {
  onDataExtracted: (data: any) => void;
}

export default function JobURLInput({ onDataExtracted }: JobURLInputProps) {
  const {
    url,
    setUrl,
    isLoading,
    error,
    success,
    clarityData,
    scrapeJob,
  } = useJobScraper(onDataExtracted);

  const { messageIndex, progress } = useLoadingProgress(isLoading);
  const [showClarityModal, setShowClarityModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await scrapeJob(url);
    
    // Show clarity modal if we have clarity data
    if (result?.success && result?.clarity) {
      setShowClarityModal(true);
    }
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen progress={progress} messageIndex={messageIndex} />}

      {/* Clarity Score Modal */}
      {showClarityModal && clarityData && (
        <ClarityScoreModal
          isOpen={showClarityModal}
          onClose={() => setShowClarityModal(false)}
          clarityScore={clarityData.score}
          issues={clarityData.issues || []}
          strengths={clarityData.strengths || []}
          suggestions={clarityData.suggestions || []}
        />
      )}

      {/* Input Form */}
      <div className="mb-2">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste job URL here to auto-fill details"
                disabled={isLoading || success}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed h-12"
              />
            </div>
            <button
              type="submit"
              disabled={!url.trim() || isLoading || success}
              className="btn-primary w-12 h-12 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 rounded-full"
              title={isLoading ? "Analyzing..." : success ? "Done!" : "Analyze URL"}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-800">
                  Successfully analyzed job details!
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
