import { Target, MapPin, Users, DollarSign } from "lucide-react";

interface BattleCardHeaderProps {
  roleTitle: string;
  department?: string;
  location?: string;
  experienceLevel?: string;
  minSalary?: string;
  maxSalary?: string;
}

export default function BattleCardHeader({
  roleTitle,
  department,
  location,
  experienceLevel,
  minSalary,
  maxSalary,
}: BattleCardHeaderProps) {
  const salaryRange =
    minSalary && maxSalary ? `${minSalary} - ${maxSalary}` : "Not specified";

  return (
    <div className="mb-8">
      {/* Role Title */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-[#278f8c]" />
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Target Role
          </span>
        </div>
        <h2
          className="text-3xl font-bold"
          style={{
            background: "linear-gradient(135deg, #278f8c 0%, #102a63 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {roleTitle}
        </h2>
      </div>

      {/* Meta Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {department && (
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-[#278f8c]/10 rounded flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-[#278f8c]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Department</p>
              <p className="text-sm font-semibold text-[#102a63]">{department}</p>
            </div>
          </div>
        )}

        {location && (
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-[#278f8c]/10 rounded flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-[#278f8c]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Location</p>
              <p className="text-sm font-semibold text-[#102a63]">{location}</p>
            </div>
          </div>
        )}

        {experienceLevel && (
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-[#278f8c]/10 rounded flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-[#278f8c]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Experience</p>
              <p className="text-sm font-semibold text-[#102a63]">{experienceLevel}</p>
            </div>
          </div>
        )}

        {(minSalary || maxSalary) && (
          <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-[#278f8c]/5 to-[#102a63]/5 rounded-lg border border-[#278f8c]/20">
            <div className="w-8 h-8 bg-[#278f8c]/10 rounded flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-[#278f8c]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Salary Range</p>
              <p className="text-sm font-bold text-[#278f8c]">{salaryRange}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
