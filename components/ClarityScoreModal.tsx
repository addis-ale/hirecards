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

            {/* Missing Fields */}
            {isIncomplete && (
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
              <button
                onClick={onGenerateAnyway}
                className={`${
                  isIncomplete
                    ? "btn-secondary flex-1"
                    : "btn-primary w-full"
                } py-2.5 px-4 text-center text-sm`}
              >
                {isIncomplete ? "Generate Anyway (Quick)" : "Generate HireCard"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
