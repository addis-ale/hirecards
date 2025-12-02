// Hero Component Types

export interface AnalysisResult {
  clarity: number;
  issues: string[];
  strengths: string[];
  suggestions: string[];
  missingFields: string[];
}

export interface ParsedData {
  roleTitle?: string;
  location?: string;
  workModel?: string;
  experienceLevel?: string;
  department?: string;
  skills?: string[];
  company?: string;
  minSalary?: string;
  maxSalary?: string;
  requirements?: string[];
  timeline?: string;
  isURL: boolean;
  confidence: number;
  rawInput: string;
}
