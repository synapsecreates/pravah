// FILE: src/pages/analysis/analysisUtils.ts
// PURPOSE: Domain competency aggregation, recommendations, tier categorizations, and ATS job evaluation math.
// PHASE: 8 | DEPENDS ON: src/data/roles_taxonomy.ts, ./constants.ts | LAST TOUCHED: Phase 8

import { ALL_106_ROLES } from "../../data/roles_taxonomy";
import type { JobPreset } from "./constants";

export function calculateSpecializedRecommendations(studentSkills: Record<string, number>, activeRoleSlug: string) {
  const candidates = ALL_106_ROLES.filter((r) => !r.is_anchor_role && r.slug !== activeRoleSlug);
  const scored = candidates.map((role) => {
    let totalReq = 0;
    let earnedReq = 0;
    const alignedSkills: string[] = [];

    for (const s of role.skills) {
      const studentLvl = studentSkills[s.name] || 0;
      const wt = s.importance_weight || 8.0;
      totalReq += s.required_level * wt;
      earnedReq += Math.min(studentLvl, s.required_level) * wt;

      if (studentLvl >= s.required_level * 0.65) {
        alignedSkills.push(s.name);
      }
    }

    const matchPct = totalReq > 0 ? Math.round((earnedReq / totalReq) * 100) : 50;
    return { ...role, matchPct, alignedSkills };
  });

  scored.sort((a, b) => b.matchPct - a.matchPct || b.industry_demand - a.industry_demand);
  return scored.slice(0, 6);
}

export function calculateDomainRadarData(studentSkills: Record<string, number>) {
  return [
    {
      domain: "Frontend",
      Student: Math.round(((studentSkills["React"] || 40) + (studentSkills["TypeScript"] || 30) + (studentSkills["HTML/CSS"] || 50)) / 3),
      Industry: 75,
    },
    {
      domain: "Backend",
      Student: Math.round(((studentSkills["Python"] || 60) + (studentSkills["SQL"] || 50) + (studentSkills["REST APIs"] || 40)) / 3),
      Industry: 80,
    },
    {
      domain: "DevOps",
      Student: Math.round(((studentSkills["Docker"] || 30) + (studentSkills["Git"] || 60) + (studentSkills["CI/CD"] || 25)) / 3),
      Industry: 70,
    },
    {
      domain: "AI / ML",
      Student: Math.round(((studentSkills["Machine Learning"] || 40) + (studentSkills["PyTorch"] || 30) + (studentSkills["Deep Learning"] || 20)) / 3),
      Industry: 75,
    },
    {
      domain: "Data Eng.",
      Student: Math.round(((studentSkills["Pandas"] || 50) + (studentSkills["SQL"] || 50) + (studentSkills["NumPy"] || 45)) / 3),
      Industry: 75,
    },
    {
      domain: "Security",
      Student: Math.round(((studentSkills["Authentication"] || 45) + (studentSkills["API Security"] || 35)) / 2) || 40,
      Industry: 70,
    },
  ];
}

export function calculatePlacementTierInfo(percentileStanding: number) {
  if (percentileStanding >= 95) {
    return {
      tier: "Tier 1 · National Elite (Top 5%)",
      color: "var(--success)",
      salary: "₹18 - ₹35 LPA",
      label: "GCCs, Global R&D & High-Growth Product Firms",
    };
  }
  if (percentileStanding >= 80) {
    return {
      tier: "Tier 2 · Advanced Competitive (Top 20%)",
      color: "var(--brand-600)",
      salary: "₹10 - ₹18 LPA",
      label: "Specialist Tech & Mid-Market Unicorns",
    };
  }
  if (percentileStanding >= 50) {
    return {
      tier: "Tier 3 · Employable Core (Top 50%)",
      color: "var(--warning)",
      salary: "₹5 - ₹10 LPA",
      label: "Enterprise IT & Consulting Services",
    };
  }
  return {
    tier: "Tier 4 · Emerging / Growth Track",
    color: "var(--danger)",
    salary: "₹3.5 - ₹5 LPA",
    label: "Requires Roadmap Remediation",
  };
}

export function calculateJobMatchEvaluation(preset: JobPreset, studentSkills: Record<string, number>) {
  let totalWeight = 0;
  let earnedWeight = 0;
  const skillsStatus = preset.skills.map((s) => {
    const studentLvl = studentSkills[s.name] || 0;
    totalWeight += s.weight;
    earnedWeight += (studentLvl / 100) * s.weight;
    return {
      name: s.name,
      required: s.required,
      weight: s.weight,
      studentLvl,
      isMet: studentLvl >= (s.required ? 60 : 40),
    };
  });
  const matchScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  return { activePreset: preset, matchScore, skillsStatus };
}
