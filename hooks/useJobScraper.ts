import { useState, useCallback } from "react";

export function useJobScraper(onDataExtracted: (data: any) => void) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clarityData, setClarityData] = useState<any>(null);

  const scrapeJob = useCallback(
    async (jobUrl: string) => {
      if (!jobUrl.trim()) {
        setError("Please enter a job URL");
        return { success: false };
      }

      // Basic URL validation
      if (!jobUrl.includes("http") && !jobUrl.includes("www.")) {
        setError("Please enter a valid URL (e.g., https://...)");
        return { success: false };
      }

      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const response = await fetch("/api/scrape-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: jobUrl.trim() }),
        });

        const result = await response.json();

        if (result.success && result.data) {
          setSuccess(true);
          setClarityData(result.clarity);
          
          // Call the callback with extracted data
          onDataExtracted(result.data);
          
          return { success: true, data: result.data, clarity: result.clarity };
        } else {
          setError(result.error || "Failed to extract job details from URL");
          return { success: false, error: result.error };
        }
      } catch (err) {
        console.error("Scraping error:", err);
        setError("Something went wrong. Please try again.");
        return { success: false, error: "Network error" };
      } finally {
        setIsLoading(false);
      }
    },
    [onDataExtracted]
  );

  const reset = useCallback(() => {
    setUrl("");
    setError(null);
    setSuccess(false);
    setIsLoading(false);
    setClarityData(null);
  }, []);

  return {
    url,
    setUrl,
    isLoading,
    error,
    success,
    clarityData,
    scrapeJob,
    reset,
  };
}
