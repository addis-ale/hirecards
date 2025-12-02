// Chat Types - Extracted from ConversationalChatbot

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ExtractedData {
  roleTitle?: string;
  department?: string;
  experienceLevel?: string;
  location?: string;
  workModel?: string;
  criticalSkills?: string[];
  minSalary?: string;
  maxSalary?: string;
  nonNegotiables?: string;
  flexible?: string;
  timeline?: string;
  company?: string;
}

export interface FieldRequirement {
  field: keyof ExtractedData;
  label: string;
  required: boolean;
  icon: any; // Lucide icon type
}

export interface CardGenerationStep {
  message: string;
  icon: any;
}
