import { useState, useEffect } from "react";

export function useLoadingProgress(isLoading: boolean) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through messages
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % 10);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setMessageIndex(0);
    }
  }, [isLoading]);

  // Progress animation
  useEffect(() => {
    if (isLoading) {
      setProgress(5);
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        let newProgress;

        if (elapsed < 10000) {
          // First 10s: 5% -> 50%
          newProgress = 5 + (elapsed / 10000) * 45;
        } else if (elapsed < 30000) {
          // 10s-30s: 50% -> 85%
          newProgress = 50 + ((elapsed - 10000) / 20000) * 35;
        } else {
          // After 30s: slowly approach 95%
          newProgress = 85 + Math.min(((elapsed - 30000) / 60000) * 10, 10);
        }

        setProgress(Math.min(newProgress, 95));
      }, 200);

      return () => clearInterval(timer);
    } else {
      setProgress((prev) => {
        if (prev > 0 && prev < 100) {
          return 100;
        }
        return prev;
      });
    }
  }, [isLoading]);

  return { messageIndex, progress };
}
