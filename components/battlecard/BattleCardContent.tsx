import { 
  Briefcase, Users, Target, DollarSign, TrendingUp, 
  AlertTriangle, Search, Clock, FileText 
} from "lucide-react";

interface Card {
  id: number;
  type: string;
  title: string;
  icon: string;
  content: any;
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  warning?: boolean;
}

function Section({ icon, title, children, warning }: SectionProps) {
  return (
    <div
      className="h-full rounded p-2 border shadow-sm flex flex-col"
      style={{
        backgroundColor: warning ? "#fef3c7" : "#ffffff",
        borderColor: warning ? "#f59e0b" : "#e0e7ed",
      }}
    >
      <div
        className="flex items-center space-x-1.5 mb-1.5 pb-1.5 border-b"
        style={{
          borderColor: warning ? "#fbbf24" : "#d7f4f2",
        }}
      >
        <div
          className="p-1 rounded shadow-sm"
          style={{
            backgroundColor: warning ? "#fbbf24" : "#278f8c",
            color: "white",
          }}
        >
          {icon}
        </div>
        <h3
          className="text-xs font-bold uppercase"
          style={{
            color: warning ? "#92400e" : "#102a63",
          }}
        >
          {title}
        </h3>
      </div>
      <div className="space-y-1.5 flex-1 text-xs">{children}</div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function InfoRow({ label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center text-xs py-1 px-1.5 rounded bg-gray-50">
      <span className="text-gray-700 font-semibold">{label}</span>
      <span
        className={`font-bold ${
          highlight
            ? "px-1.5 py-0.5 rounded text-white text-xs"
            : "text-gray-900"
        }`}
        style={highlight ? { backgroundColor: "#f59e0b" } : {}}
      >
        {value}
      </span>
    </div>
  );
}

interface BattleCardContentProps {
  cards: Card[];
}

export default function BattleCardContent({ cards }: BattleCardContentProps) {
  const roleCard = cards.find((c) => c.type === "Role Definition");
  const compensationCard = cards.find((c) => c.type === "Compensation");
  const marketCard = cards.find((c) => c.type === "Market Intelligence");
  const requirementsCard = cards.find((c) => c.type === "Requirements");
  const responsibilitiesCard = cards.find((c) => c.type === "Responsibilities");
  const cultureCard = cards.find((c) => c.type === "Culture Fit");
  const messagingCard = cards.find((c) => c.type === "Messaging");
  const realityCard = cards.find((c) => c.type === "Reality Check");

  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {/* Role Overview */}
      <div className="col-span-2">
        <Section
          icon={<Briefcase className="w-3 h-3" />}
          title="Role Overview"
        >
          <InfoRow
            label="Title"
            value={roleCard?.content?.jobTitle || "N/A"}
          />
          <InfoRow
            label="Department"
            value={roleCard?.content?.department || "N/A"}
          />
          <InfoRow
            label="Level"
            value={roleCard?.content?.experienceLevel || "N/A"}
          />
          <InfoRow
            label="Location"
            value={roleCard?.content?.location || "N/A"}
          />
          <InfoRow
            label="Work Model"
            value={roleCard?.content?.workModel || "N/A"}
          />
        </Section>
      </div>

      {/* Compensation */}
      <Section
        icon={<DollarSign className="w-3 h-3" />}
        title="Compensation"
      >
        <InfoRow
          label="Salary Range"
          value={compensationCard?.content?.salaryRange || "N/A"}
          highlight
        />
        <div className="pt-1.5 border-t border-gray-200 mt-1.5">
          <p className="text-xs text-gray-600 leading-tight">
            {compensationCard?.content?.strategy ||
              "Competitive market rate"}
          </p>
        </div>
      </Section>

      {/* Market Intelligence */}
      <Section icon={<TrendingUp className="w-3 h-3" />} title="Market Intel">
        <div className="space-y-1">
          {marketCard?.content?.keyInsights?.slice(0, 3).map((insight: string, idx: number) => (
            <div
              key={idx}
              className="text-xs bg-blue-50 p-1.5 rounded border border-blue-200"
            >
              <p className="text-gray-700 leading-tight">{insight}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Requirements */}
      <Section icon={<Target className="w-3 h-3" />} title="Requirements">
        <div className="space-y-1">
          {requirementsCard?.content?.required
            ?.split(",")
            .slice(0, 5)
            .map((req: string, idx: number) => (
              <div key={idx} className="flex items-start gap-1">
                <span className="w-1 h-1 bg-[#278f8c] rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-gray-700 leading-tight">
                  {req.trim()}
                </span>
              </div>
            ))}
        </div>
      </Section>

      {/* Responsibilities */}
      <Section icon={<FileText className="w-3 h-3" />} title="Key Duties">
        <div className="space-y-1">
          {responsibilitiesCard?.content?.keyResponsibilities
            ?.slice(0, 4)
            .map((resp: string, idx: number) => (
              <div key={idx} className="flex items-start gap-1">
                <span className="w-1 h-1 bg-[#278f8c] rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-gray-700 leading-tight">{resp}</span>
              </div>
            ))}
        </div>
      </Section>

      {/* Culture Fit */}
      {cultureCard && (
        <div className="col-span-2">
          <Section icon={<Users className="w-3 h-3" />} title="Culture Fit">
            <p className="text-xs text-gray-700 leading-tight">
              {cultureCard.content?.cultureFit ||
                cultureCard.content?.description}
            </p>
          </Section>
        </div>
      )}

      {/* Reality Check */}
      {realityCard && (
        <div className="col-span-2">
          <Section
            icon={<AlertTriangle className="w-3 h-3" />}
            title="Reality Check"
            warning
          >
            <div className="space-y-1.5">
              {realityCard.content?.challenges?.map((challenge: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-amber-50 p-1.5 rounded border border-amber-200"
                >
                  <p className="text-amber-900 text-xs leading-tight">
                    {challenge}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Messaging */}
      {messagingCard && (
        <div className="col-span-2">
          <Section icon={<Search className="w-3 h-3" />} title="Messaging">
            <div className="space-y-1.5">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-0.5">
                  Elevator Pitch:
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                  {messagingCard.content?.elevatorPitch}
                </p>
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
