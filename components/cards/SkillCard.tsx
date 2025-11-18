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
                "Advanced SQL, performance tuning",
                "dbt modelling, tests, macros, documentation",
                "Dimensional modelling, event modelling",
                "BI semantic layers (Looker/Mode/Tableau)",
                "Build reliable pipelines (Airflow/Dagster)"
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
                "Define metrics clearly",
                "Work with PMs to shape analytics UX",
                "Turn business questions into models"
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
                "Ownership",
                "Calm under ambiguity",
                "Communicates like an engineer, not an analyst",
                "Cares about quality + long-term maintainability"
              ].map((skill, idx) => (
                <li key={idx} className="text-[13px] leading-snug" style={{ color: "#102a63" }}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="Brutal Truth">
            90 percent of candidates calling themselves &quot;analytics engineers&quot; are BI developers who write SQL and build dashboards. You need someone who designs systems, not &quot;creates charts.&quot;
          </Callout>

          {/* Red Flags */}
          <Section title="Red Flags" Icon={AlertTriangle} tone="danger">
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-red-600">
              {[
                "Only talks about dashboards, not modelling decisions",
                "No opinions on testing or naming conventions",
                "Avoids documentation",
                "Refers to data governance as \"boring admin\""
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
                "Hire someone who \"can learn dbt later\"",
                "Skip a modelling exercise",
                "Assume \"data engineer\" = \"analytics engineer\""
              ].map((dont, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-red-700">
                  {dont}
                </li>
              ))}
            </ul>
          </Section>

          {/* Hidden Bottleneck */}
          <Callout tone="neutral" title="Hidden Bottleneck">
            If your modelling layer is undefined or inconsistent, seniors will see &quot;hero work,&quot; not &quot;ownership.&quot;
          </Callout>

          {/* Timeline to Failure */}
          <Callout tone="warning" title="Timeline to Failure">
            Hiring anyone without proven modelling ownership → expect to rewrite everything in 9–12 months.
          </Callout>
        </div>
      </Section>
    </div>
  );
};
