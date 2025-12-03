"use client";

import React, { useState, useEffect } from "react";
import { Code, AlertTriangle, Hammer, Brain, Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";

export const EditableSkillCard = () => {
  const [technicalSkills, setTechnicalSkills] = useState([
    "Advanced SQL",
    "dbt modelling",
    "Dimensional modelling",
    "BI tools",
    "Pipeline building",
  ]);
  const [productSkills, setProductSkills] = useState([
    "Define clear metrics",
    "Shape analytics UX",
    "Model business logic",
  ]);
  const [behaviouralSkills, setBehaviouralSkills] = useState([
    "Ownership mindset",
    "Handles ambiguity",
    "Clear communication",
    "Quality focused",
  ]);
  const [brutalTruth, setBrutalTruth] = useState(
    'Most "analytics engineers" are BI developers. Find system designers.'
  );
  const [redFlags, setRedFlags] = useState([
    "Dashboard-focused only",
    "No testing opinions",
    "Avoids documentation",
    "Dismisses governance",
  ]);
  const [donts, setDonts] = useState([
    "Hire without dbt experience",
    "Skip modelling exercises",
    "Confuse data/analytics engineers",
  ]);

  // Save to sessionStorage
  useEffect(() => {
    const data = {
      technicalSkills,
      productSkills,
      behaviouralSkills,
      brutalTruth,
      redFlags,
      donts,
    };
    sessionStorage.setItem("editableSkillCard", JSON.stringify(data));
  }, [technicalSkills, productSkills, behaviouralSkills, brutalTruth, redFlags, donts]);

  // Load from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("editableSkillCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.technicalSkills) setTechnicalSkills(data.technicalSkills);
        if (data.productSkills) setProductSkills(data.productSkills);
        if (data.behaviouralSkills) setBehaviouralSkills(data.behaviouralSkills);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <EditableList
              items={technicalSkills}
              onChange={setTechnicalSkills}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-blue-600"
            />
          </div>

          {/* Product Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Product Skills</span>
            </h3>
            <EditableList
              items={productSkills}
              onChange={setProductSkills}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-purple-600"
            />
          </div>

          {/* Behavioural Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Users className="w-4 h-4 text-green-600" />
              <span>Behavioural Skills</span>
            </h3>
            <EditableList
              items={behaviouralSkills}
              onChange={setBehaviouralSkills}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-green-600"
            />
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="Brutal Truth">
            <EditableText
              value={brutalTruth}
              onChange={setBrutalTruth}
              multiline
              placeholder="What's the hard truth about skills for this role?"
            />
          </Callout>

          {/* Red Flags */}
          <Section title="Red Flags" Icon={AlertTriangle} tone="danger">
            <EditableList
              items={redFlags}
              onChange={setRedFlags}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>

          {/* Don't Do This */}
          <Section title="Don't Do This" Icon={Hammer} tone="danger">
            <EditableList
              items={donts}
              onChange={setDonts}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>
        </div>
      </Section>
    </div>
  );
};
