"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
import Step1BasicInfo from "./form/Step1BasicInfo";
import Step2Requirements from "./form/Step2Requirements";
import Step3Compensation from "./form/Step3Compensation";
import Step4Timeline from "./form/Step4Timeline";
import JobURLInput from "./JobURLInput";

export default function MultiPageForm() {
  const router = useRouter();
  const {
    formData,
    currentStep,
    updateField,
    updateMultipleFields,
    nextStep,
    prevStep,
    isStepComplete,
  } = useFormState();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showURLInput, setShowURLInput] = useState(true);

  const totalSteps = 4;

  // Load scraped data from sessionStorage on mount
  useEffect(() => {
    const sessionData = sessionStorage.getItem("formData");
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        updateMultipleFields(parsed);
        setShowURLInput(false);
      } catch (err) {
        console.error("Failed to load session data:", err);
      }
    }
  }, [updateMultipleFields]);

  const handleURLDataExtracted = (data: any) => {
    updateMultipleFields(data);
    setShowURLInput(false);
    sessionStorage.setItem("formData", JSON.stringify(data));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Save to sessionStorage
      sessionStorage.setItem("formData", JSON.stringify(formData));

      // Map to API format
      const apiFormData = {
        jobTitle: formData.roleTitle,
        department: formData.department,
        experienceLevel: formData.experienceLevel,
        location: formData.location,
        workModel: formData.workModel,
        salaryRange: `${formData.minSalary} - ${formData.maxSalary}`,
        requiredSkills: formData.criticalSkills.join(", "),
        keyResponsibilities: formData.nonNegotiables,
        hiringTimeline: formData.timeline,
        companySize: "Not specified",
      };

      const response = await fetch("/api/generate-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFormData),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem("battleCards", JSON.stringify(result.cards));
        sessionStorage.setItem("sessionId", result.sessionId);
        router.push("/results");
      } else {
        setError(result.error || "Failed to generate cards");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = isStepComplete(currentStep);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-[#278f8c]">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#278f8c] to-[#1f7673] transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step < currentStep
                  ? "bg-[#278f8c] text-white"
                  : step === currentStep
                  ? "bg-[#278f8c] text-white ring-4 ring-[#278f8c]/20"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div
                className={`w-12 h-1 mx-2 ${
                  step < currentStep ? "bg-[#278f8c]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* URL Input */}
      {showURLInput && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-[#102a63] mb-2">
            Quick Start: Paste a Job URL
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Have a job posting URL? We will extract the details automatically.
          </p>
          <JobURLInput onDataExtracted={handleURLDataExtracted} />
          <button
            onClick={() => setShowURLInput(false)}
            className="mt-3 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Skip and fill manually
          </button>
        </div>
      )}

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {currentStep === 1 && (
          <Step1BasicInfo formData={formData} updateField={updateField} />
        )}
        {currentStep === 2 && (
          <Step2Requirements formData={formData} updateField={updateField} />
        )}
        {currentStep === 3 && (
          <Step3Compensation formData={formData} updateField={updateField} />
        )}
        {currentStep === 4 && (
          <Step4Timeline formData={formData} updateField={updateField} />
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!canProceed}
              className="px-6 py-3 bg-[#278f8c] text-white rounded-lg font-medium hover:bg-[#1f7673] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="px-6 py-3 bg-[#278f8c] text-white rounded-lg font-medium hover:bg-[#1f7673] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Cards...
                </>
              ) : (
                "Generate HireCards"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
