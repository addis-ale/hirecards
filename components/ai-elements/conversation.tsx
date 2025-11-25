"use client";

import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import React, { ReactNode, useEffect, useRef, useState, useCallback } from "react";

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
  const previousChildrenRef = useRef(children);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const childCountRef = useRef(0);

  // Robust scroll to bottom function
  const scrollToBottom = useCallback((smooth = false) => {
    if (contentRef.current && shouldAutoScroll && !isUserScrollingRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, [shouldAutoScroll]);

  // Scroll to bottom whenever children change (new messages)
  useEffect(() => {
    // Count the number of child elements
    const currentChildCount = React.Children.count(children);
    const childrenChanged = previousChildrenRef.current !== children || currentChildCount !== childCountRef.current;
    
    // Check if children actually changed
    if (childrenChanged) {
      previousChildrenRef.current = children;
      childCountRef.current = currentChildCount;
      
      // Immediate scroll
      scrollToBottom(false);
      
      // Use multiple RAF and timeouts to ensure scroll after content renders
      requestAnimationFrame(() => {
        scrollToBottom(false);
        
        requestAnimationFrame(() => {
          scrollToBottom(false);
          
          // Additional delayed scrolls for slow-rendering content
          setTimeout(() => scrollToBottom(false), 50);
          setTimeout(() => scrollToBottom(false), 100);
          setTimeout(() => scrollToBottom(false), 200);
          setTimeout(() => scrollToBottom(false), 300);
        });
      });
    }
  }, [children, shouldAutoScroll, scrollToBottom]);

  // Initial scroll to bottom on mount
  useEffect(() => {
    scrollToBottom(false);
    
    // Also scroll after a short delay in case content loads
    const timeout1 = setTimeout(() => scrollToBottom(false), 100);
    const timeout2 = setTimeout(() => scrollToBottom(false), 300);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollToBottom]);

  // Use MutationObserver to detect DOM changes (most reliable for chat messages)
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new MutationObserver(() => {
      // DOM content changed, scroll to bottom immediately
      if (shouldAutoScroll && !isUserScrollingRef.current) {
        // Multiple scroll attempts for reliability
        scrollToBottom(false);
        requestAnimationFrame(() => {
          scrollToBottom(false);
          setTimeout(() => scrollToBottom(false), 50);
          setTimeout(() => scrollToBottom(false), 150);
          setTimeout(() => scrollToBottom(false), 250);
        });
      }
    });

    observer.observe(contentRef.current, {
      childList: true,      // Watch for added/removed child nodes
      subtree: true,        // Watch all descendants
      characterData: true,  // Watch for text content changes
      attributes: false,    // Don't watch attributes to reduce noise
    });

    return () => {
      observer.disconnect();
    };
  }, [shouldAutoScroll, scrollToBottom]);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      
      // Detect if user is manually scrolling
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      isUserScrollingRef.current = true;
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
      
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
