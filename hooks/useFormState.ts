import { useState, useCallback } from "react";

export interface FormData {
  roleTitle: string;
  department: string;
  experienceLevel: string;
  location: string;
  workModel: string;
  criticalSkills: string[];
  minSalary: string;
  maxSalary: string;
  nonNegotiables: string;
  flexible: string;
  timeline: string;
}

const initialFormData: FormData = {
  roleTitle: "",
  department: "",
  experienceLevel: "",
  location: "",
  workModel: "",
  criticalSkills: [],
  minSalary: "",
  maxSalary: "",
  nonNegotiables: "",
  flexible: "",
  timeline: "",
};

export function useFormState() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);

  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasInteracted(true);
  }, []);

  const updateMultipleFields = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
    setHasInteracted(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setHasInteracted(false);
  }, []);

  const isStepComplete = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return !!(
            formData.roleTitle &&
            formData.department &&
            formData.experienceLevel &&
            formData.location &&
            formData.workModel
          );
        case 2:
          return !!(formData.criticalSkills && formData.criticalSkills.length > 0);
        case 3:
          return !!(formData.minSalary && formData.maxSalary);
        case 4:
          return !!(formData.timeline);
        default:
          return false;
      }
    },
    [formData]
  );

  return {
    formData,
    setFormData,
    currentStep,
    hasInteracted,
    updateField,
    updateMultipleFields,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    isStepComplete,
  };
}
