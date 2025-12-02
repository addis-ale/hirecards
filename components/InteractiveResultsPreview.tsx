"use client";

import { motion } from "framer-motion";
import { LandingPreviewTabs } from "./LandingPreviewTabs";
import { 
  CheckCircle2, 
  ArrowRight, 
  Play
} from "lucide-react";
import { useChatbot } from "./ChatbotProvider";

export default function InteractiveResultsPreview() {
  const { openChatbot } = useChatbot();
  
  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-b from-[#d7f4f2] via-white to-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#278f8c] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#102a63] rounded-full mix-blend-multiply filter blur-[96px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#278f8c]/20 shadow-sm mb-6"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#278f8c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#278f8c]"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-[#102a63] uppercase">
              Interactive Preview
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#102a63] mb-4"
          >
            Stop guessing. <br className="hidden md:block" />
            Start <span className="text-[#278f8c]">hiring with precision.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            See a live example below, a clear, data-driven view of your best hiring options, including cost, timing, and risk tradeoffs.
          </motion.p>
        </div>

        {/* Interactive Preview Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Demo Indicator Badge */}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-[#102a63] text-white text-xs font-bold px-4 py-1.5 rounded-t-lg shadow-lg flex items-center gap-2">
              <Play size={10} className="fill-current" />
              LIVE PREVIEW MODE
            </div>
          </div>

          {/* Main Card Container */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-[#102a63]/10 border border-slate-200/60 overflow-hidden min-h-[600px] md:min-h-[700px] flex flex-col">
            {/* App Chrome (Browser Header Simulation) */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>
              <div className="ml-4 px-3 py-1 bg-white rounded text-[10px] text-slate-400 font-mono border border-slate-200 flex-1 max-w-xs">
                app.hirecard.com/analysis/preview
              </div>
            </div>

            {/* Content Area - Your Child Component Goes Here */}
            <div className="flex-1 p-4 md:p-6">
              <LandingPreviewTabs />
            </div>
          </div>

          {/* Decorative visual depth below card */}
          <div className="absolute -bottom-4 left-4 right-4 h-full bg-[#102a63] opacity-5 rounded-2xl -z-10 transform scale-[0.98] translate-y-2"></div>
          <div className="absolute -bottom-8 left-8 right-8 h-full bg-[#278f8c] opacity-5 rounded-2xl -z-20 transform scale-[0.96] translate-y-4"></div>
        </motion.div>

        {/* Footer CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={() => openChatbot()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary group inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
          >
            <span>Create Your HireCard Now</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

      </div>
    </section>
  );
}
