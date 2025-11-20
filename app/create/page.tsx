"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MultiPageForm from "@/components/MultiPageForm";
import ConversationalChatbot from "@/components/ConversationalChatbot";
import { Sparkles, List } from "lucide-react";

export default function CreatePage() {
  const [useChatbot, setUseChatbot] = useState(true);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <div className="pt-32 md:pt-36 pb-16">
        <div className="section-container">
          <div className="text-center mb-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#102a63" }}
            >
              Create Your{" "}
              <span
                className="px-3 py-1 rounded-lg"
                style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
              >
                HireCard Strategy
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-6" style={{ color: "#102a63", opacity: 0.8 }}>
              {useChatbot 
                ? "Chat with our AI assistant to create your strategy"
                : "Fill out the form to create your strategy"
              }
            </p>
            
            {/* Mode Toggle */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setUseChatbot(true)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  useChatbot
                    ? "bg-[#278f8c] text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>AI Chat</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                  ChatGPT
                </span>
              </button>
              <button
                onClick={() => setUseChatbot(false)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  !useChatbot
                    ? "bg-[#278f8c] text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-5 h-5" />
                <span>Form Mode</span>
              </button>
            </div>
          </div>
          
          {useChatbot ? <ConversationalChatbot /> : <MultiPageForm />}
        </div>
      </div>
      <Footer />
    </main>
  );
}
