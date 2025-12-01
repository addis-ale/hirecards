'use client';

import { useState, useEffect } from 'react';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Search,
  BarChart3,
  Globe,
  Briefcase,
  Crosshair,
  LineChart,
  Microscope,
  Shield,
  GraduationCap,
  Star,
  Sparkles
} from 'lucide-react';
import ClarityScoreModal from './ClarityScoreModal';

interface JobURLInputProps {
  onDataExtracted: (data: any) => void;
}

export default function JobURLInput({ onDataExtracted }: JobURLInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showClarityModal, setShowClarityModal] = useState(false);
  const [clarityData, setClarityData] = useState<any>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const loadingMessages = [
    { icon: Search, text: "Scanning 1,200+ trusted job market sources..." },
    {
      icon: BarChart3,
      text: "Analyzing real-time salary data from verified databases...",
    },
    {
      icon: Globe,
      text: "Cross-referencing international market standards...",
    },
    {
      icon: Briefcase,
      text: "Comparing with similar roles across 50+ industries...",
    },
    {
      icon: Crosshair,
      text: "Evaluating skill requirements against market demand...",
    },
    {
      icon: LineChart,
      text: "Processing compensation trends from top companies...",
    },
    {
      icon: Microscope,
      text: "Running deep analysis on job description clarity...",
    },
    { icon: Shield, text: "Validating data accuracy from multiple sources..." },
    {
      icon: GraduationCap,
      text: "Matching requirements with industry certifications...",
    },
    { icon: Star, text: "Calculating your competitive positioning score..." },
  ];

  // Cycle through loading messages every 3 seconds
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setLoadingMessageIndex(0);
    }
  }, [isLoading, loadingMessages.length]);

  // Progress bar animation - synced with actual analysis
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(5); // Start at 5% immediately
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;

        // Progress curve: fast at start, slower towards end
        // 0-10s: reach 50%
        // 10-30s: reach 85%
        // 30s+: slowly approach 95%
        let progress;
        if (elapsed < 10000) {
          // First 10 seconds: 5% -> 50%
          progress = 5 + (elapsed / 10000) * 45;
        } else if (elapsed < 30000) {
          // 10-30 seconds: 50% -> 85%
          progress = 50 + ((elapsed - 10000) / 20000) * 35;
        } else {
          // After 30s: slowly approach 95%
          progress = 85 + Math.min(((elapsed - 30000) / 60000) * 10, 10);
        }

        setLoadingProgress(Math.min(progress, 95));
      }, 200); // Update every 200ms

      return () => clearInterval(timer);
    } else {
      // When analysis completes, set to 100%
      setLoadingProgress((prev) => {
        if (prev > 0 && prev < 100) {
          return 100;
        }
        return prev;
      });
    }
  }, [isLoading]);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a job URL');
      return;
    }

    // Basic URL validation
    if (!url.includes('http') && !url.includes('www.')) {
      setError('Please enter a valid URL (e.g., https://...)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/scrape-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        // Check if this is an irrelevant URL (confidence 0 or no data extracted)
        const hasData = result.data && (
          result.data.roleTitle || 
          result.data.department || 
          result.data.criticalSkills?.length > 0 ||
          result.data.location ||
          result.data.workModel
        );
        
        if (!hasData || result.data.confidence === 0) {
          // Irrelevant URL detected
          setError('⚠️ That URL doesn\'t look like a job posting. Try a different link or just type the role details.');
          onDataExtracted(result.data); // Still pass data (will be empty) to trigger chat response
        } else {
          // Calculate clarity score
          const fieldsCount = {
            roleTitle: result.data.roleTitle ? 1 : 0,
            department: result.data.department ? 1 : 0,
            experienceLevel: result.data.experienceLevel ? 1 : 0,
            location: result.data.location ? 1 : 0,
            workModel: result.data.workModel ? 1 : 0,
            criticalSkills: result.data.criticalSkills?.length > 0 ? 1 : 0,
            salary: (result.data.minSalary && result.data.maxSalary) ? 1 : 0,
            nonNegotiables: result.data.nonNegotiables ? 1 : 0,
            timeline: result.data.timeline ? 1 : 0,
            flexible: result.data.flexible ? 1 : 0,
          };
          
          const filledFields = Object.values(fieldsCount).reduce((a, b) => a + b, 0);
          const totalFields = 10;
          const score = Math.round((filledFields / totalFields) * 100);
          
          // Get missing fields
          const missingFields = [];
          if (!result.data.roleTitle) missingFields.push('Role Title');
          if (!result.data.department) missingFields.push('Department');
          if (!result.data.experienceLevel) missingFields.push('Experience Level');
          if (!result.data.location) missingFields.push('Location');
          if (!result.data.workModel) missingFields.push('Work Model');
          if (!result.data.criticalSkills || result.data.criticalSkills.length === 0) missingFields.push('Critical Skills');
          if (!result.data.minSalary || !result.data.maxSalary) missingFields.push('Salary Range');
          if (!result.data.nonNegotiables) missingFields.push('Non-Negotiables');
          if (!result.data.timeline) missingFields.push('Timeline');
          if (!result.data.flexible) missingFields.push('Nice-to-Have Skills');
          
          // Generate category and message
          let category = '';
          let message = '';
          
          if (score >= 90) {
            category = 'Crystal Clear';
            message = `Wow! Look at you with a clarity score of ${score}/100, you actually know what you're doing! This is rare. Like, unicorn-level rare. We've got everything we need to build you a killer HireCard. Let's make this happen.`;
          } else if (score >= 70) {
            category = 'Moderate-High Clarity';
            message = `Oh, look at you with a clarity score of ${score}/100, it's like you almost know what you're doing! But spoiler alert: those missing fields are the equivalent of leaving the house without pants. Sure, you might get lucky and have someone show up, but good luck convincing them that your undefined expectations are worth their time!`;
          } else if (score >= 50) {
            category = 'Moderate Clarity';
            message = `Clarity score: ${score}/100. So... you're halfway there. Congrats, I guess? But here's the thing: you're asking people to apply for a role where half the details are a mystery. It's like selling a car and saying "it has wheels... probably." Fill in the gaps, or prepare for confusion and ghosting.`;
          } else {
            category = 'Low Clarity';
            message = `Yikes. ${score}/100. That's not a clarity score, that's a cry for help. You've given us so little information that even AI is confused. And trust me, that's saying something. If you want actual candidates (not psychics), you need to fill in these blanks. All of them.`;
          }
          
          setClarityData({
            score,
            category,
            message,
            missingFields,
            data: result.data,
          });
          
          setSuccess(true);
          setShowClarityModal(true);
          
          // Reset URL after a delay
          setTimeout(() => {
            setUrl('');
            setSuccess(false);
          }, 2000);
        }
      } else {
        setError(result.error || 'Failed to scrape job URL');
      }
    } catch (err) {
      console.error('Scraping error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteFields = () => {
    // Pass data to chatbot and close clarity modal
    setShowClarityModal(false);
    if (clarityData) {
      onDataExtracted(clarityData.data);
    }
  };

  const handleGenerateAnyway = () => {
    // Pass data to chatbot, close modal, and trigger generation
    setShowClarityModal(false);
    if (clarityData) {
      onDataExtracted(clarityData.data);
      // Trigger generation flow
      setTimeout(() => {
        const formData = {
          roleTitle: clarityData.data.roleTitle || "",
          department: clarityData.data.department || "",
          experienceLevel: clarityData.data.experienceLevel || "",
          location: clarityData.data.location || "",
          workModel: clarityData.data.workModel || "",
          criticalSkills: clarityData.data.criticalSkills || [],
          minSalary: clarityData.data.minSalary || "",
          maxSalary: clarityData.data.maxSalary || "",
          nonNegotiables: clarityData.data.nonNegotiables || "",
          flexible: clarityData.data.flexible || "",
          timeline: clarityData.data.timeline || "",
        };
        sessionStorage.setItem("formData", JSON.stringify(formData));
        window.location.href = "/results";
      }, 500);
    }
  };

  return (
    <>
      {/* Full Screen Loading Dialog */}
      {isLoading && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto"
          style={{
            height: "100vh",
            width: "100vw",
            backgroundColor: "#f5f5f5",
          }}
        >
          {/* Prevent body scrolling but allow dialog scrolling */}
          <style jsx global>{`
            body {
              overflow: hidden !important;
            }
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>

          <div className="max-w-xl mx-auto px-4 text-center py-8 w-full">
            {/* Main Heading */}
            <div className="mb-3">
              <h2
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ color: "#102a63" }}
              >
                KEEP THIS PAGE OPEN
              </h2>
              <p
                className="text-base md:text-lg"
                style={{ color: "#102a63", opacity: 0.8 }}
              >
                Keep this page open to see your personalized hiring analysis!
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-3 w-full max-w-md mx-auto">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles
                    className="w-5 h-5 animate-pulse"
                    style={{ color: "#278f8c" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#102a63" }}
                  >
                    Analyzing...
                  </span>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: "#278f8c" }}
                >
                  {Math.round(loadingProgress)}%
                </span>
              </div>
              {/* Progress bar container */}
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full relative transition-all duration-300 ease-out"
                  style={{
                    width: `${loadingProgress}%`,
                    backgroundColor: "#278f8c",
                  }}
                >
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Time Estimate */}
            <div className="mb-3 space-y-1">
              <div
                className="inline-block px-3 py-1.5 rounded-full border-2 shadow-sm"
                style={{
                  backgroundColor: "#d7f4f2",
                  borderColor: "#278f8c",
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#102a63" }}
                >
                  Initial generation takes 30–45 seconds
                </p>
              </div>
              <p
                className="text-sm"
                style={{ color: "#102a63", opacity: 0.7 }}
              >
                This is completely normal. We&apos;re doing deep market
                research for you
              </p>
            </div>

            {/* Status Messages */}
            <div className="mb-3">
              <p
                className="text-base md:text-lg font-medium mb-2"
                style={{ color: "#102a63" }}
              >
                We&apos;re analyzing opportunities for you
              </p>

              {/* Progress Steps */}
              <div className="flex items-center justify-center space-x-1.5 text-sm mb-3">
                <span
                  className="font-medium animate-pulse"
                  style={{ color: "#278f8c" }}
                >
                  Starting
                </span>
                <span style={{ color: "#102a63", opacity: 0.4 }}>
                  →
                </span>
                <span
                  className="font-medium animate-pulse"
                  style={{ color: "#278f8c", animationDelay: "0.5s" }}
                >
                  Searching
                </span>
                <span style={{ color: "#102a63", opacity: 0.4 }}>
                  →
                </span>
                <span
                  className="font-medium animate-pulse"
                  style={{ color: "#278f8c", animationDelay: "1s" }}
                >
                  Analyzing
                </span>
                <span style={{ color: "#102a63", opacity: 0.4 }}>
                  →
                </span>
                <span
                  className="font-medium animate-pulse"
                  style={{ color: "#278f8c", animationDelay: "1.5s" }}
                >
                  Complete
                </span>
              </div>

              {/* Rotating Trust Messages */}
              <div
                key={loadingMessageIndex}
                className="min-h-[45px] flex items-center justify-center px-2"
              >
                <div
                  className="px-3 py-2 rounded-lg bg-white shadow-md border flex items-center space-x-2 max-w-full"
                  style={{ borderColor: "#d7f4f2" }}
                >
                  {(() => {
                    const IconComponent =
                      loadingMessages[loadingMessageIndex].icon;
                    return (
                      <IconComponent
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "#278f8c" }}
                      />
                    );
                  })()}
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#278f8c" }}
                  >
                    {loadingMessages[loadingMessageIndex].text}
                  </p>
                </div>
              </div>
            </div>

            {/* Inspiration Section */}
            <div
              className="mt-4 p-3 rounded-lg bg-white shadow-md border-2"
              style={{ borderColor: "#d7f4f2" }}
            >
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#278f8c" }}
              >
                Hiring Wisdom
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#102a63", opacity: 0.8 }}
              >
                While we work, remember: The best hires aren&apos;t
                always the ones with the most experience, they&apos;re
                the ones who understand your mission and bring the
                energy to execute it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clarity Score Modal */}
      {clarityData && (
        <ClarityScoreModal
          isOpen={showClarityModal}
          onClose={() => setShowClarityModal(false)}
          score={clarityData.score}
          category={clarityData.category}
          message={clarityData.message}
          missingFields={clarityData.missingFields}
          onCompleteFields={handleCompleteFields}
          onGenerateAnyway={handleGenerateAnyway}
        />
      )}

      <div className="mb-2">
        <form onSubmit={handleScrape}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Just drop your job description here"
              disabled={isLoading || success}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={!url.trim() || isLoading || success}
            className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Done!
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-800">
                Successfully analyzed job details!
              </p>
            </div>
          </div>
        )}
      </form>
      </div>
    </>
  );
}
