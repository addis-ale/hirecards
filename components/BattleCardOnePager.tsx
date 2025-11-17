"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Search,
  Clock,
  FileText,
  Download,
  Share2,
} from "lucide-react";

interface Card {
  id: number;
  type: string;
  title: string;
  icon: string;
  content: any;
}

interface BattleCardOnePagerProps {
  cards: Card[];
}

export default function BattleCardOnePager({ cards }: BattleCardOnePagerProps) {
  // Extract data from cards
  const roleCard = cards.find((c) => c.type === "Role Definition");
  const compensationCard = cards.find((c) => c.type === "Compensation");
  const marketCard = cards.find((c) => c.type === "Market Intelligence");
  const requirementsCard = cards.find((c) => c.type === "Requirements");
  const responsibilitiesCard = cards.find((c) => c.type === "Responsibilities");
  const cultureCard = cards.find((c) => c.type === "Culture Fit");
  const messagingCard = cards.find((c) => c.type === "Messaging");
  const realityCard = cards.find((c) => c.type === "Reality Check");

  const handleDownload = async () => {
    // Dynamically import html2pdf
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.querySelector(
      ".battle-card-print-container"
    ) as HTMLElement;
    if (!element) return;

    const opt = {
      margin: 0.3,
      filename: "hiring-battle-card.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "cm", format: "a4", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hiring Battle Card - HireCards",
          text: "Check out this hiring battle card from HireCards!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Calculate feasibility score based on multiple factors
  const calculateFeasibilityScore = () => {
    let score = 100;

    // Competition factor (-0 to -25 points)
    const competition = marketCard?.content?.competition?.toLowerCase();
    if (competition === "very high") score -= 25;
    else if (competition === "high") score -= 20;
    else if (competition === "moderate") score -= 10;
    else if (competition === "low") score -= 5;

    // Market demand factor (-0 to -20 points)
    const demand = marketCard?.content?.demand?.toLowerCase();
    if (demand === "very high") score -= 20;
    else if (demand === "high") score -= 15;
    else if (demand === "moderate") score -= 8;

    // Time to fill factor (-0 to -15 points)
    const timeToFill = marketCard?.content?.timeToFill?.toLowerCase();
    if (timeToFill?.includes("6") || timeToFill?.includes("six")) score -= 15;
    else if (timeToFill?.includes("3-4") || timeToFill?.includes("4-5"))
      score -= 10;
    else if (timeToFill?.includes("2-3")) score -= 5;

    // Success rate factor (bonus +0 to +10 points)
    const successRate = realityCard?.content?.successRate;
    if (successRate?.includes("80%") || successRate?.includes("90%"))
      score += 10;
    else if (successRate?.includes("70%") || successRate?.includes("75%"))
      score += 5;

    return Math.max(20, Math.min(100, Math.round(score)));
  };

  const feasibilityScore = calculateFeasibilityScore();

  const getFeasibilityLabel = (score: number) => {
    if (score >= 85) return "Highly Achievable";
    if (score >= 70) return "Challenging but Achievable";
    if (score >= 50) return "Difficult - Plan Carefully";
    return "Very Challenging";
  };

  const getFeasibilityColor = (score: number) => {
    if (score >= 85) return "#10b981"; // green
    if (score >= 70) return "#f59e0b"; // amber
    if (score >= 50) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto my-16 relative"
    >
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-4 print:hidden">
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all border-2 hover:opacity-90"
          style={{
            borderColor: "#278f8c",
            color: "#278f8c",
            backgroundColor: "white",
          }}
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all"
          style={{
            backgroundColor: "#278f8c",
            color: "white",
          }}
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
      {/* PDF-like Container */}
      <div
        className="battle-card-print-container bg-white shadow-2xl overflow-hidden"
        style={{
          borderRadius: "8px",
          border: "2px solid #102a63",
          pageBreakInside: "avoid",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-2 text-white relative overflow-hidden border-b"
          style={{
            background: "linear-gradient(135deg, #102a63 0%, #278f8c 100%)",
            borderBottomColor: "#278f8c",
          }}
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-black mb-1 tracking-tight">
                  Your hiring deck
                </h1>
                <div className="flex items-center gap-2 text-xs">
                  <span>{roleCard?.content?.position || "Position"}</span>
                  <span>•</span>
                  <span>{roleCard?.content?.department || "Department"}</span>
                  <span>•</span>
                  <span>{roleCard?.content?.level || "Level"}</span>
                </div>
              </div>
              <div className="text-right text-xs opacity-80">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 opacity-5">
            <Briefcase className="w-48 h-48 -mt-12 -mr-12" />
          </div>
        </div>

        {/* Reality Check - Full Width */}
        <div className="px-4 pt-2 pb-2">
          <div
            className="relative overflow-hidden rounded-lg shadow-sm"
            style={{
              background:
                feasibilityScore >= 85
                  ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
                  : feasibilityScore >= 70
                  ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                  : feasibilityScore >= 50
                  ? "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)"
                  : "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
              border: `1px solid ${getFeasibilityColor(feasibilityScore)}`,
            }}
          >
            <div className="p-2.5">
              <div className="flex items-center justify-between">
                {/* Left Side - Title and Description */}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div
                      className="p-1 rounded shadow-sm"
                      style={{
                        backgroundColor: getFeasibilityColor(feasibilityScore),
                      }}
                    >
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2
                        className="text-sm font-black uppercase"
                        style={{
                          color:
                            feasibilityScore >= 85
                              ? "#065f46"
                              : feasibilityScore >= 70
                              ? "#92400e"
                              : feasibilityScore >= 50
                              ? "#9a3412"
                              : "#991b1b",
                        }}
                      >
                        Reality Check
                      </h2>
                    </div>
                  </div>
                  <div className="space-y-1 max-w-2xl text-xs">
                    {realityCard?.content?.insights &&
                    realityCard.content.insights.length > 0 ? (
                      realityCard.content.insights.map(
                        (insight: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm"
                            style={{
                              color:
                                feasibilityScore >= 85
                                  ? "#065f46"
                                  : feasibilityScore >= 70
                                  ? "#78350f"
                                  : feasibilityScore >= 50
                                  ? "#7c2d12"
                                  : "#7f1d1d",
                            }}
                          >
                            <span
                              className="mt-0.5"
                              style={{
                                color: getFeasibilityColor(feasibilityScore),
                              }}
                            >
                              •
                            </span>
                            <span className="font-medium">{insight}</span>
                          </div>
                        )
                      )
                    ) : (
                      <>
                        <div
                          className="flex items-start gap-2 text-sm"
                          style={{
                            color:
                              feasibilityScore >= 85
                                ? "#065f46"
                                : feasibilityScore >= 70
                                ? "#78350f"
                                : feasibilityScore >= 50
                                ? "#7c2d12"
                                : "#7f1d1d",
                          }}
                        >
                          <span
                            className="mt-0.5"
                            style={{
                              color: getFeasibilityColor(feasibilityScore),
                            }}
                          >
                            •
                          </span>
                          <span className="font-medium">
                            Market conditions analyzed based on role
                            requirements
                          </span>
                        </div>
                        <div
                          className="flex items-start gap-2 text-sm"
                          style={{
                            color:
                              feasibilityScore >= 85
                                ? "#065f46"
                                : feasibilityScore >= 70
                                ? "#78350f"
                                : feasibilityScore >= 50
                                ? "#7c2d12"
                                : "#7f1d1d",
                          }}
                        >
                          <span
                            className="mt-0.5"
                            style={{
                              color: getFeasibilityColor(feasibilityScore),
                            }}
                          >
                            •
                          </span>
                          <span className="font-medium">
                            Timeline estimates based on current talent
                            availability
                          </span>
                        </div>
                        <div
                          className="flex items-start gap-2 text-sm"
                          style={{
                            color:
                              feasibilityScore >= 85
                                ? "#065f46"
                                : feasibilityScore >= 70
                                ? "#78350f"
                                : feasibilityScore >= 50
                                ? "#7c2d12"
                                : "#7f1d1d",
                          }}
                        >
                          <span
                            className="mt-0.5"
                            style={{
                              color: getFeasibilityColor(feasibilityScore),
                            }}
                          >
                            •
                          </span>
                          <span className="font-medium">
                            Competition level factored into feasibility
                            assessment
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Side - Feasibility Score */}
                <div className="flex flex-col items-center justify-center px-2">
                  <div className="text-center">
                    <div
                      className="text-xs uppercase font-bold mb-0.5"
                      style={{
                        color:
                          feasibilityScore >= 85
                            ? "#047857"
                            : feasibilityScore >= 70
                            ? "#b45309"
                            : feasibilityScore >= 50
                            ? "#c2410c"
                            : "#b91c1c",
                      }}
                    >
                      Score
                    </div>
                    <div className="relative">
                      <svg className="w-20 h-20" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={
                            feasibilityScore >= 85
                              ? "#d1fae5"
                              : feasibilityScore >= 70
                              ? "#fde68a"
                              : feasibilityScore >= 50
                              ? "#fed7aa"
                              : "#fecaca"
                          }
                          strokeWidth="8"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={getFeasibilityColor(feasibilityScore)}
                          strokeWidth="8"
                          strokeDasharray={`${
                            (feasibilityScore / 100) * 251.2
                          } 251.2`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div
                          className="text-2xl font-black"
                          style={{
                            color:
                              feasibilityScore >= 85
                                ? "#065f46"
                                : feasibilityScore >= 70
                                ? "#92400e"
                                : feasibilityScore >= 50
                                ? "#9a3412"
                                : "#991b1b",
                          }}
                        >
                          {feasibilityScore}
                        </div>
                        <div
                          className="text-xs font-bold"
                          style={{
                            color:
                              feasibilityScore >= 85
                                ? "#047857"
                                : feasibilityScore >= 70
                                ? "#b45309"
                                : feasibilityScore >= 50
                                ? "#c2410c"
                                : "#b91c1c",
                          }}
                        >
                          /100
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                        style={{
                          backgroundColor:
                            getFeasibilityColor(feasibilityScore),
                        }}
                      >
                        {getFeasibilityLabel(feasibilityScore)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid - Equal Height Cards */}
        <div
          className="grid grid-cols-2 gap-3 px-4 pb-4"
          style={{ gridAutoRows: "1fr" }}
        >
          {/* Role Summary */}
          <div className="h-full">
            <Section
              icon={<Briefcase className="w-5 h-5" />}
              title="Role Summary"
            >
              <p className="text-sm text-gray-700 leading-relaxed">
                {roleCard?.content?.summary || "No role summary available"}
              </p>
            </Section>
          </div>

          {/* Team Context */}
          <div className="h-full">
            <Section icon={<Users className="w-5 h-5" />} title="Team Context">
              <div className="space-y-2">
                <InfoRow
                  label="Company Size"
                  value={cultureCard?.content?.companySize || "N/A"}
                />
                <InfoRow
                  label="Environment"
                  value={cultureCard?.content?.environment || "N/A"}
                />
                <InfoRow
                  label="Work Style"
                  value={cultureCard?.content?.workStyle || "N/A"}
                />
              </div>
            </Section>
          </div>

          {/* Required Experience */}
          <div className="h-full">
            <Section
              icon={<Target className="w-5 h-5" />}
              title="Required Experience"
            >
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                  Must Have
                </div>
                <ul className="space-y-1.5">
                  {requirementsCard?.content?.required?.map(
                    (item: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start space-x-2 text-sm text-gray-700"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: "#278f8c" }}
                        ></span>
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
                {requirementsCard?.content?.preferred && (
                  <>
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 mt-3">
                      Nice to Have
                    </div>
                    <ul className="space-y-1.5">
                      {requirementsCard?.content?.preferred?.map(
                        (item: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start space-x-2 text-sm text-gray-600"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 opacity-50"
                              style={{ backgroundColor: "#278f8c" }}
                            ></span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
              </div>
            </Section>
          </div>

          {/* Salary Benchmarks */}
          <div className="h-full">
            <Section
              icon={<DollarSign className="w-5 h-5" />}
              title="Salary Benchmarks"
            >
              <div className="space-y-2">
                <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-md border border-gray-200">
                  <div className="text-xs text-gray-600 mb-0.5 font-semibold uppercase tracking-wide">
                    Salary Range
                  </div>
                  <div
                    className="text-xl font-black mb-1"
                    style={{ color: "#102a63" }}
                  >
                    {compensationCard?.content?.range || "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-xs text-gray-600">
                      📍 {compensationCard?.content?.location || "Location"}
                    </div>
                  </div>
                </div>
                <div
                  className="inline-block px-3 py-1 rounded-md text-xs font-bold shadow-sm"
                  style={{
                    backgroundColor: "#d7f4f2",
                    color: "#102a63",
                  }}
                >
                  {compensationCard?.content?.marketPosition ||
                    "Market Position"}
                </div>
                {compensationCard?.content?.benefits && (
                  <div>
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                      Benefits
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {compensationCard?.content?.benefits?.map(
                        (benefit: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 text-xs text-gray-700 rounded font-medium border border-gray-200"
                          >
                            {benefit}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          </div>

          {/* Talent Availability */}
          <div className="h-full">
            <Section
              icon={<TrendingUp className="w-5 h-5" />}
              title="Talent Availability"
            >
              <div className="space-y-2">
                <InfoRow
                  label="Market Demand"
                  value={marketCard?.content?.demand || "N/A"}
                  highlight={marketCard?.content?.demand === "High"}
                />
                <InfoRow
                  label="Availability"
                  value={marketCard?.content?.talentAvailability || "N/A"}
                />
              </div>
            </Section>
          </div>

          {/* Talent Competition */}
          <div className="h-full">
            <Section
              icon={<Users className="w-5 h-5" />}
              title="Talent Competition"
            >
              <div className="space-y-2">
                <InfoRow
                  label="Competition Level"
                  value={marketCard?.content?.competition || "N/A"}
                  highlight={
                    marketCard?.content?.competition === "High" ||
                    marketCard?.content?.competition === "Very High"
                  }
                />
                <div className="text-sm text-gray-700 leading-relaxed">
                  {messagingCard?.content?.differentiators && (
                    <>
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                        Your Competitive Edge
                      </div>
                      <ul className="space-y-1">
                        {messagingCard?.content?.differentiators?.map(
                          (item: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start space-x-2 text-sm"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: "#278f8c" }}
                              ></span>
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </Section>
          </div>

          {/* Recommended Search Strategy */}
          <div className="h-full">
            <Section
              icon={<Search className="w-5 h-5" />}
              title="Recommended Search Strategy"
            >
              <div className="space-y-2">
                {messagingCard?.content?.valueProps && (
                  <>
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                      Lead With
                    </div>
                    <ul className="space-y-1.5">
                      {messagingCard?.content?.valueProps
                        ?.slice(0, 3)
                        .map((prop: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start space-x-2 text-sm text-gray-700"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: "#278f8c" }}
                            ></span>
                            <span>{prop}</span>
                          </li>
                        ))}
                    </ul>
                  </>
                )}
                {responsibilitiesCard?.content?.impact && (
                  <div
                    className="mt-3 p-3 rounded-md"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                      Impact Statement
                    </div>
                    <p className="text-sm text-gray-700">
                      {responsibilitiesCard?.content?.impact}
                    </p>
                  </div>
                )}
              </div>
            </Section>
          </div>

          {/* Expected Time to Hire */}
          <div className="h-full">
            <Section
              icon={<Clock className="w-5 h-5" />}
              title="Expected Time to Hire"
            >
              <div className="space-y-2">
                <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-md border border-gray-200">
                  <div className="text-xs text-gray-600 mb-0.5 font-semibold uppercase tracking-wide">
                    Estimated Timeline
                  </div>
                  <div
                    className="text-xl font-black mb-1"
                    style={{ color: "#102a63" }}
                  >
                    {marketCard?.content?.timeToFill || "N/A"}
                  </div>
                  {realityCard?.content?.timeToHire && (
                    <div className="text-xs text-gray-600">
                      ⏱️ {realityCard?.content?.timeToHire}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  {realityCard?.content?.applicationsNeeded && (
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md border border-blue-100">
                      <span className="text-xs font-semibold text-gray-700">
                        Pipeline Needed
                      </span>
                      <span className="text-xs font-bold text-blue-900">
                        {realityCard?.content?.applicationsNeeded}
                      </span>
                    </div>
                  )}
                  {realityCard?.content?.successRate && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-md border border-green-100">
                      <span className="text-xs font-semibold text-gray-700">
                        Success Rate
                      </span>
                      <span className="text-xs font-bold text-green-900">
                        {realityCard?.content?.successRate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Section>
          </div>
        </div>

        {/* Footer Branding */}
        <div
          className="px-4 py-1.5 text-center border-t"
          style={{
            background: "linear-gradient(135deg, #102a63 0%, #0d2147 100%)",
            borderTopColor: "#278f8c",
          }}
        >
          <p className="text-white text-xs">
            <span className="font-bold">HireCards</span>
            <span className="mx-1 opacity-50">•</span>
            <span className="opacity-80">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Helper Components

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  warning?: boolean;
}

function Section({ icon, title, children, warning }: SectionProps) {
  return (
    <div
      className="h-full rounded p-2 border shadow-sm flex flex-col"
      style={{
        backgroundColor: warning ? "#fef3c7" : "#ffffff",
        borderColor: warning ? "#f59e0b" : "#e0e7ed",
      }}
    >
      <div
        className="flex items-center space-x-1.5 mb-1.5 pb-1.5 border-b"
        style={{
          borderColor: warning ? "#fbbf24" : "#d7f4f2",
        }}
      >
        <div
          className="p-1 rounded shadow-sm"
          style={{
            backgroundColor: warning ? "#fbbf24" : "#278f8c",
            color: "white",
          }}
        >
          {icon}
        </div>
        <h3
          className="text-xs font-bold uppercase"
          style={{
            color: warning ? "#92400e" : "#102a63",
          }}
        >
          {title}
        </h3>
      </div>
      <div className="space-y-1.5 flex-1 text-xs">{children}</div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function InfoRow({ label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center text-xs py-1 px-1.5 rounded bg-gray-50">
      <span className="text-gray-700 font-semibold">{label}</span>
      <span
        className={`font-bold ${
          highlight
            ? "px-1.5 py-0.5 rounded text-white text-xs"
            : "text-gray-900"
        }`}
        style={highlight ? { backgroundColor: "#f59e0b" } : {}}
      >
        {value}
      </span>
    </div>
  );
}
