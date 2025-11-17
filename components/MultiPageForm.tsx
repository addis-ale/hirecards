"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Building2,
  FileText,
} from "lucide-react";
import CustomSelect from "./CustomSelect";
import CurrencyInput from "./CurrencyInput";

interface FormData {
  jobTitle: string;
  department: string;
  experienceLevel: string;
  location: string;
  workModel: string;
  minSalary: string;
  maxSalary: string;
  companySize: string;
  keyResponsibilities: string;
  requiredSkills: string;
  hiringTimeline: string;
  teamSize: string;
  reportingTo: string;
}

export default function MultiPageForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    department: "",
    experienceLevel: "",
    location: "",
    workModel: "",
    minSalary: "",
    maxSalary: "",
    companySize: "",
    keyResponsibilities: "",
    requiredSkills: "",
    hiringTimeline: "",
    teamSize: "",
    reportingTo: "",
  });

  const totalSteps = 3;

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
    setError(""); // Clear error when user types
  };

  const validateStep = (step: number): boolean => {
    setError("");

    if (step === 1) {
      if (!formData.jobTitle.trim()) {
        setError("Job Title is required");
        return false;
      }
      if (!formData.department) {
        setError("Department is required");
        return false;
      }
      if (!formData.experienceLevel) {
        setError("Experience Level is required");
        return false;
      }
      if (!formData.location.trim()) {
        setError("Location is required");
        return false;
      }
      if (!formData.workModel) {
        setError("Work Model is required");
        return false;
      }
      if (!formData.minSalary.trim() || !formData.maxSalary.trim()) {
        setError("Both minimum and maximum salary are required");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.companySize) {
        setError("Company Size is required");
        return false;
      }
    }

    if (step === 3) {
      if (!formData.keyResponsibilities.trim()) {
        setError("Key Responsibilities are required");
        return false;
      }
      if (!formData.requiredSkills.trim()) {
        setError("Required Skills are required");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Prevent Enter key from submitting form on steps 1-2
    if (e.key === "Enter" && currentStep !== 3) {
      const target = e.target as HTMLElement;
      // Allow Enter in textareas
      if (target.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleNext();
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only submit if we're on the final step (step 3)
    if (currentStep !== 3) {
      // On steps 1-2, just go to next step instead of submitting
      handleNext();
      return;
    }

    // Step 3: Validate and generate the cards
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === 3) {
      setIsSubmitting(true);
      setError("");

      try {
        // Combine minSalary and maxSalary into salaryRange for backend
        const submitData = {
          ...formData,
          salaryRange: `${formData.minSalary} - ${formData.maxSalary}`,
        };

        const response = await fetch("/api/generate-cards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        });

        const result = await response.json();

        if (result.success) {
          // Store cards in sessionStorage
          sessionStorage.setItem("battleCards", JSON.stringify(result.cards));
          sessionStorage.setItem("sessionId", result.sessionId);
          // Redirect to results page
          router.push("/results");
        } else {
          setError(result.error || "Failed to generate cards");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", icon: Briefcase },
    { number: 2, title: "Company Context", icon: Building2 },
    { number: 3, title: "Role Details", icon: FileText },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor:
                        isActive || isCompleted ? "rgb(16, 42, 99)" : "#e5e7eb",
                      color: isActive || isCompleted ? "white" : "#6b7280",
                      ...(isActive && {
                        boxShadow: "0 0 0 3px rgba(16, 42, 99, 0.1)",
                      }),
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="mt-1.5 text-center">
                    <div
                      className="text-sm font-semibold"
                      style={{
                        color:
                          isActive || isCompleted
                            ? "rgb(16, 42, 99)"
                            : "#6b7280",
                      }}
                    >
                      Step {step.number}
                    </div>
                    <div
                      className="text-xs mt-1 hidden sm:block"
                      style={{
                        color: isActive || isCompleted ? "#374151" : "#6b7280",
                      }}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="h-1 flex-1 mx-2 transition-all duration-300"
                    style={{
                      backgroundColor:
                        currentStep > step.number
                          ? "rgb(16, 42, 99)"
                          : "#e5e7eb",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="bg-white rounded-xl shadow-md p-5"
      >
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h3
                className="text-xl font-bold mb-1.5"
                style={{ color: "#102a63" }}
              >
                Basic Information
              </h3>
              <p className="text-gray-600">
                Tell us about the position you&apos;re hiring for
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Job Title *
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7F4F2] focus:border-transparent transition-all text-sm"
                  placeholder="e.g., Senior Product Manager"
                />
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Department *
                </label>
                <CustomSelect
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="Select department"
                  options={[
                    { value: "Engineering", label: "Engineering" },
                    { value: "Product", label: "Product" },
                    { value: "Design", label: "Design" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Sales", label: "Sales" },
                    { value: "Customer Success", label: "Customer Success" },
                    { value: "Operations", label: "Operations" },
                    { value: "Finance", label: "Finance" },
                    { value: "HR", label: "HR" },
                  ]}
                />
              </div>

              <div>
                <label
                  htmlFor="experienceLevel"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Experience Level *
                </label>
                <CustomSelect
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  required
                  placeholder="Select level"
                  options={[
                    { value: "Entry Level", label: "Entry Level" },
                    { value: "Mid-Level", label: "Mid-Level" },
                    { value: "Senior", label: "Senior" },
                    { value: "Executive", label: "Executive" },
                  ]}
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7F4F2] focus:border-transparent transition-all text-sm"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <label
                  htmlFor="workModel"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Work Model *
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
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salary Range *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <CurrencyInput
                      id="minSalary"
                      name="minSalary"
                      value={formData.minSalary}
                      onChange={handleChange}
                      required
                      placeholder="$120,000"
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7F4F2] focus:border-transparent transition-all text-sm"
                    />
                    <label
                      htmlFor="minSalary"
                      className="block text-xs text-gray-600 mt-1"
                    >
                      Min
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7F4F2] focus:border-transparent transition-all text-sm"
                    />
                    <label
                      htmlFor="maxSalary"
                      className="block text-xs text-gray-600 mt-1"
                    >
                      Max
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Company Context */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h3
                className="text-xl font-bold mb-1.5"
                style={{ color: "#102a63" }}
              >
                Company Context
              </h3>
              <p className="text-gray-600">
                Help us understand your organization and team structure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="companySize"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Company Size *
                </label>
                <CustomSelect
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  required
                  placeholder="Select size"
                  options={[
                    { value: "1-10", label: "1-10 employees" },
                    { value: "11-50", label: "11-50 employees" },
                    { value: "51-200", label: "51-200 employees" },
                    { value: "201-500", label: "201-500 employees" },
                    { value: "501-1000", label: "501-1000 employees" },
                    { value: "1000+", label: "1000+ employees" },
                  ]}
                />
              </div>

              <div>
                <label
                  htmlFor="teamSize"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Team Size
                </label>
                <input
                  type="text"
                  id="teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7F4F2] focus:border-transparent transition-all text-sm"
                  placeholder="e.g., 5 people"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="reportingTo"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Reports To
                </label>
                <input
                  type="text"
                  id="reportingTo"
                  name="reportingTo"
                  value={formData.reportingTo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7F4F2] focus:border-transparent transition-all text-sm"
                  placeholder="e.g., VP of Product"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Role Details */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h3
                className="text-xl font-bold mb-1.5"
                style={{ color: "#102a63" }}
              >
                Role Details
              </h3>
              <p className="text-gray-600">
                Define the key responsibilities and requirements for this
                position
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="keyResponsibilities"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Key Responsibilities *
                </label>
                <textarea
                  id="keyResponsibilities"
                  name="keyResponsibilities"
                  rows={4}
                  value={formData.keyResponsibilities}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7F4F2] focus:border-transparent transition-all text-sm"
                  placeholder="List the main responsibilities, separated by commas or new lines..."
                />
              </div>

              <div>
                <label
                  htmlFor="requiredSkills"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Required Skills *
                </label>
                <textarea
                  id="requiredSkills"
                  name="requiredSkills"
                  rows={3}
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7F4F2] focus:border-transparent transition-all text-sm"
                  placeholder="List required skills, separated by commas..."
                />
              </div>

              <div>
                <label
                  htmlFor="hiringTimeline"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Hiring Timeline
                </label>
                <CustomSelect
                  id="hiringTimeline"
                  name="hiringTimeline"
                  value={formData.hiringTimeline}
                  onChange={handleChange}
                  placeholder="Select timeline"
                  options={[
                    { value: "ASAP", label: "ASAP" },
                    { value: "1-2 weeks", label: "1-2 weeks" },
                    { value: "2-4 weeks", label: "2-4 weeks" },
                    { value: "1-2 months", label: "1-2 months" },
                    { value: "2-3 months", label: "2-3 months" },
                    { value: "3+ months", label: "3+ months" },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary flex items-center space-x-2 px-6 py-2 text-sm"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Generate Battle Card Deck</span>
                </>
              )}
            </button>
          )}
        </div>

        {currentStep === totalSteps && !isSubmitting && (
          <p className="text-sm text-gray-500 text-center mt-4">
            This will take approximately 10-15 seconds
          </p>
        )}
      </form>
    </div>
  );
}
