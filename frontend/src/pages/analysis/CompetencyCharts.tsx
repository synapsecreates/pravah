// FILE: src/pages/analysis/CompetencyCharts.tsx
// PURPOSE: Recharts Dual-Bar and 6-Axis Competency Radar visualizations with interactive interpretation guide drawer.
// PHASE: 8 | DEPENDS ON: React, recharts, lucide-react | LAST TOUCHED: Phase 8

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { BarChart3, Compass, HelpCircle } from "lucide-react";

export const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const requiredVal = payload.find((p: any) => p.dataKey === "Required")?.value || 0;
    const currentVal = payload.find((p: any) => p.dataKey === "Current")?.value || 0;
    const gapVal = Math.max(0, requiredVal - currentVal);

    return (
      <div
        style={{
          backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)",
          borderRadius: "8px", padding: "10px 14px", boxShadow: "var(--shadow-hover)",
          fontSize: "12px", color: "var(--text-primary)",
        }}
      >
        <p style={{ fontWeight: 700, margin: "0 0 6px 0", color: "var(--text-primary)" }}>{label}</p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", color: "var(--text-secondary)" }}>
          <span>Required Benchmark:</span>
          <strong style={{ color: "#0284c7", fontFamily: "monospace" }}>{requiredVal}%</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", color: "var(--text-secondary)" }}>
          <span>Candidate Level:</span>
          <strong style={{ color: "#10b981", fontFamily: "monospace" }}>{currentVal}%</strong>
        </div>
        <div
          style={{
            marginTop: "6px", paddingTop: "6px", borderTop: "1px solid var(--border-subtle)",
            display: "flex", justifyContent: "space-between", gap: "16px",
          }}
        >
          <span>Calculated Gap:</span>
          <strong style={{ color: gapVal > 0 ? "var(--danger)" : "var(--success)", fontFamily: "monospace" }}>
            {gapVal > 0 ? `-${gapVal}%` : "Benchmark Met"}
          </strong>
        </div>
        <div style={{ marginTop: "4px", fontSize: "10px", color: "var(--text-muted)", fontStyle: "italic" }}>
          Click bar to inspect mathematical proof
        </div>
      </div>
    );
  }
  return null;
};

interface CompetencyChartsProps {
  roleTitle: string;
  barChartData: any[];
  domainRadarData: any[];
  onBarClick: (data: any) => void;
}

export const CompetencyCharts: React.FC<CompetencyChartsProps> = ({
  roleTitle,
  barChartData,
  domainRadarData,
  onBarClick,
}) => {
  const [showRadarGuide, setShowRadarGuide] = useState<boolean>(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Dual Bar Chart */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
            <BarChart3 size={16} color="var(--brand-600)" />
            <span>Skill Repertoire vs. {roleTitle} Benchmark Requirements</span>
          </h3>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
            Click bar to inspect math proof
          </span>
        </div>

        <div style={{ backgroundColor: "var(--bg-sunken)", borderRadius: "12px", border: "1px solid var(--border-subtle)", padding: "16px 12px", height: "320px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }} onClick={onBarClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} angle={-25} textAnchor="end" />
              <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} tickLine={false} />
              <RechartsTooltip content={<CustomBarTooltip />} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }} />
              <Bar dataKey="Required" fill="#0284c7" name="Industry Benchmark" radius={[4, 4, 0, 0]} cursor="pointer" />
              <Bar dataKey="Current" fill="#10b981" name="Student Evaluated" radius={[4, 4, 0, 0]} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6-Axis Competency Radar with Interpretation Guide Drawer */}
      <div style={{ backgroundColor: "var(--bg-sunken)", borderRadius: "12px", border: "1px solid var(--border-subtle)", padding: "16px", display: "flex", flexDirection: "column" }}>
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h4 style={{ fontSize: "13px", fontWeight: 700, margin: 0, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Compass size={15} color="var(--brand-600)" />
            <span>Domain Competency Profile</span>
          </h4>
          <button
            type="button"
            onClick={() => setShowRadarGuide(!showRadarGuide)}
            style={{
              background: "none", border: "none", color: "var(--brand-600)",
              fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px",
            }}
          >
            <HelpCircle size={13} />
            <span>{showRadarGuide ? "Hide Guide" : "How to Interpret"}</span>
          </button>
        </div>

        <div style={{ width: "100%", height: "230px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={domainRadarData} outerRadius="75%">
              <PolarGrid stroke="var(--border-strong)" />
              <PolarAngleAxis dataKey="domain" stroke="var(--text-secondary)" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--border-subtle)" fontSize={9} />
              <Radar name="Candidate Competency" dataKey="Student" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              <Radar name="Industry Standard" dataKey="Industry" stroke="#0284c7" fill="#0284c7" fillOpacity={0.15} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {showRadarGuide && (
          <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "8px", fontSize: "11px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px", lineHeight: "1.4" }}>
            <strong style={{ color: "var(--text-primary)" }}>How to Interpret Your Radar Polygon:</strong>
            <div>• <strong>T-Shaped Profile:</strong> A balanced hexagon reflects a versatile systems generalist. A spiked polygon indicates a specialized expert (e.g. AI/ML and Data Eng heavy).</div>
            <div>• <strong>Green Overlap vs Blue:</strong> Where Green extends outside Blue, you possess a <em>verified competitive moat</em>. Where Blue extends beyond Green, you have an <em>inter-disciplinary deficit</em>.</div>
            <div>• <strong>Analyzed Pillars:</strong> Frontend (UI/UX), Backend (APIs/Databases), DevOps (CI/CD/Containers), AI/ML (Models/Inference), Data Eng (Pipelines/ETL), Security (Auth/Hardening).</div>
          </div>
        )}
      </div>
    </div>
  );
};
