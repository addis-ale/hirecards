"use client";

import React from "react";
import { Code, CheckCircle2, Hammer, AlertTriangle, Brain, Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const SkillCard = () => {
  return (
    <div className="space-y-6">
      <Section title="Skill Card" subtitle="Technical, product, and behavioural skills" Icon={Code} density="compact">
        <div className="space-y-4">
          {/* Core Technical Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Code className="w-4 h-4 text-blue-600" />
              <span>Core Technical Skills</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-blue-600">
              {[
                "Advanced SQL",
                "dbt modelling",
                "Dimensional modelling",
                "BI tools",
                "Pipeline building"
              ].map((skill, idx) => (
                <li key={idx} className="text-[13px] leading-snug" style={{ color: "#102a63" }}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Product Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Product Skills</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-purple-600">
              {[
                "Define clear metrics",
                "Shape analytics UX",
                "Model business logic"
              ].map((skill, idx) => (
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
              {[
                "Ownership mindset",
                "Handles ambiguity",
                "Clear communication",
                "Quality focused"
              ].map((skill, idx) => (
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
