import CurrencyInput from "../CurrencyInput";
import { FormData } from "@/hooks/useFormState";

interface Step3Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
}

export default function Step3Compensation({ formData, updateField }: Step3Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#102a63] mb-6">Compensation</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Transparent salary ranges attract better candidates 
          and reduce time wasted on mismatched expectations.
        </p>
      </div>

      {/* Minimum Salary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Salary <span className="text-red-500">*</span>
        </label>
        <CurrencyInput
          value={formData.minSalary}
          onChange={(value) => updateField("minSalary", value)}
          placeholder="e.g., $100,000"
        />
      </div>

      {/* Maximum Salary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Salary <span className="text-red-500">*</span>
        </label>
        <CurrencyInput
          value={formData.maxSalary}
          onChange={(value) => updateField("maxSalary", value)}
          placeholder="e.g., $150,000"
        />
      </div>

      {/* Salary Range Preview */}
      {formData.minSalary && formData.maxSalary && (
        <div className="mt-4 p-4 bg-[#d7f4f2] rounded-lg border border-[#278f8c]">
          <p className="text-sm font-medium text-[#102a63] mb-1">
            Salary Range Preview:
          </p>
          <p className="text-2xl font-bold text-[#278f8c]">
            {formData.minSalary} - {formData.maxSalary}
          </p>
        </div>
      )}
    </div>
  );
}
