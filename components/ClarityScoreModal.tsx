"use client";

import { X, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ClarityScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  category: string;
  message: string;
  missingFields: string[];
  missingCoreFields: string[];
  onCompleteFields: () => void;
  onGenerateAnyway: () => void;
}

export default function ClarityScoreModal({
  isOpen,
  onClose,
  score,
  category,
  message,
  missingFields,
  missingCoreFields,
  onCompleteFields,
  onGenerateAnyway,
}: ClarityScoreModalProps) {
  if (!isOpen) return null;

  const getCategoryColor = () => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getCategoryBgColor = () => {
    if (score >= 90) return "bg-green-50";
    if (score >= 70) return "bg-blue-50";
    if (score >= 50) return "bg-yellow-50";
    return "bg-red-50";
  };

  const isIncomplete = missingFields.length > 0;
  const hasMissingCoreFields = missingCoreFields.length > 0;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-bold" style={{ color: "#102a63" }}>
              Clarity Score Analysis
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" style={{ color: "#102a63" }} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Score Display */}
            <div className={`${getCategoryBgColor()} rounded-xl p-4 mb-4`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-4xl font-bold" style={{ color: "#102a63" }}>
                    {score}/100
                  </div>
                  <div className={`text-base font-semibold mt-0.5 ${getCategoryColor()}`}>
                    {category}
                  </div>
                </div>
                {score >= 90 ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-yellow-600" />
                )}
              </div>

              {/* AI Message */}
              <div className="text-gray-700 text-sm leading-snug whitespace-pre-line">
                {message}
              </div>
            </div>

            {/* Core Missing Fields Warning */}
            {hasMissingCoreFields && (
              <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-base mb-2 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Core Job Requirements Missing
                </h4>
                <p className="text-sm text-red-600 mb-2">
                  These fields are required for scraping and card generation to work:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {missingCoreFields.map((field, idx) => (
                    <li key={idx} className="font-semibold">{field}</li>
                  ))}
                </ul>
                <p className="text-xs text-red-500 mt-3 font-medium">
                  ⚠️ "Generate Anyway" is disabled until these core fields are provided.
                </p>
              </div>
            )}

            {/* Missing Fields */}
            {isIncomplete && !hasMissingCoreFields && (
              <div className="mb-4">
                <h4 className="font-bold text-base mb-2" style={{ color: "#102a63" }}>
                  Complete These Fields for Better Results:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-0.5 list-disc list-inside text-sm text-gray-700">
                  {missingFields.map((field, idx) => (
                    <li key={idx}>{field}</li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Choose your path: Complete fields for accuracy, or generate quickly with what we have.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              {isIncomplete && (
                <button
                  onClick={onCompleteFields}
                  className="btn-primary flex-1 py-2.5 px-4 text-center text-sm"
                >
                  Complete Missing Fields
                </button>
              )}
              <div className="relative flex-1 group">
                <button
                  onClick={hasMissingCoreFields ? undefined : onGenerateAnyway}
                  disabled={hasMissingCoreFields}
                  className={`${
                    hasMissingCoreFields
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : isIncomplete
                      ? "btn-secondary"
                      : "btn-primary"
                  } w-full py-2.5 px-4 text-center text-sm transition-all`}
                  title={hasMissingCoreFields ? `Core fields missing: ${missingCoreFields.join(", ")}` : ""}
                >
                  {isIncomplete ? "Generate Anyway (Quick)" : "Generate HireCard"}
                </button>
                {hasMissingCoreFields && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-red-600 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Core job description requirements missing: {missingCoreFields.join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
