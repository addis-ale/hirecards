"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BattleCardOnePager from "@/components/BattleCardOnePager";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Card {
  id: number;
  type: string;
  title: string;
  icon: string;
  content: any;
}

export default function ResultsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve cards from sessionStorage
    const storedCards = sessionStorage.getItem("battleCards");
    if (storedCards) {
      setCards(JSON.parse(storedCards));
      setLoading(false);
    } else {
      // Redirect to create page if no cards found
      router.push("/create");
    }
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
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-12">
            <button
              onClick={() => router.push("/create")}
              className="flex items-center space-x-2 mb-6 transition-colors hover:opacity-80"
              style={{ color: "#102a63" }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Create Another Deck</span>
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
                  Hiring Battle Card
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                Complete hiring intelligence in one professional document
              </p>
            </div>
          </div>

          {/* Battle Card One-Pager */}
          <div className="max-w-6xl mx-auto mt-8 mb-8">
            <BattleCardOnePager cards={cards} />
          </div>

          {/* CTA Section */}
          <div
            className="max-w-4xl mx-auto mt-16 text-center p-8 rounded-xl shadow-md"
            style={{ backgroundColor: "#d7f4f2" }}
          >
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: "#102a63" }}
            >
              Love Your Battle Cards?
            </h3>
            <p className="text-gray-700 mb-6">
              Create unlimited decks, access premium templates, and get advanced
              analytics
            </p>
            <button className="btn-primary px-8 py-3">Upgrade to Pro</button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
