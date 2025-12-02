import CustomSelect from "../CustomSelect";
import { FormData } from "@/hooks/useFormState";

interface Step1Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
}

export default function Step1BasicInfo({ formData, updateField }: Step1Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#102a63] mb-6">Basic Information</h2>

      {/* Role Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.roleTitle}
          onChange={(e) => updateField("roleTitle", e.target.value)}
          placeholder="e.g., Senior Product Manager"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Department <span className="text-red-500">*</span>
        </label>
        <CustomSelect
          value={formData.department}
          onChange={(value) => updateField("department", value)}
          options={[
            "Engineering",
            "Product",
            "Design",
            "Marketing",
            "Sales",
            "Operations",
            "Finance",
            "HR",
            "Other",
          ]}
          placeholder="Select department"
        />
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Level <span className="text-red-500">*</span>
        </label>
        <CustomSelect
          value={formData.experienceLevel}
          onChange={(value) => updateField("experienceLevel", value)}
          options={[
            "Entry Level (0-2 years)",
            "Mid Level (3-5 years)",
            "Senior (6-10 years)",
            "Lead/Staff (10+ years)",
            "Executive",
          ]}
          placeholder="Select experience level"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => updateField("location", e.target.value)}
          placeholder="e.g., San Francisco, CA or Remote"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent"
        />
      </div>

      {/* Work Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Work Model <span className="text-red-500">*</span>
        </label>
        <CustomSelect
          value={formData.workModel}
          onChange={(value) => updateField("workModel", value)}
          options={["Remote", "Hybrid", "On-site"]}
          placeholder="Select work model"
        />
      </div>
    </div>
  );
}
