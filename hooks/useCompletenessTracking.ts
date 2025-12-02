import { useState, useEffect, useCallback } from "react";
import { ExtractedData } from "@/types/chat";

const TOTAL_FIELDS = 10;

export function useCompletenessTracking(extractedData: ExtractedData) {
  const [completeness, setCompleteness] = useState(0);

  const countFilledFields = useCallback((data: ExtractedData): number => {
    let count = 0;
    
    if (data.roleTitle) count++;
    if (data.department) count++;
    if (data.experienceLevel) count++;
    if (data.location) count++;
    if (data.workModel) count++;
    if (data.criticalSkills && data.criticalSkills.length > 0) count++;
    if (data.nonNegotiables) count++;
    if (data.flexible) count++;
    if (data.timeline) count++;
    
    // Salary range as ONE field (both min and max needed)
    if (data.minSalary && data.maxSalary) count++;
    
    console.log("📊 Field count calculation:", {
      roleTitle: !!data.roleTitle,
      department: !!data.department,
      experienceLevel: !!data.experienceLevel,
      location: !!data.location,
      workModel: !!data.workModel,
      criticalSkills: !!(data.criticalSkills && data.criticalSkills.length > 0),
      nonNegotiables: !!data.nonNegotiables,
      flexible: !!data.flexible,
      timeline: !!data.timeline,
      salary: !!(data.minSalary && data.maxSalary),
      totalCount: count
    });
    
    return count;
  }, []);

  useEffect(() => {
    const filledCount = countFilledFields(extractedData);
    setCompleteness(Math.round((filledCount / TOTAL_FIELDS) * 100));
  }, [extractedData, countFilledFields]);

  return {
    completeness,
    filledFieldsCount: countFilledFields(extractedData),
    totalFields: TOTAL_FIELDS,
    countFilledFields,
  };
}
