"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { ReactNode } from "react";

interface MessageProps {
  from: "user" | "assistant";
  children: ReactNode;
  className?: string;
}

export function Message({ from, children, className }: MessageProps) {
  const isUser = from === "user";

  return (
    <div
      className={cn(
        "flex gap-3 items-start",
        isUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-[#102a63] text-white"
            : "bg-[#d7f4f2] text-[#278f8c]"
        )}
      >
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      {/* Message Content Container */}
      <div className={cn("flex-1 max-w-[80%]", isUser ? "flex justify-end" : "")}>
        {children}
      </div>
    </div>
  );
}

interface MessageContentProps {
  children: ReactNode;
  className?: string;
  isUser?: boolean;
}

export function MessageContent({ children, className, isUser }: MessageContentProps) {
  return (
    <div
      className={cn(
        "rounded-2xl px-4 py-3 text-sm leading-relaxed text-left",
        isUser
          ? "bg-[#278f8c] text-white"
          : "bg-gray-100 text-gray-800",
        className
      )}
    >
      {children}
    </div>
  );
}
