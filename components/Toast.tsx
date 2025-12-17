"use client";

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "info" | "warning" | "error";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastToastRef = useRef<{ message: string; timestamp: number } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    // Prevent duplicate toasts within 500ms
    const now = Date.now();
    if (lastToastRef.current && 
        lastToastRef.current.message === message && 
        now - lastToastRef.current.timestamp < 500) {
      return; // Skip duplicate toast
    }
    
    lastToastRef.current = { message, timestamp: now };
    
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <div
                className={`
                  min-w-[320px] max-w-md rounded-lg shadow-lg border-2 p-4 flex items-start gap-3
                  ${
                    toast.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : toast.type === "info"
                      ? "bg-blue-50 border-blue-200 text-blue-900"
                      : toast.type === "warning"
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }
                `}
              >
                {toast.type === "success" && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`
                    flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors
                    ${
                      toast.type === "success"
                        ? "text-emerald-600"
                        : toast.type === "info"
                        ? "text-blue-600"
                        : toast.type === "warning"
                        ? "text-amber-600"
                        : "text-red-600"
                    }
                  `}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

