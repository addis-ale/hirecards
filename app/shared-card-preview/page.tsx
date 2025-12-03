"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EditModeProvider } from "@/components/EditModeContext";
import { EditableRealityCard } from "@/components/cards/EditableRealityCard";
import { EditableRoleCard } from "@/components/cards/EditableRoleCard";
import { EditableSkillCard } from "@/components/cards/EditableSkillCard";
import { EditableMarketCard } from "@/components/cards/EditableMarketCard";
import { EditableTalentMapCard } from "@/components/cards/EditableTalentMapCard";
import { EditablePayCard } from "@/components/cards/EditablePayCard";
import { EditableFunnelCard } from "@/components/cards/EditableFunnelCard";
import { EditableFitCard } from "@/components/cards/EditableFitCard";
import { EditableMessageCard } from "@/components/cards/EditableMessageCard";
import { EditableOutreachCard } from "@/components/cards/EditableOutreachCard";
import { EditableInterviewCard } from "@/components/cards/EditableInterviewCard";
import { EditableScorecardCard } from "@/components/cards/EditableScorecardCard";
import { EditablePlanCard } from "@/components/cards/EditablePlanCard";

const cardComponents: { [key: string]: any } = {
  reality: EditableRealityCard,
  role: EditableRoleCard,
  skill: EditableSkillCard,
  market: EditableMarketCard,
  talentmap: EditableTalentMapCard,
  pay: EditablePayCard,
  funnel: EditableFunnelCard,
  fit: EditableFitCard,
  message: EditableMessageCard,
  outreach: EditableOutreachCard,
  interview: EditableInterviewCard,
  scorecard: EditableScorecardCard,
  plan: EditablePlanCard,
};

const cardTitles: { [key: string]: string } = {
  reality: "Reality Card",
  role: "Role Card",
  skill: "Skill Card",
  market: "Market Card",
  talentmap: "Talent Map Card",
  pay: "Pay Card",
  funnel: "Funnel Card",
  fit: "Fit Card",
  message: "Message Card",
  outreach: "Outreach Card",
  interview: "Interview Card",
  scorecard: "Scorecard Card",
  plan: "Plan Card",
};

function SharedCardPreviewContent() {
  const searchParams = useSearchParams();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [jobTitle, setJobTitle] = useState<string>("Senior Analytics Engineer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get selected cards from URL query parameter
    const cardsParam = searchParams.get("cards");
    if (cardsParam) {
      const cards = cardsParam.split(",");
      setSelectedCards(cards);
    }
    
    // Get job title from URL query parameter
    const titleParam = searchParams.get("title");
    if (titleParam) {
      setJobTitle(decodeURIComponent(titleParam));
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#278f8c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (selectedCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#102a63" }}>
            No Cards Selected
          </h1>
          <p className="text-gray-600">
            Please select cards from the results page to share them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#d7f4f2] rounded-lg mb-4">
            <p className="text-sm font-medium text-[#278f8c]">Hiring Strategy For</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#102a63" }}>
            {jobTitle}
          </h1>
          <p className="text-gray-600 text-lg">
            {selectedCards.length} card{selectedCards.length !== 1 ? "s" : ""} shared with you
          </p>
        </div>

        {/* Cards Grid */}
        <div className="space-y-8">
          <EditModeProvider isEditMode={false}>
            {selectedCards.map((cardId) => {
              const CardComponent = cardComponents[cardId];
              const cardTitle = cardTitles[cardId];

              if (!CardComponent) {
                return null;
              }

              return (
                <div
                  key={cardId}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                >
                  {/* Card Header */}
                  <div
                    className="px-6 py-4 border-b border-gray-200"
                    style={{
                      background: "linear-gradient(135deg, #102a63 0%, #278f8c 100%)",
                    }}
                  >
                    <h2 className="text-2xl font-bold text-white">{cardTitle}</h2>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 md:p-8">
                    <CardComponent />
                  </div>
                </div>
              );
            })}
          </EditModeProvider>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Created with HireCards</p>
        </div>
      </div>
    </div>
  );
}

export default function SharedCardPreview() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#278f8c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </div>
    }>
      <SharedCardPreviewContent />
    </Suspense>
  );
}
