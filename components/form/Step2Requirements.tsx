import MultiSkillInput from "../MultiSkillInput";
import { FormData } from "@/hooks/useFormState";

interface Step2Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
}

export default function Step2Requirements({ formData, updateField }: Step2Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#102a63] mb-6">Requirements</h2>

      {/* Critical Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Critical Skills <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Add the must-have skills for this role (press Enter after each skill)
        </p>
        <MultiSkillInput
          skills={formData.criticalSkills}
          onChange={(skills) => updateField("criticalSkills", skills)}
          placeholder="e.g., JavaScript, React, Node.js"
        />
      </div>

      {/* Non-Negotiables */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Non-Negotiables
        </label>
        <p className="text-sm text-gray-500 mb-3">
          What are the absolute must-haves that candidates need?
        </p>
        <textarea
          value={formData.nonNegotiables}
          onChange={(e) => updateField("nonNegotiables", e.target.value)}
          placeholder="e.g., 5+ years of experience, Bachelor's degree in CS, etc."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent resize-none"
        />
      </div>

      {/* Nice-to-Haves */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nice-to-Haves
        </label>
        <p className="text-sm text-gray-500 mb-3">
          What additional skills or experience would be beneficial?
        </p>
        <textarea
          value={formData.flexible}
          onChange={(e) => updateField("flexible", e.target.value)}
          placeholder="e.g., Experience with AWS, startup experience, etc."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
