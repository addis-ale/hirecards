"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { HireCardTabs } from "@/components/HireCardTabs";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  LayoutDashboard,
  Lock,
  Share2,
} from "lucide-react";
import {
  allCards,
  cardCategories,
  getCardsByCategory,
} from "@/lib/cardCategories";
import { CardPreview } from "@/components/cards/CardPreview";
import DebugDataViewer from "@/components/DebugDataViewer";
import { ShareCardsModal } from "@/components/ShareCardsModal";

export default function ResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  const filteredCards = selectedCategory
    ? getCardsByCategory(selectedCategory)
    : allCards;

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // Scroll to cards grid after a short delay to ensure DOM is updated
    setTimeout(() => {
      if (cardsGridRef.current) {
        const elementPosition = cardsGridRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 120; // 120px gap from top
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const selectedCategoryData = selectedCategory
    ? cardCategories.find((cat) => cat.id === selectedCategory)
    : null;

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

    // Get current card from session
    const activeTab = sessionStorage.getItem("activeTab");
    if (activeTab) {
      setCurrentCardId(activeTab);
    }
  }, [router]);

  const saveToLibrary = () => {
    try {
      // Get current form data and cards
      // Try heroAnalysisData first (from Hero section), then formData (from chatbot/form)
      const formData =
        sessionStorage.getItem("formData") ||
        sessionStorage.getItem("heroAnalysisData");
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
        salaryRange:
          parsed.salaryRange || (parsed.minSalary && parsed.maxSalary)
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
      const isDuplicate = savedCards.some(
        (card: any) =>
          card.roleTitle === savedCard.roleTitle &&
          card.location === savedCard.location &&
          new Date(card.createdAt).toDateString() ===
            new Date(savedCard.createdAt).toDateString()
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
    const rawJobsMarketCard = sessionStorage.getItem(
      "apifyRawJobsData_MarketCard"
    );
    const rawProfiles = sessionStorage.getItem("apifyRawProfilesData");

    const debugData: any = {
      note: "RAW SCRAPED DATA FROM APIFY (NOT ANALYZED)",
      description:
        "This shows the actual job postings and profiles scraped by Apify actors - unprocessed and unanalyzed",
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
      debugData.marketCardJobs = {
        message: "No raw jobs data found for MarketCard",
      };
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
        reason:
          "Profile scraper currently disabled (requires profile URLs as input)",
      };
    }

    // Add warning if no data
    if (!hasAnyData) {
      debugData.warning = "No raw Apify data found in sessionStorage";
      debugData.possibleReasons = [
        "1. Enrichment still in progress (wait for loader to complete)",
        "2. Enrichment APIs failed (check console logs)",
        "3. Old session data (data cleared)",
        "4. APIs not called yet",
      ];
      debugData.howToCheck =
        "Look for 🔵 (PayCard) and 🟢 (MarketCard) logs in browser console";
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
                style={{
                  backgroundColor: "#d7f4f2",
                  border: "2px solid #278f8c",
                }}
              >
                <CheckCircle
                  className="w-6 h-6 flex-shrink-0"
                  style={{ color: "#278f8c" }}
                />
                <div>
                  <p className="font-bold" style={{ color: "#102a63" }}>
                    Payment Successful! 🎉
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "#102a63", opacity: 0.8 }}
                  >
                    You&apos;ve unlocked the {selectedPlan} plan. Your complete
                    hiring battle cards are ready below!
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
                  : "Not bad. Let's break down what you're dealing with."}
              </p>
              <p className="text-base text-gray-500 max-w-2xl mx-auto mb-4">
                13 cards. Zero fluff. Just market data, sourcing tactics,
                interview frameworks, and a plan to fill this role.
              </p>
            </div>
          </div>

          {/* Category Cards - Clickable */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Foundation */}
              <motion.button
                onClick={() => handleCategoryClick("foundation")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-xl border-2 transition-all text-left cursor-pointer
                  ${
                    selectedCategory === "foundation"
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-700 text-white shadow-xl"
                      : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                    selectedCategory === "foundation"
                      ? "bg-white/20"
                      : "bg-purple-50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      selectedCategory === "foundation"
                        ? "text-white"
                        : "text-purple-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4
                  className={`font-bold mb-1 text-base ${
                    selectedCategory === "foundation"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Foundation
                </h4>
                <p
                  className={`text-xs leading-tight ${
                    selectedCategory === "foundation"
                      ? "text-white/90"
                      : "text-gray-600"
                  }`}
                >
                  Core understanding of the role, requirements & skills needed
                </p>
                {selectedCategory === "foundation" && (
                  <div className="mt-2 text-xs font-semibold text-white/80">
                    {getCardsByCategory("foundation").length} cards
                  </div>
                )}
              </motion.button>
              {/* Market Intelligence */}
              <motion.button
                onClick={() => handleCategoryClick("market")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-xl border-2 transition-all text-left cursor-pointer
                  ${
                    selectedCategory === "market"
                      ? "bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-700 text-white shadow-xl"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                    selectedCategory === "market" ? "bg-white/20" : "bg-blue-50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      selectedCategory === "market"
                        ? "text-white"
                        : "text-blue-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4
                  className={`font-bold mb-1 text-base ${
                    selectedCategory === "market"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Market Intelligence
                </h4>
                <p
                  className={`text-xs leading-tight ${
                    selectedCategory === "market"
                      ? "text-white/90"
                      : "text-gray-600"
                  }`}
                >
                  Demand, supply, competition analysis & salary benchmarks
                </p>
                {selectedCategory === "market" && (
                  <div className="mt-2 text-xs font-semibold text-white/80">
                    {getCardsByCategory("market").length} cards
                  </div>
                )}
              </motion.button>

              {/* Talent Sourcing / Outreach */}
              <motion.button
                onClick={() => handleCategoryClick("outreach")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-xl border-2 transition-all text-left cursor-pointer
                  ${
                    selectedCategory === "outreach"
                      ? "bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-700 text-white shadow-xl"
                      : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                    selectedCategory === "outreach"
                      ? "bg-white/20"
                      : "bg-emerald-50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      selectedCategory === "outreach"
                        ? "text-white"
                        : "text-emerald-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4
                  className={`font-bold mb-1 text-base ${
                    selectedCategory === "outreach"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Talent Sourcing
                </h4>
                <p
                  className={`text-xs leading-tight ${
                    selectedCategory === "outreach"
                      ? "text-white/90"
                      : "text-gray-600"
                  }`}
                >
                  Where to find candidates, outreach strategies & funnel
                  building
                </p>
                {selectedCategory === "outreach" && (
                  <div className="mt-2 text-xs font-semibold text-white/80">
                    {getCardsByCategory("outreach").length} cards
                  </div>
                )}
              </motion.button>

              {/* Interview System / Selection */}
              <motion.button
                onClick={() => handleCategoryClick("selection")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-xl border-2 transition-all text-left cursor-pointer
                  ${
                    selectedCategory === "selection"
                      ? "bg-gradient-to-br from-amber-600 to-orange-600 border-amber-700 text-white shadow-xl"
                      : "bg-white border-gray-200 hover:border-amber-300 hover:shadow-lg"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                    selectedCategory === "selection"
                      ? "bg-white/20"
                      : "bg-amber-50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      selectedCategory === "selection"
                        ? "text-white"
                        : "text-amber-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h4
                  className={`font-bold mb-1 text-base ${
                    selectedCategory === "selection"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Interview System
                </h4>
                <p
                  className={`text-xs leading-tight ${
                    selectedCategory === "selection"
                      ? "text-white/90"
                      : "text-gray-600"
                  }`}
                >
                  Structured questions, scorecards & evaluation frameworks
                </p>
                {selectedCategory === "selection" && (
                  <div className="mt-2 text-xs font-semibold text-white/80">
                    {getCardsByCategory("selection").length} cards
                  </div>
                )}
              </motion.button>

              {/* Action Plans / Onboarding */}
              <motion.button
                onClick={() => handleCategoryClick("onboarding")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-xl border-2 transition-all text-left cursor-pointer
                  ${
                    selectedCategory === "onboarding"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-700 text-white shadow-xl"
                      : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-lg"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                    selectedCategory === "onboarding"
                      ? "bg-white/20"
                      : "bg-indigo-50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      selectedCategory === "onboarding"
                        ? "text-white"
                        : "text-indigo-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h4
                  className={`font-bold mb-1 text-base ${
                    selectedCategory === "onboarding"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Action Plans
                </h4>
                <p
                  className={`text-xs leading-tight ${
                    selectedCategory === "onboarding"
                      ? "text-white/90"
                      : "text-gray-600"
                  }`}
                >
                  Week-by-week roadmap & execution templates
                </p>
                {selectedCategory === "onboarding" && (
                  <div className="mt-2 text-xs font-semibold text-white/80">
                    {getCardsByCategory("onboarding").length} cards
                  </div>
                )}
              </motion.button>

              {/* Show All Cards */}
              <motion.button
                onClick={() => handleCategoryClick(null)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-xl border-2 transition-all text-left cursor-pointer
                  ${
                    !selectedCategory
                      ? "bg-gradient-to-br from-gray-700 to-gray-900 border-gray-800 text-white shadow-xl"
                      : "bg-white border-gray-200 hover:border-gray-400 hover:shadow-lg"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                    !selectedCategory
                      ? "bg-white/20"
                      : "bg-gray-50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      !selectedCategory
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
                <h4
                  className={`font-bold mb-1 text-base ${
                    !selectedCategory
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  All Cards
                </h4>
                <p
                  className={`text-xs leading-tight ${
                    !selectedCategory
                      ? "text-white/90"
                      : "text-gray-600"
                  }`}
                >
                  View all 13 hiring strategy cards
                </p>
                {!selectedCategory && (
                  <div className="mt-2 text-xs font-semibold text-white/80">
                    {allCards.length} cards
                  </div>
                )}
              </motion.button>
            </div>
            
            {/* Share Button - Below Categories, Right Aligned */}
            <div className="flex justify-end mt-4">
              <motion.button
                onClick={() => setShowShareModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-[#278f8c] text-white rounded-lg hover:bg-[#1a6764] transition-colors shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span className="font-medium text-sm">Share Cards</span>
              </motion.button>
            </div>
          </div>

          {/* Section Divider */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <div className="flex items-center gap-2 px-4">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <h2 className="text-lg font-semibold text-gray-700">
                  {selectedCategory
                    ? `${selectedCategoryData?.name || "Selected"} Cards`
                    : "All Cards"}
                </h2>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
            <div className="flex items-center justify-start gap-3 mt-4">
              {selectedCategory && (
                <>
                  <motion.button
                    onClick={() => handleCategoryClick(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all border border-gray-300 hover:border-gray-400 flex items-center gap-2"
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
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                    Show All Cards
                  </motion.button>
                  <p className="text-sm text-gray-500">
                    {selectedCategoryData?.description}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div ref={cardsGridRef} className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CardPreview
                    card={card}
                    isCurrent={currentCardId === card.id}
                    onClick={() => router.push(`/cards/${card.id}`)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: "#102a63" }}
              >
                Score Impact Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                  onClick={() => handleCategoryClick("foundation")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-center p-3 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === "foundation"
                      ? "bg-purple-50 border-2 border-purple-300"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <div className="text-2xl font-bold text-purple-600">+3.8</div>
                  <div className="text-sm text-gray-600 mt-1">Foundation</div>
                </motion.button>
                <motion.button
                  onClick={() => handleCategoryClick("market")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-center p-3 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === "market"
                      ? "bg-blue-50 border-2 border-blue-300"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <div className="text-2xl font-bold text-blue-600">+2.3</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Market Intelligence
                  </div>
                </motion.button>
                <motion.button
                  onClick={() => handleCategoryClick("outreach")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-center p-3 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === "outreach"
                      ? "bg-emerald-50 border-2 border-emerald-300"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <div className="text-2xl font-bold text-emerald-600">
                    +2.1
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Outreach & Engagement
                  </div>
                </motion.button>
                <motion.button
                  onClick={() => handleCategoryClick("selection")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-center p-3 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === "selection"
                      ? "bg-amber-50 border-2 border-amber-300"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <div className="text-2xl font-bold text-amber-600">+1.5</div>
                  <div className="text-sm text-gray-600 mt-1">Selection</div>
                </motion.button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <div className="text-3xl font-bold text-emerald-600">+9.0</div>
                <div className="text-sm text-gray-600 mt-1">
                  Total Potential Uplift
                </div>
              </div>
            </div>
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
                <h2 className="text-xl font-bold text-gray-900">
                  Raw Apify Scraped Data
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Unprocessed job postings and profiles from LinkedIn (before AI
                  analysis)
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
                  navigator.clipboard.writeText(
                    JSON.stringify(scrapedData, null, 2)
                  );
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

      {/* Debug Data Viewers for Scraped Data */}
      <DebugDataViewer storageKey="job-scraped-data" title="job-scraped-data" />
      <DebugDataViewer
        storageKey="linkedin-people-profile-scraped-data"
        title="people-profile-scraped-data"
      />
      <DebugDataViewer
        storageKey="apifyRawProfilesData"
        title="people-profile-scraped-data (from market enrichment)"
      />

      {/* Share Cards Modal */}
      <ShareCardsModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </main>
  );
}
