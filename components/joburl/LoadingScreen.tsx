import { 
  Search, BarChart3, Globe, Briefcase, Crosshair, 
  LineChart, Microscope, Shield, GraduationCap, Star, Sparkles 
} from "lucide-react";

interface LoadingScreenProps {
  progress: number;
  messageIndex: number;
}

const LOADING_MESSAGES = [
  { icon: Search, text: "Scanning 1,200+ trusted job market sources..." },
  { icon: BarChart3, text: "Analyzing real-time salary data from verified databases..." },
  { icon: Globe, text: "Cross-referencing international market standards..." },
  { icon: Briefcase, text: "Comparing with similar roles across 50+ industries..." },
  { icon: Crosshair, text: "Evaluating skill requirements against market demand..." },
  { icon: LineChart, text: "Processing compensation trends from top companies..." },
  { icon: Microscope, text: "Running deep analysis on job description clarity..." },
  { icon: Shield, text: "Validating data accuracy from multiple sources..." },
  { icon: GraduationCap, text: "Matching requirements with industry certifications..." },
  { icon: Star, text: "Calculating your competitive positioning score..." },
];

export default function LoadingScreen({ progress, messageIndex }: LoadingScreenProps) {
  const currentMessage = LOADING_MESSAGES[messageIndex % LOADING_MESSAGES.length];
  const IconComponent = currentMessage.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      style={{ backgroundColor: "#f5f5f5" }}
    >
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
          <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: "#102a63" }}>
            ANALYZING JOB POSTING
          </h2>
          <p className="text-base md:text-lg" style={{ color: "#102a63", opacity: 0.8 }}>
            Extracting details from the job URL...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-3 w-full max-w-md mx-auto">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 animate-pulse" style={{ color: "#278f8c" }} />
              <span className="text-sm font-medium" style={{ color: "#102a63" }}>
                Processing...
              </span>
            </div>
            <span className="text-lg font-bold" style={{ color: "#278f8c" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full relative transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: "#278f8c",
              }}
            >
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* Rotating Message */}
        <div key={messageIndex} className="min-h-[45px] flex items-center justify-center px-2 mb-4">
          <div
            className="px-3 py-2 rounded-lg bg-white shadow-md border flex items-center space-x-2 max-w-full"
            style={{ borderColor: "#d7f4f2" }}
          >
            <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: "#278f8c" }} />
            <p className="text-sm font-medium" style={{ color: "#278f8c" }}>
              {currentMessage.text}
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-3 rounded-lg bg-white shadow-md border-2" style={{ borderColor: "#d7f4f2" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#278f8c" }}>
            What We're Doing
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#102a63", opacity: 0.8 }}>
            We're extracting role details, requirements, salary info, and analyzing the job description 
            quality to give you the best insights.
          </p>
        </div>
      </div>
    </div>
  );
}
