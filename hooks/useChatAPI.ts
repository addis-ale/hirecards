import { useCallback } from "react";
import { Message, ExtractedData } from "@/types/chat";

interface UseChatAPIProps {
  conversationMessages: React.MutableRefObject<Array<{ role: string; content: string }>>;
  extractedData: ExtractedData;
  setExtractedData: (data: ExtractedData | ((prev: ExtractedData) => ExtractedData)) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAssistantMessage: (content: string, suggestions?: string[]) => void;
}

export function useChatAPI({
  conversationMessages,
  extractedData,
  setExtractedData,
  setIsLoading,
  setError,
  addAssistantMessage,
}: UseChatAPIProps) {
  
  const sendChatMessage = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Intelligent extraction from user message
      const extractionResponse = await fetch("/api/intelligent-extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          currentData: extractedData,
        }),
      });

      const extractionResult = await extractionResponse.json();
      
      console.log("🔍 Intelligent extraction result:", extractionResult);
      
      let updatedExtractedData = { ...extractedData };
      
      if (extractionResult.success && extractionResult.hasNewData) {
        console.log("✅ New data extracted:", extractionResult.extracted);
        
        Object.keys(extractionResult.extracted).forEach((key) => {
          if (extractionResult.extracted[key]) {
            if (key === "criticalSkills" && Array.isArray(extractionResult.extracted[key])) {
              const existingSkills = updatedExtractedData.criticalSkills || [];
              const newSkills = extractionResult.extracted[key];
              updatedExtractedData.criticalSkills = [...new Set([...existingSkills, ...newSkills])];
            } else {
              (updatedExtractedData as any)[key] = extractionResult.extracted[key];
            }
          }
        });

        console.log("📦 Updated extracted data after merge:", updatedExtractedData);
        setExtractedData(updatedExtractedData);
      } else {
        console.log("⚠️ No new data extracted from message");
      }

      // Step 2: Get AI response with the latest extracted data
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages.current,
          extractedData: updatedExtractedData,
        }),
      });

      const chatResult = await chatResponse.json();
      
      if (chatResult.success) {
        addAssistantMessage(chatResult.message);
        
        // Save to sessionStorage
        const formData = {
          roleTitle: updatedExtractedData.roleTitle || "",
          department: updatedExtractedData.department || "",
          experienceLevel: updatedExtractedData.experienceLevel || "",
          location: updatedExtractedData.location || "",
          workModel: updatedExtractedData.workModel || "",
          criticalSkills: updatedExtractedData.criticalSkills || [],
          minSalary: updatedExtractedData.minSalary || "",
          maxSalary: updatedExtractedData.maxSalary || "",
          nonNegotiables: updatedExtractedData.nonNegotiables || "",
          flexible: updatedExtractedData.flexible || "",
          timeline: updatedExtractedData.timeline || "",
        };
        sessionStorage.setItem("formData", JSON.stringify(formData));
        
        // Save to sessionStorage after each update
        sessionStorage.setItem("formData", JSON.stringify(updatedExtractedData));
        
        return { success: true, message: chatResult.message, updatedData: updatedExtractedData };
      } else {
        setError(chatResult.error || "Failed to get response");
        return { success: false };
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError("Something went wrong. Please try again.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [extractedData, conversationMessages, setExtractedData, setIsLoading, setError, addAssistantMessage]);

  const scrapeJobURL = useCallback(async (url: string) => {
    try {
      const response = await fetch("/api/scrape-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      return result;
    } catch (err) {
      console.error("URL scraping error:", err);
      return { success: false, error: "Failed to process URL" };
    }
  }, []);

  return {
    sendChatMessage,
    scrapeJobURL,
  };
}
