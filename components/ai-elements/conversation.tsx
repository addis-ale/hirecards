"use client";

import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ConversationProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Conversation({ children, className, style }: ConversationProps) {
  return (
    <div className={cn("flex flex-col h-full relative", className)} style={style}>
      {children}
    </div>
  );
}

interface ConversationContentProps {
  children: ReactNode;
  className?: string;
}

export function ConversationContent({ children, className }: ConversationContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Scroll to bottom on mount and when children change
  useEffect(() => {
    if (shouldAutoScroll && contentRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [children, shouldAutoScroll]);

  // Initial scroll to bottom on mount
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  return (
    <div
      ref={contentRef}
      onScroll={handleScroll}
      className={cn(
        "flex-1 overflow-y-auto px-4 py-6 space-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ConversationEmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function ConversationEmptyState({
  title,
  description,
  icon,
}: ConversationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-sm">{description}</p>
    </div>
  );
}

export function ConversationScrollButton() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Find the parent ConversationContent
    const findParent = () => {
      let element = document.querySelector('[data-conversation-content]');
      if (element) {
        parentRef.current = element as HTMLDivElement;
      }
    };

    findParent();

    const handleScroll = () => {
      if (parentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
        const isNearBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 200;
        setShowScrollButton(!isNearBottom && scrollTop > 100);
      }
    };

    if (parentRef.current) {
      parentRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (parentRef.current) {
        parentRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (parentRef.current) {
      parentRef.current.scrollTo({
        top: parentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  if (!showScrollButton) return null;

  return (
    <button
      onClick={scrollToBottom}
      className="absolute bottom-4 right-4 p-2 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-all z-10"
      aria-label="Scroll to bottom"
    >
      <ArrowDown className="w-5 h-5 text-gray-600" />
    </button>
  );
}
