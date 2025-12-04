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
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);

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

  const handleDebugClick = () => {
    // Load RAW Apify scraped data from sessionStorage
    const rawJobsPayCard = sessionStorage.getItem("apifyRawJobsData_PayCard");
    const rawJobsMarketCard = sessionStorage.getItem("apifyRawJobsData_MarketCard");
    const rawProfiles = sessionStorage.getItem("apifyRawProfilesData");

    const debugData: any = {
      note: "RAW SCRAPED DATA FROM APIFY (NOT ANALYZED)",
      description: "This shows the actual job postings and profiles scraped by Apify actors - unprocessed and unanalyzed",
      timestamp: new Date().toISOString(),
    };

    let hasAnyData = false;

    // Add RAW jobs from PayCard scraping
    if (rawJobsPayCard) {
      try {
        const jobs = JSON.parse(rawJobsPayCard);
        debugData.payCardJobs = {
          count: jobs.length,
          note: "50 LinkedIn job postings scraped for PayCard (salary analysis)",
          source: "Apify LinkedIn Jobs Scraper",
          jobs: jobs, // Full raw array
        };
        hasAnyData = true;
      } catch (e) {
        debugData.payCardJobs = { error: "Failed to parse" };
      }
    } else {
      debugData.payCardJobs = { message: "No raw jobs data found for PayCard" };
    }

    // Add RAW jobs from MarketCard scraping
    if (rawJobsMarketCard) {
      try {
        const jobs = JSON.parse(rawJobsMarketCard);
        debugData.marketCardJobs = {
          count: jobs.length,
          note: "50 LinkedIn job postings scraped for MarketCard (market analysis)",
          source: "Apify LinkedIn Jobs Scraper",
          jobs: jobs, // Full raw array
        };
        hasAnyData = true;
      } catch (e) {
        debugData.marketCardJobs = { error: "Failed to parse" };
      }
    } else {
      debugData.marketCardJobs = { message: "No raw jobs data found for MarketCard" };
    }

    // Add RAW profiles from MarketCard scraping
    if (rawProfiles) {
      try {
        const profiles = JSON.parse(rawProfiles);
        debugData.profiles = {
          count: profiles.length,
          note: "LinkedIn candidate profiles scraped for MarketCard (supply analysis)",
          source: "Apify LinkedIn Profile Scraper",
          profiles: profiles, // Full raw array
        };
        hasAnyData = true;
      } catch (e) {
        debugData.profiles = { error: "Failed to parse" };
      }
    } else {
      debugData.profiles = { 
        message: "No raw profiles data found",
        reason: "Profile scraper currently disabled (requires profile URLs as input)"
      };
    }

    // Add warning if no data
    if (!hasAnyData) {
      debugData.warning = "No raw Apify data found in sessionStorage";
      debugData.possibleReasons = [
        "1. Enrichment still in progress (wait for loader to complete)",
        "2. Enrichment APIs failed (check console logs)",
        "3. Old session data (data cleared)",
        "4. APIs not called yet"
      ];
      debugData.howToCheck = "Look for 🔵 (PayCard) and 🟢 (MarketCard) logs in browser console";
    }

    setScrapedData(debugData);
    setShowDebugModal(true);
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

      {/* Debug Button - Bottom Left Corner */}
      <button
        onClick={handleDebugClick}
        className="fixed bottom-6 left-6 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
        title="View Raw Scraped Data"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
          />
        </svg>
        Debug Data
      </button>

      {/* Debug Modal - Centered */}
      {showDebugModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowDebugModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Raw Apify Scraped Data</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Unprocessed job postings and profiles from LinkedIn (before AI analysis)
                </p>
              </div>
              <button
                onClick={() => setShowDebugModal(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Close"
              >
                <svg 
                  className="w-6 h-6 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
                {JSON.stringify(scrapedData, null, 2)}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {scrapedData && Object.keys(scrapedData).length} fields
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(scrapedData, null, 2));
                  alert("Copied to clipboard!");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                </svg>
                Copy JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
