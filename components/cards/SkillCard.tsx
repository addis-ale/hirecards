"use client";

import React from "react";
import { Code, CheckCircle2, Hammer, AlertTriangle, Brain, Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

interface SkillCardProps {
  coreSkills: string[];
  productSkills: string[];
  behavioralSkills: string[];
  insights?: string[];
  dataSource?: string;
}

export const SkillCard = ({
  coreSkills,
  productSkills,
  behavioralSkills,
  insights = [],
  dataSource
}: SkillCardProps) => {
  
  console.log("🎯 SkillCard received props:", { coreSkills, productSkills, behavioralSkills, insights, dataSource });
  
  if (!coreSkills || !productSkills || !behavioralSkills) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">No Dynamic Data Available</h3>
        <p className="text-sm text-red-700">LinkedIn data was not loaded.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <Section title="Skill Card" subtitle="The must-have abilities, tools, and experience needed to perform the role." Icon={Code} density="compact">
        <div className="space-y-4">
          {/* Core Technical Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Code className="w-4 h-4 text-blue-600" />
              <span>Core Technical Skills</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-blue-600">
              {coreSkills.map((skill, idx) => (
                <li key={idx} className="text-[13px] leading-snug" style={{ color: "#102a63" }}>
                  {skill}
                </li>
              ))}
            </ul>
            {dataSource && (
              <p className="text-xs text-gray-500 mt-2">
                {dataSource}
              </p>
            )}
          </div>

          {/* Dynamic Insights */}
          {insights.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                LinkedIn Analysis
              </h4>
              <ul className="space-y-1">
                {insights.map((insight, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Product Skills</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-purple-600">
              {productSkills.map((skill, idx) => (
                <li key={idx} className="text-[13px] leading-snug" style={{ color: "#102a63" }}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Behavioural Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Users className="w-4 h-4 text-green-600" />
              <span>Behavioural Skills</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-green-600">
              {behavioralSkills.map((skill, idx) => (
                <li key={idx} className="text-[13px] leading-snug" style={{ color: "#102a63" }}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="Brutal Truth">
            Most &quot;analytics engineers&quot; are BI developers. Find system designers.
          </Callout>

          {/* Red Flags */}
          <Section title="Red Flags" Icon={AlertTriangle} tone="danger">
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-red-600">
              {[
                "Dashboard-focused only",
                "No testing opinions",
                "Avoids documentation",
                "Dismisses governance"
              ].map((flag, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-red-700">
                  {flag}
                </li>
              ))}
            </ul>
          </Section>

          {/* Don&apos;t Do This */}
          <Section title="Don&apos;t Do This" Icon={Hammer} tone="danger">
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-red-600">
              {[
                "Hire without dbt experience",
                "Skip modelling exercises",
                "Confuse data/analytics engineers"
              ].map((dont, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-red-700">
                  {dont}
                </li>
              ))}
            </ul>
          </Section>

        </div>
      </Section>
    </div>
  );
};
