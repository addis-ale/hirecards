"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HireCardTabs } from "@/components/HireCardTabs";
import { ArrowLeft, Loader2, CheckCircle, LayoutDashboard, Lock } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSubscription = () => {
      // Prefer real subscription if present
      const plan = sessionStorage.getItem("selectedPlan");
      const quickAnalysis = sessionStorage.getItem("incompleteData");

      if (plan) {
        setSelectedPlan(plan);
        setIsSubscribed(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else if (quickAnalysis) {
        // If user came from Hero quick analysis, show only overview (not subscribed)
        setIsSubscribed(false);
      } else {
        setIsSubscribed(false);
      }

      // Auto-save to dashboard
      saveToLibrary();

      setLoading(false);
    };

    checkSubscription();
  }, [router]);


  const saveToLibrary = () => {
    try {
      // Get current form data and cards
      // Try heroAnalysisData first (from Hero section), then formData (from chatbot/form)
      const formData = sessionStorage.getItem("formData") || sessionStorage.getItem("heroAnalysisData");
      const battleCards = sessionStorage.getItem("battleCards");

      if (!formData) return;

      const parsed = JSON.parse(formData);
      const cards = battleCards ? JSON.parse(battleCards) : null;

      // Create save object
      const savedCard = {
        id: Date.now().toString(),
        roleTitle: parsed.roleTitle || "Untitled Role",
        experienceLevel: parsed.experienceLevel || "N/A",
        location: parsed.location || "N/A",
        workModel: parsed.workModel || "N/A",
        salaryRange: parsed.salaryRange || parsed.minSalary && parsed.maxSalary 
          ? `${parsed.minSalary} - ${parsed.maxSalary}`
          : "N/A",
        createdAt: new Date().toISOString(),
        cards: cards,
        formData: parsed,
      };

      // Load existing saved cards
      const existing = localStorage.getItem("savedHireCards");
      let savedCards = [];

      if (existing) {
        try {
          savedCards = JSON.parse(existing);
        } catch (err) {
          savedCards = [];
        }
      }

      // Check if this card already exists (avoid duplicates)
      const isDuplicate = savedCards.some((card: any) => 
        card.roleTitle === savedCard.roleTitle &&
        card.location === savedCard.location &&
        new Date(card.createdAt).toDateString() === new Date(savedCard.createdAt).toDateString()
      );

      if (!isDuplicate) {
        // Add new card at the beginning
        savedCards.unshift(savedCard);

        // Keep only last 50 cards
        if (savedCards.length > 50) {
          savedCards = savedCards.slice(0, 50);
        }

        // Save back to localStorage
        localStorage.setItem("savedHireCards", JSON.stringify(savedCards));
      }
    } catch (err) {
      console.error("Failed to save to library:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="w-12 h-12 animate-spin mx-auto mb-4"
            style={{ color: "#278f8c" }}
          />
          <p className="text-gray-600">Loading your battle cards...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-32 md:pt-36 pb-16">
        <div className="section-container">
          {/* Success Message */}
          {showSuccess && selectedPlan && (
            <div className="max-w-6xl mx-auto mb-8">
              <div
                className="flex items-center space-x-3 p-4 rounded-lg shadow-lg animate-fade-in"
                style={{ backgroundColor: "#d7f4f2", border: "2px solid #278f8c" }}
              >
                <CheckCircle
                  className="w-6 h-6 flex-shrink-0"
                  style={{ color: "#278f8c" }}
                />
                <div>
                  <p className="font-bold" style={{ color: "#102a63" }}>
                    Payment Successful! 🎉
                  </p>
                  <p className="text-sm" style={{ color: "#102a63", opacity: 0.8 }}>
                    You&apos;ve unlocked the {selectedPlan} plan. Your complete hiring battle cards are ready below!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="max-w-6xl mx-auto mb-8">
       <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 mb-6 transition-colors hover:opacity-80"
        style={{ color: "#102a63" }}
      >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">Back</span>
    </button>


            <div className="text-center">
              <h1
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: "#102a63" }}
              >
                Your{" "}
                <span
                  className="px-3 py-1 rounded-lg"
                  style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
                >
                  Hiring Strategy
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                {isSubscribed 
                  ? "Not bad. Here's your complete breakdown."
                  : "Not bad. Let's break down what you're dealing with."
                }
              </p>
              <p className="text-base text-gray-500 max-w-2xl mx-auto">
                13 cards. Zero fluff. Just market data, sourcing tactics, interview frameworks, and a plan to fill this role.
              </p>
            </div>
          </div>

          {/* Card Info Boxes - Highlights */}
          <div className="max-w-6xl mx-auto mb-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Market Analysis */}
              <div 
                className="p-5 rounded-lg border-2 hover:shadow-lg transition-all hover:border-teal-300"
                style={{ 
                  backgroundColor: "#ffffff",
                  borderColor: "#e0e0e0"
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: "#d7f4f2" }}
                >
                  <svg className="w-6 h-6" style={{ color: "#278f8c" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2 text-lg" style={{ color: "#102a63" }}>Market Intelligence</h4>
                <p className="text-sm text-gray-600">Demand, supply, competition analysis & salary benchmarks</p>
              </div>

              {/* Talent Sourcing */}
              <div 
                className="p-5 rounded-lg border-2 hover:shadow-lg transition-all hover:border-teal-300"
                style={{ 
                  backgroundColor: "#ffffff",
                  borderColor: "#e0e0e0"
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: "#d7f4f2" }}
                >
                  <svg className="w-6 h-6" style={{ color: "#278f8c" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2 text-lg" style={{ color: "#102a63" }}>Talent Sourcing</h4>
                <p className="text-sm text-gray-600">Where to find candidates, outreach strategies & funnel building</p>
              </div>

              {/* Interview System */}
              <div 
                className="p-5 rounded-lg border-2 hover:shadow-lg transition-all hover:border-teal-300"
                style={{ 
                  backgroundColor: "#ffffff",
                  borderColor: "#e0e0e0"
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: "#d7f4f2" }}
                >
                  <svg className="w-6 h-6" style={{ color: "#278f8c" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2 text-lg" style={{ color: "#102a63" }}>Interview System</h4>
                <p className="text-sm text-gray-600">Structured questions, scorecards & evaluation frameworks</p>
              </div>

              {/* Action Plan */}
              <div 
                className="p-5 rounded-lg border-2 hover:shadow-lg transition-all hover:border-teal-300"
                style={{ 
                  backgroundColor: "#ffffff",
                  borderColor: "#e0e0e0"
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: "#d7f4f2" }}
                >
                  <svg className="w-6 h-6" style={{ color: "#278f8c" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2 text-lg" style={{ color: "#102a63" }}>Action Plans</h4>
                <p className="text-sm text-gray-600">Week-by-week roadmap & execution templates</p>
              </div>
            </div>
          </div>

          {/* HireCard Tabs */}
          <div className="max-w-6xl mx-auto">
            <HireCardTabs isSubscribed={isSubscribed} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
