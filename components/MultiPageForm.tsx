"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import CustomSelect from "./CustomSelect";
import CurrencyInput from "./CurrencyInput";

interface FormData {
  roleTitle: string;
  experienceLevel: string;
  location: string;
  workModel: string;
  criticalSkill: string;
  minSalary: string;
  maxSalary: string;
  whyHiringNow: string;
  nonNegotiables: string;
  flexible: string;
  timeline: string;
}

export default function MultiPageForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [preFilledFields, setPreFilledFields] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    roleTitle: "",
    experienceLevel: "",
    location: "",
    workModel: "",
    criticalSkill: "",
    minSalary: "",
    maxSalary: "",
    whyHiringNow: "",
    nonNegotiables: "",
    flexible: "",
    timeline: "",
  });

  const totalSteps = 4;

  // Load scraped data from sessionStorage on mount
  useEffect(() => {
    const incompleteData = sessionStorage.getItem("incompleteData");
    if (incompleteData) {
      try {
        const data = JSON.parse(incompleteData);
        const extracted = data.extractedFields || {};
        
        // Map scraped fields to form fields
        const mappedData: Partial<FormData> = {};
        const filledFields: string[] = [];
        
        if (extracted.roleTitle) {
          mappedData.roleTitle = extracted.roleTitle;
          filledFields.push('roleTitle');
        }
        if (extracted.location) {
          mappedData.location = extracted.location;
          filledFields.push('location');
        }
        if (extracted.experienceLevel) {
          mappedData.experienceLevel = extracted.experienceLevel;
          filledFields.push('experienceLevel');
        }
        if (extracted.workModel) {
          // Map scraped work model to form values
          const workModelMap: { [key: string]: string } = {
            "Fully Remote": "Remote",
            "Remote": "Remote",
            "Hybrid": "Hybrid",
            "On-site": "On-site",
            "Flexible": "Flexible",
          };
          mappedData.workModel = workModelMap[extracted.workModel] || extracted.workModel;
          filledFields.push('workModel');
        }
        if (extracted.criticalSkills) {
          mappedData.criticalSkill = extracted.criticalSkills;
          filledFields.push('criticalSkill');
        }
        if (extracted.whyHiring) {
          mappedData.whyHiringNow = extracted.whyHiring;
          filledFields.push('whyHiringNow');
        }
        if (extracted.nonNegotiables) {
          mappedData.nonNegotiables = extracted.nonNegotiables;
          filledFields.push('nonNegotiables');
        }
        if (extracted.flexible) {
          mappedData.flexible = extracted.flexible;
          filledFields.push('flexible');
        }
        if (extracted.timeline) {
          mappedData.timeline = extracted.timeline;
          filledFields.push('timeline');
        }
        
        // Handle salary field - extract min and max
        if (extracted.salary) {
          const salaryMatch = extracted.salary.match(/\$?([\d,]+)K?\s*-\s*\$?([\d,]+)K?/);
          if (salaryMatch) {
            mappedData.minSalary = salaryMatch[1].replace(/,/g, '');
            mappedData.maxSalary = salaryMatch[2].replace(/,/g, '');
            filledFields.push('minSalary');
            filledFields.push('maxSalary');
          }
        }
        
        // Update form with mapped data
        setFormData(prevData => ({
          ...prevData,
          ...mappedData,
        }));
        
        setPreFilledFields(filledFields);
        
      } catch (err) {
        console.error("Failed to parse scraped data:", err);
      }
    }
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } }
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateStep = (step: number): boolean => {
    setError("");

    switch (step) {
      case 1:
        if (!formData.roleTitle.trim()) {
          setError("Role title is required");
          return false;
        }
        if (!formData.experienceLevel) {
          setError("Experience level is required");
          return false;
        }
        if (!formData.location.trim()) {
          setError("Location is required");
          return false;
        }
        if (!formData.workModel) {
          setError("Work model is required");
          return false;
        }
        break;

      case 2:
        if (!formData.criticalSkill.trim()) {
          setError("Critical skill is required");
          return false;
        }
        if (!formData.minSalary.trim() || !formData.maxSalary.trim()) {
          setError("Budget/salary range is required");
          return false;
        }
        break;

      case 3:
        if (!formData.whyHiringNow.trim()) {
          setError("Please explain why you're hiring now");
          return false;
        }
        if (!formData.nonNegotiables.trim()) {
          setError("Non-negotiables are required");
          return false;
        }
        break;

      case 4:
        if (!formData.timeline) {
          setError("Desired timeline is required");
          return false;
        }
        break;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        salaryRange: `${formData.minSalary} - ${formData.maxSalary}`,
      };

      // Store form data in sessionStorage
      sessionStorage.setItem("formData", JSON.stringify(submitData));

      // Try to call API, but don't wait for it or show errors
      fetch("/api/generate-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            sessionStorage.setItem("battleCards", JSON.stringify(result.cards));
            sessionStorage.setItem("sessionId", result.sessionId);
          }
        })
        .catch(() => {
          // Silently fail - user is already redirected
        });

      // Always redirect to results after a short delay
      setTimeout(() => {
        router.push("/results");
      }, 1500);
    } catch (err) {
      // Even if something goes wrong, redirect to results
      setTimeout(() => {
        router.push("/results");
      }, 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step < currentStep
                    ? "bg-green-500 text-white"
                    : step === currentStep
                    ? "bg-[#278f8c] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              <span className="text-xs mt-2 font-medium" style={{ color: "#102a63" }}>
                {step === 1 && "Basics"}
                {step === 2 && "Requirements"}
                {step === 3 && "Details"}
                {step === 4 && "Timeline"}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-1 mx-2 transition-all ${
                  step < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
      >
        {renderStepIndicator()}
        
        <div className="space-y-6">
          {/* Step 1: Basics */}
          {currentStep === 1 && (
            <>
              {/* Role Title & Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="roleTitle"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#102a63" }}
              >
                Role Title *
                {preFilledFields.includes('roleTitle') && (
                  <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    ✓ Pre-filled
                  </span>
                )}
              </label>
              <input
                type="text"
                id="roleTitle"
                name="roleTitle"
                value={formData.roleTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent transition-all"
                placeholder="e.g., Senior Backend Engineer"
              />
            </div>

            <div>
              <label
                htmlFor="experienceLevel"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#102a63" }}
              >
                Experience Level *
                {preFilledFields.includes('experienceLevel') && (
                  <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    ✓ Pre-filled
                  </span>
                )}
              </label>
              <CustomSelect
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
                placeholder="Select level"
                options={[
                  { value: "Junior", label: "Junior" },
                  { value: "Mid-Level", label: "Mid-Level" },
                  { value: "Senior", label: "Senior" },
                  { value: "Lead/Staff", label: "Lead/Staff" },
                  {
                    value: "Principal/Architect",
                    label: "Principal/Architect",
                  },
                  { value: "Executive", label: "Executive" },
                ]}
              />
            </div>
          </div>

          {/* Location & Work Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#102a63" }}
              >
                Location *
                {preFilledFields.includes('location') && (
                  <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    ✓ Pre-filled
                  </span>
                )}
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent transition-all"
                placeholder="e.g., Amsterdam, Netherlands"
              />
            </div>

            <div>
              <label
                htmlFor="workModel"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#102a63" }}
              >
                Work Model *
                {preFilledFields.includes('workModel') && (
                  <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    ✓ Pre-filled
                  </span>
                )}
              </label>
              <CustomSelect
                id="workModel"
                name="workModel"
                value={formData.workModel}
                onChange={handleChange}
                required
                placeholder="Select work model"
                options={[
                  { value: "Remote", label: "Remote" },
                  { value: "Hybrid", label: "Hybrid" },
                  { value: "On-site", label: "On-site" },
                  { value: "Flexible", label: "Flexible" },
                ]}
              />
            </div>
          </div>
            </>
          )}

          {/* Step 2: Requirements */}
          {currentStep === 2 && (
            <>
              {/* Critical Skill */}
              <div>
            <label
              htmlFor="criticalSkill"
              className="block text-sm font-semibold mb-2"
              style={{ color: "#102a63" }}
            >
              Critical Skill *
              {preFilledFields.includes('criticalSkill') && (
                <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  ✓ Pre-filled
                </span>
              )}
            </label>
            <input
              type="text"
              id="criticalSkill"
              name="criticalSkill"
              value={formData.criticalSkill}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent transition-all"
              placeholder="e.g., Python/Django, Microservices Architecture"
            />
            <p className="text-xs text-gray-500 mt-1">
              The most important technical or domain skill for this role
            </p>
          </div>

          {/* Budget/Salary Range */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#102a63" }}
            >
              Budget or Salary Range *
              {(preFilledFields.includes('minSalary') || preFilledFields.includes('maxSalary')) && (
                <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  ✓ Pre-filled
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <CurrencyInput
                  id="minSalary"
                  name="minSalary"
                  value={formData.minSalary}
                  onChange={handleChange}
                  required
                  placeholder="$120,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent transition-all"
                />
                <label
                  htmlFor="minSalary"
                  className="block text-xs text-gray-600 mt-1"
                >
                  Minimum
                </label>
              </div>
              <div>
                <CurrencyInput
                  id="maxSalary"
                  name="maxSalary"
                  value={formData.maxSalary}
                  onChange={handleChange}
                  required
                  placeholder="$160,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent transition-all"
                />
                <label
                  htmlFor="maxSalary"
                  className="block text-xs text-gray-600 mt-1"
                >
                  Maximum
                </label>
              </div>
            </div>
          </div>
            </>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <>
              {/* Why Hiring Now */}
              <div>
            <label
              htmlFor="whyHiringNow"
              className="block text-sm font-semibold mb-2"
              style={{ color: "#102a63" }}
            >
              Why Hiring Now? *
              {preFilledFields.includes('whyHiringNow') && (
                <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  ✓ Pre-filled
                </span>
              )}
            </label>
            <textarea
              id="whyHiringNow"
              name="whyHiringNow"
              rows={3}
              value={formData.whyHiringNow}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent transition-all"
              placeholder="e.g., Scaling the team for Q2 product launch, replacing a departing team member, new project starting..."
            />
          </div>

          {/* Non-Negotiables */}
          <div>
            <label
              htmlFor="nonNegotiables"
              className="block text-sm font-semibold mb-2"
              style={{ color: "#102a63" }}
            >
              Non-Negotiables *
              {preFilledFields.includes('nonNegotiables') && (
                <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  ✓ Pre-filled
                </span>
              )}
            </label>
            <textarea
              id="nonNegotiables"
              name="nonNegotiables"
              rows={3}
              value={formData.nonNegotiables}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent transition-all"
              placeholder="e.g., 5+ years Python experience, Must have led teams before, Strong system design skills..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Must-have requirements that cannot be compromised
            </p>
          </div>

          {/* What Could Be Flexible */}
          <div>
            <label
              htmlFor="flexible"
              className="block text-sm font-semibold mb-2"
              style={{ color: "#102a63" }}
            >
              What Could Be Flexible?
              {preFilledFields.includes('flexible') && (
                <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  ✓ Pre-filled
                </span>
              )}
            </label>
            <textarea
              id="flexible"
              name="flexible"
              rows={3}
              value={formData.flexible}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent transition-all"
              placeholder="e.g., Years of experience if strong skills, Specific tech stack knowledge, Industry background..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Nice-to-haves or areas where you&apos;re willing to compromise
            </p>
          </div>
            </>
          )}

          {/* Step 4: Timeline */}
          {currentStep === 4 && (
            <>
              {/* Desired Timeline */}
              <div>
            <label
              htmlFor="timeline"
              className="block text-sm font-semibold mb-2"
              style={{ color: "#102a63" }}
            >
              Desired Timeline *
              {preFilledFields.includes('timeline') && (
                <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  ✓ Pre-filled
                </span>
              )}
            </label>
            <CustomSelect
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              required
              placeholder="Select timeline"
              options={[
                { value: "ASAP (1-2 weeks)", label: "ASAP (1-2 weeks)" },
                { value: "2-4 weeks", label: "2-4 weeks" },
                { value: "1-2 months", label: "1-2 months" },
                { value: "2-3 months", label: "2-3 months" },
                { value: "3-6 months", label: "3-6 months" },
                { value: "6+ months", label: "6+ months" },
              ]}
            />
          </div>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                ← Previous
              </button>
            )}
            
            <div className="flex-1" />
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary px-8 py-3 flex items-center justify-center space-x-2"
              >
                <span>Next</span>
                <span>→</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Strategy</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          {isSubmitting && (
            <p className="text-sm text-gray-500 text-center mt-3">
              This will take approximately 10-15 seconds
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
