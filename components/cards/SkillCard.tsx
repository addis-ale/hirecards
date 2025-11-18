"use client";

import React from "react";
import { Code, CheckCircle2, Hammer, AlertTriangle, Brain } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const SkillCard = () => {
  return (
    <div className="space-y-6">
      <Section title="Skill Card" subtitle="Technical, product, and behavioural skills" Icon={Code} density="compact">
        <div className="space-y-4">
          {/* Core Technical Skills */}
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
              Core Technical Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Advanced SQL, performance tuning",
                "dbt modelling, tests, macros, documentation",
                "Dimensional modelling, event modelling",
                "BI semantic layers (Looker/Mode/Tableau)",
                "Build reliable pipelines (Airflow/Dagster)"
              ].map((skill, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm" style={{ color: "#102a63" }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Skills */}
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
              Product Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Define metrics clearly",
                "Work with PMs to shape analytics UX",
                "Turn business questions into models"
              ].map((skill, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span className="text-sm" style={{ color: "#102a63" }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioural Skills */}
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
              Behavioural Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Ownership",
                "Calm under ambiguity",
                "Communicates like an engineer, not an analyst",
                "Cares about quality + long-term maintainability"
              ].map((skill, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-sm" style={{ color: "#102a63" }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="Brutal Truth">
            90 percent of candidates calling themselves "analytics engineers" are BI developers who write SQL and build dashboards. You need someone who designs systems, not "creates charts."
          </Callout>

          {/* Red Flags */}
          <Section title="Red Flags" Icon={AlertTriangle}>
            <ul className="space-y-2">
              {[
                "Only talks about dashboards, not modelling decisions",
                "No opinions on testing or naming conventions",
                "Avoids documentation",
                "Refers to data governance as \"boring admin\""
              ].map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "#102a63" }}>
                  <span className="text-orange-500 font-bold">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Don&apos;t Do This */}
          <Section title="Don&apos;t Do This" Icon={Hammer}>
            <ul className="space-y-2">
              {[
                "Hire someone who \"can learn dbt later\"",
                "Skip a modelling exercise",
                "Assume \"data engineer\" = \"analytics engineer\""
              ].map((dont, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-red-900">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{dont}</span>
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
