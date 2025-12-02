import { useState, useCallback } from "react";
import { Message, ExtractedData } from "@/types/chat";

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    roleTitle: "",
    department: "",
    experienceLevel: "",
    location: "",
    workModel: "",
    criticalSkills: [],
    minSalary: "",
    maxSalary: "",
    nonNegotiables: "",
    flexible: "",
    timeline: "",
    company: "",
  });

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateExtractedData = useCallback((newData: Partial<ExtractedData>) => {
    setExtractedData((prev) => ({ ...prev, ...newData }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    setMessages,
    currentInput,
    setCurrentInput,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError,
    extractedData,
    setExtractedData,
    updateExtractedData,
    addMessage,
  };
}
