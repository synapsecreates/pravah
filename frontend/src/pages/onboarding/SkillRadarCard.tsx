// FILE: src/pages/onboarding/SkillRadarCard.tsx
// PURPOSE: Interactive SVG Radar Visualization HUD rendering student competency hexagon polygons and summary stats.
// PHASE: 8 | DEPENDS ON: React, ./constants.ts | LAST TOUCHED: Phase 8

import React from "react";
import { DOMAIN_CRITICAL_SKILLS } from "./constants";

export interface RadarMathData {
  cx: number;
  cy: number;
  radius: number;
  points: { x: number; y: number; score: number; dom: any; angle: number }[];
  polygonStr: string;
}

interface SkillRadarCardProps {
  totalXP: number;
  avgProficiency: number;
  dominantArchetype: string;
  domainScores: Record<string, number>;
  skillsCount: number;
  radarPoints: RadarMathData;
}

export const SkillRadarCard: React.FC<SkillRadarCardProps> = ({
  totalXP,
  avgProficiency,
  dominantArchetype,
  domainScores,
  skillsCount,
  radarPoints,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-base)",
        borderRadius: "14px",
        border: "1px solid var(--border-strong)",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* HUD Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2 }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--brand-600)" }}>
            Skill Distribution
          </span>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", margin: "2px 0 0 0" }}>
            {dominantArchetype}
          </h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
            {totalXP} <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)" }}>/ 1000</span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>
            {totalXP >= 750 ? "Advanced Standing" : totalXP >= 500 ? "Qualified" : "Developing Core"}
          </span>
        </div>
      </div>

      {/* SVG Radar Visualization */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
        <svg width="220" height="220" viewBox="0 0 220 220" style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--brand-600)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--violet-accent)" stopOpacity="0.15" />
            </radialGradient>
          </defs>

          {/* Concentric Hexagons */}
          {[0.25, 0.5, 0.75, 1.0].map((level) => {
            const levelPoints = DOMAIN_CRITICAL_SKILLS.map((_, i) => {
              const angle = (Math.PI * 2 * i) / DOMAIN_CRITICAL_SKILLS.length - Math.PI / 2;
              const r = radarPoints.radius * level;
              const x = radarPoints.cx + r * Math.cos(angle);
              const y = radarPoints.cy + r * Math.sin(angle);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(" ");
            return (
              <polygon
                key={level}
                points={levelPoints}
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="1"
                strokeDasharray={level < 1.0 ? "3 3" : "none"}
                opacity={level === 1.0 ? 0.8 : 0.4}
              />
            );
          })}

          {/* Spoke Lines */}
          {radarPoints.points.map((_, idx) => {
            const angle = (Math.PI * 2 * idx) / DOMAIN_CRITICAL_SKILLS.length - Math.PI / 2;
            const outerX = radarPoints.cx + radarPoints.radius * Math.cos(angle);
            const outerY = radarPoints.cy + radarPoints.radius * Math.sin(angle);
            return (
              <line
                key={idx}
                x1={radarPoints.cx}
                y1={radarPoints.cy}
                x2={outerX}
                y2={outerY}
                stroke="var(--border-strong)"
                strokeWidth="1"
                opacity={0.5}
              />
            );
          })}

          {/* Filled Dynamic Polygon */}
          <polygon
            points={radarPoints.polygonStr}
            fill="url(#radarGradient)"
            stroke="var(--brand-600)"
            strokeWidth="2"
            style={{ transition: "all 0.3s ease" }}
          />

          {/* Vertex Data Points */}
          {radarPoints.points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="var(--bg-base)"
              stroke="var(--brand-600)"
              strokeWidth="2"
              style={{ transition: "all 0.3s ease" }}
            />
          ))}

          {/* Axis Labels */}
          {DOMAIN_CRITICAL_SKILLS.map((dom, idx) => {
            const angle = (Math.PI * 2 * idx) / DOMAIN_CRITICAL_SKILLS.length - Math.PI / 2;
            const labelRadius = radarPoints.radius + 20;
            const lx = radarPoints.cx + labelRadius * Math.cos(angle);
            const ly = radarPoints.cy + labelRadius * Math.sin(angle);
            return (
              <text
                key={dom.domain}
                x={lx}
                y={ly}
                fontSize="9"
                fontWeight="600"
                fill="var(--text-secondary)"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {dom.shortLabel}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Radar Footer Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          paddingTop: "10px",
          borderTop: "1px solid var(--border-subtle)",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Equipped</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
            {skillsCount} Skills
          </div>
        </div>
        <div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Avg Level</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--brand-600)" }}>
            {avgProficiency}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Domains</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--success)" }}>
            {Object.values(domainScores).filter((s) => s > 0.3).length} / 6
          </div>
        </div>
      </div>
    </div>
  );
};
