"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  DollarSign,
  Trash2,
  Eye,
  Download,
  Search,
  Filter
} from "lucide-react";

interface SavedCard {
  id: string;
  roleTitle: string;
  experienceLevel: string;
  location: string;
  workModel: string;
  salaryRange: string;
  createdAt: string;
  cards: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<SavedCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "role">("newest");

  const loadSavedCards = () => {
    // Load from localStorage
    const saved = localStorage.getItem("savedHireCards");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedCards(parsed);
      } catch (err) {
        console.error("Failed to load saved cards:", err);
      }
    }
  };

  const filterAndSortCards = useCallback(() => {
    let filtered = [...savedCards];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(card =>
        card.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return a.roleTitle.localeCompare(b.roleTitle);
      }
    });

    setFilteredCards(filtered);
  }, [savedCards, searchQuery, sortBy]);

  useEffect(() => {
    loadSavedCards();
  }, []);

  useEffect(() => {
    filterAndSortCards();
  }, [savedCards, searchQuery, sortBy, filterAndSortCards]);

  const viewCard = (card: SavedCard) => {
    // Save to sessionStorage and navigate to results
    sessionStorage.setItem("battleCards", JSON.stringify(card.cards));
    sessionStorage.setItem("formData", JSON.stringify({
      roleTitle: card.roleTitle,
      experienceLevel: card.experienceLevel,
      location: card.location,
      workModel: card.workModel,
      salaryRange: card.salaryRange,
    }));
    router.push("/results");
  };

  const deleteCard = (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      const updated = savedCards.filter(card => card.id !== id);
      setSavedCards(updated);
      localStorage.setItem("savedHireCards", JSON.stringify(updated));
    }
  };

  const downloadCard = (card: SavedCard) => {
    // Create downloadable JSON
    const dataStr = JSON.stringify(card, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hirecard-${card.roleTitle.replace(/\s+/g, "-").toLowerCase()}-${new Date(card.createdAt).toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <Navbar />
      
      <div className="pt-32 md:pt-36 pb-16">
        <div className="section-container">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: "#102a63" }}
            >
              My{" "}
              <span
                className="px-3 py-1 rounded-lg"
                style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
              >
                HireCards
              </span>
            </h1>
            <p className="text-lg" style={{ color: "#102a63", opacity: 0.7 }}>
              View and manage your saved hiring strategies
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by role or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="role">Role Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredCards.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold mb-2" style={{ color: "#102a63" }}>
                {searchQuery ? "No matching cards found" : "No saved cards yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? "Try adjusting your search criteria"
                  : "Create your first HireCard to get started"
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push("/")}
                  className="btn-primary px-6 py-3"
                >
                  Create HireCard
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Card Header */}
                  <div
                    className="p-4"
                    style={{ backgroundColor: "#d7f4f2" }}
                  >
                    <h3
                      className="font-bold text-lg mb-2 line-clamp-2"
                      style={{ color: "#102a63" }}
                    >
                      {card.roleTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#102a63", opacity: 0.8 }}>
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(card.createdAt)}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2" style={{ color: "#102a63" }}>
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{card.experienceLevel}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: "#102a63" }}>
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{card.location} • {card.workModel}</span>
                      </div>
                      {card.salaryRange && (
                        <div className="flex items-center gap-2" style={{ color: "#102a63" }}>
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span>${card.salaryRange}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-200 flex gap-2">
                      <button
                        onClick={() => viewCard(card)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#278f8c] text-white rounded-lg hover:bg-[#20706e] transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => downloadCard(card)}
                        className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-[#278f8c] text-[#278f8c] rounded-lg hover:bg-[#d7f4f2] transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {savedCards.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold" style={{ color: "#278f8c" }}>
                    {savedCards.length}
                  </div>
                  <div className="text-sm text-gray-600">Total HireCards</div>
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: "#278f8c" }}>
                    {new Set(savedCards.map(c => c.roleTitle)).size}
                  </div>
                  <div className="text-sm text-gray-600">Unique Roles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: "#278f8c" }}>
                    {savedCards.filter(c => 
                      new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">Created This Week</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
