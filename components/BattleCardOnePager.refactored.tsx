"use client";

import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import BattleCardHeader from "./battlecard/BattleCardHeader";
import CardSection from "./battlecard/CardSection";
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

  const handleDownload = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.querySelector(".battle-card-print-container") as HTMLElement;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `hirecard-${roleCard?.content?.jobTitle || "strategy"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-[#278f8c] text-white rounded-lg hover:bg-[#1f7673] transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Main Card */}
      <div className="battle-card-print-container bg-white rounded-2xl shadow-xl p-8">
        <BattleCardHeader
          roleTitle={roleCard?.content?.jobTitle || "Role"}
          department={roleCard?.content?.department}
          location={roleCard?.content?.location}
          experienceLevel={roleCard?.content?.experienceLevel}
          minSalary={compensationCard?.content?.minSalary}
          maxSalary={compensationCard?.content?.maxSalary}
        />

        {/* Role Overview */}
        {roleCard && (
          <CardSection icon={Briefcase} title="Role Overview">
            <p className="text-gray-700 leading-relaxed">
              {roleCard.content?.description || "No description available"}
            </p>
          </CardSection>
        )}

        {/* Requirements */}
        {requirementsCard && (
          <CardSection icon={Target} title="Key Requirements">
            <ul className="space-y-2">
              {requirementsCard.content?.skills?.map((skill: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#278f8c] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{skill}</span>
                </li>
              ))}
            </ul>
          </CardSection>
        )}

        {/* Market Intelligence */}
        {marketCard && (
          <CardSection icon={TrendingUp} title="Market Intelligence">
            <div className="space-y-3">
              {marketCard.content?.insights?.map((insight: string, idx: number) => (
                <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </CardSection>
        )}

        {/* Compensation */}
        {compensationCard && (
          <CardSection icon={DollarSign} title="Compensation Strategy">
            <div className="p-4 bg-gradient-to-br from-[#278f8c]/5 to-[#102a63]/5 rounded-lg border border-[#278f8c]/20">
              <p className="text-gray-700">{compensationCard.content?.strategy}</p>
            </div>
          </CardSection>
        )}
      </div>
    </motion.div>
  );
}
