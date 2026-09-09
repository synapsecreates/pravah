// FILE: src/pages/onboarding/onboardingUtils.ts
// PURPOSE: Mathematical and taxonomy helpers for radar polygon calculation, skill XP, archetype identification, and synergy discovery.
// PHASE: 8 | DEPENDS ON: ./constants.ts, ./SkillRadarCard.tsx | LAST TOUCHED: Phase 8

import { DOMAIN_CRITICAL_SKILLS, SKILL_SYNERGIES } from "./constants";
import type { RadarMathData } from "./SkillRadarCard";

export function calculateSkillArchetype(skills: { name: string; level: number }[]) {
  const avg = skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length) : 0;
  const xp = Math.min(1000, skills.length * 40 + avg * 6);

  const scores: Record<string, number> = {};
  DOMAIN_CRITICAL_SKILLS.forEach((dom) => {
    const domSkills = skills.filter((s) =>
      dom.skills.some((ds) => ds.toLowerCase() === s.name.toLowerCase())
    );
    if (domSkills.length === 0) {
      scores[dom.domain] = 0.12;
    } else {
      const domAvg = domSkills.reduce((a, b) => a + b.level, 0) / domSkills.length;
      scores[dom.domain] = Math.max(0.2, Math.min(1.0, (domAvg / 100) * (domSkills.length >= 3 ? 1 : 0.85)));
    }
  });

  let archetype = "Emerging Tech Explorer";
  let maxScore = -1;
  let topDomain = "";
  Object.entries(scores).forEach(([dom, score]) => {
    if (score > maxScore) {
      maxScore = score;
      topDomain = dom;
    }
  });

  if (skills.length >= 5) {
    if (topDomain.includes("Frontend") && (scores["Backend & Systems"] || 0) > 0.4) {
      archetype = "Full-Stack Architect";
    } else if (topDomain.includes("AI")) {
      archetype = "AI Systems Specialist";
    } else if (topDomain.includes("Cloud")) {
      archetype = "Cloud Platform Engineer";
    } else if (topDomain.includes("Security")) {
      archetype = "Cyber Defense Specialist";
    } else if (topDomain.includes("Data")) {
      archetype = "Data Intelligence Engineer";
    } else if (topDomain.includes("Backend")) {
      archetype = "Distributed Systems Lead";
    } else {
      archetype = "Cross-Disciplinary Technologist";
    }
  } else if (skills.length > 0) {
    archetype = `${topDomain.split(" ")[0]} Engineer`;
  }

  return { totalXP: xp, avgProficiency: avg, dominantArchetype: archetype, domainScores: scores };
}

export function calculateRadarPoints(domainScores: Record<string, number>): RadarMathData {
  const cx = 110;
  const cy = 110;
  const radius = 75;
  const totalAxes = DOMAIN_CRITICAL_SKILLS.length;

  const points = DOMAIN_CRITICAL_SKILLS.map((dom, i) => {
    const angle = (Math.PI * 2 * i) / totalAxes - Math.PI / 2;
    const score = domainScores[dom.domain] || 0.15;
    const r = radius * score;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, score, dom, angle };
  });

  const polygonStr = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return { cx, cy, radius, points, polygonStr };
}

export function calculateSmartSynergies(skills: { name: string; level: number }[]) {
  const suggestions: { name: string; gain: string; from: string }[] = [];
  skills.forEach((s) => {
    const match = SKILL_SYNERGIES[s.name];
    if (match) {
      match.forEach((syn) => {
        if (
          !skills.some((ex) => ex.name.toLowerCase() === syn.name.toLowerCase()) &&
          !suggestions.some((ex) => ex.name.toLowerCase() === syn.name.toLowerCase())
        ) {
          suggestions.push({ ...syn, from: s.name });
        }
      });
    }
  });
  return suggestions.slice(0, 4);
}
