"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HireCardTabs } from "@/components/HireCardTabs";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";

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

      setLoading(false);
    };

    checkSubscription();
  }, [router]);

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
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 mb-6 transition-colors hover:opacity-80"
              style={{ color: "#102a63" }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>

            <div>
              <h1
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: "#102a63" }}
              >
                Your{" "}
                <span
                  className="px-3 py-1 rounded-lg"
                  style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
                >
                  HireCard Strategy
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                {isSubscribed 
                  ? "Complete hiring intelligence across 13 strategic cards"
                  : "Preview your hiring analysis (Subscribe to unlock all 13 cards)"
                }
              </p>
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
