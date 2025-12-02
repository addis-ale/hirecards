"use client";

import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import BattleCardContent from "./battlecard/BattleCardContent";

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
  const roleCard = cards.find((c) => c.type === "Role Definition");

  const handleDownload = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.querySelector(".battle-card-print-container") as HTMLElement;
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Hiring Battle Card",
        text: `Battle Card for ${roleCard?.content?.jobTitle || "Role"}`,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      {/* Header with Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#102a63] mb-2">
            Hiring Battle Card
          </h1>
          <p className="text-gray-600">
            {roleCard?.content?.jobTitle || "Role Strategy"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[#278f8c] text-white rounded-lg hover:bg-[#1f7673] transition-colors shadow-md"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
          >
            <Share2 className="w-4 h-4 text-gray-700" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Battle Card Content */}
      <div className="battle-card-print-container bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
        <BattleCardContent cards={cards} />
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Generated with HireCards • {new Date().toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
}
