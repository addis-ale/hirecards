import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface CardSectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  warning?: boolean;
}

export default function CardSection({ icon: Icon, title, children, warning }: CardSectionProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            warning
              ? "bg-amber-100 text-amber-700"
              : "bg-gradient-to-br from-[#278f8c] to-[#1f7673] text-white"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <h3
          className="text-lg font-bold"
          style={{
            color: warning ? "#d97706" : "#102a63",
          }}
        >
          {title}
        </h3>
      </div>
      <div className="pl-10">{children}</div>
    </div>
  );
}
