import { Bot } from "lucide-react";

interface ChatHeaderProps {
  completeness: number;
}

export default function ChatHeader({ completeness }: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#278f8c] to-[#20706e] text-white px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Hiring Assistant</h3>
            <p className="text-sm text-white/80">Powered by ChatGPT</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs text-white/80 mb-1">Progress</div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-sm font-semibold">{completeness}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
