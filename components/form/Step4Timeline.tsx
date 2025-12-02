import CustomSelect from "../CustomSelect";
import { FormData } from "@/hooks/useFormState";

interface Step4Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
}

export default function Step4Timeline({ formData, updateField }: Step4Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#102a63] mb-6">Timeline</h2>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-800">
          ⏰ <strong>Important:</strong> Setting realistic timelines helps manage 
          expectations and ensures a smoother hiring process.
        </p>
      </div>

      {/* Hiring Timeline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When do you need this person to start? <span className="text-red-500">*</span>
        </label>
        <CustomSelect
          value={formData.timeline}
          onChange={(value) => updateField("timeline", value)}
          options={[
            "Immediately (1-2 weeks)",
            "Soon (2-4 weeks)",
            "Normal (1-2 months)",
            "Flexible (2-3 months)",
            "Long-term (3+ months)",
          ]}
          placeholder="Select hiring timeline"
        />
      </div>

      {/* Additional Context */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Context (Optional)
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Any other important details about this role?
        </p>
        <textarea
          placeholder="e.g., Replacement for departing employee, new position for growth, etc."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
