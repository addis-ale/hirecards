'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BattleCard from '@/components/BattleCard';
import { Download, Share2, ArrowLeft, Loader2 } from 'lucide-react';

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
    const storedCards = sessionStorage.getItem('battleCards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
      setLoading(false);
    } else {
      // Redirect to create page if no cards found
      router.push('/create');
    }
  }, [router]);

  const handleDownload = () => {
    // Create downloadable JSON
    const dataStr = JSON.stringify(cards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'battle-cards.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My HireCards Battle Deck',
          text: 'Check out my hiring battle cards from HireCards!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your battle cards...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="section-container">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-12">
            <button
              onClick={() => router.push('/create')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Create Another Deck</span>
            </button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Your <span className="gradient-text">Battle Card Deck</span>
                </h1>
                <p className="text-xl text-gray-600">
                  {cards.length} cards ready to accelerate your hiring
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDownload}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleShare}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <BattleCard key={card.id} card={card} index={index} />
            ))}
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-16 text-center card bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100">
            <h3 className="text-2xl font-bold mb-4">Love Your Battle Cards?</h3>
            <p className="text-gray-600 mb-6">
              Create unlimited decks, access premium templates, and get advanced analytics
            </p>
            <button className="btn-primary">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
