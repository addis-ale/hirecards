"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ChatbotModal from "./ChatbotModal";

interface ChatbotContextType {
  openChatbot: (clearData?: boolean) => void;
  closeChatbot: () => void;
  isOpen: boolean;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldClearData, setShouldClearData] = useState(false);

  const openChatbot = (clearData: boolean = true) => {
    // Clear sessionStorage if starting fresh (not from "Complete Missing Fields")
    if (clearData) {
      sessionStorage.removeItem("formData");
      console.log("🗑️ Cleared sessionStorage for fresh start");
    }
    setShouldClearData(clearData);
    setIsOpen(true);
  };
  
  const closeChatbot = () => {
    setIsOpen(false);
    setShouldClearData(false);
  };

  return (
    <ChatbotContext.Provider value={{ openChatbot, closeChatbot, isOpen }}>
      {children}
      <ChatbotModal isOpen={isOpen} onClose={closeChatbot} shouldClearData={shouldClearData} />
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within ChatbotProvider");
  }
  return context;
}
