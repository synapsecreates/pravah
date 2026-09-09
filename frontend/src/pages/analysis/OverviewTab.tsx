// FILE: src/pages/analysis/OverviewTab.tsx
// PURPOSE: Executive Overview tab grid composing ReadinessGauge, CompetencyCharts, NationalStandingCard, GatewayCards, Simulator, and BenchmarkSidebar.
// PHASE: 8 | DEPENDS ON: React, ./ReadinessGauge.tsx, ./CompetencyCharts.tsx, ./NationalStandingCard.tsx, ./GatewayCards.tsx, ./Simulator.tsx, ./SimulationHistoryTable.tsx, ./BenchmarkSidebar.tsx | LAST TOUCHED: Phase 8

import React from "react";
import { ReadinessGauge } from "./ReadinessGauge";
import { CompetencyCharts } from "./CompetencyCharts";
import { NationalStandingCard } from "./NationalStandingCard";
import { GatewayCards } from "./GatewayCards";
import { Simulator } from "./Simulator";
import { SimulationHistoryTable } from "./SimulationHistoryTable";
import { BenchmarkSidebar } from "./BenchmarkSidebar";
import type { RoleMatchSummary, StudentProfileData } from "../../types/student";
import type { MatchCalculationResult, GapAnalysisResult, WhatIfSimulateResult } from "../../types/student";
import type { BumpLogEntry } from "./constants";

interface OverviewTabProps {
  activeRole: RoleMatchSummary;
  studentProfile: StudentProfileData;
  matchResult: MatchCalculationResult;
  gapResult: GapAnalysisResult | null;
  rawScore: number;
  readinessScore: number;
  barChartData: any[];
  domainRadarData: any[];
  percentileStanding: number;
  zScore: number;
  placementTierInfo: any;
  totalRoadmapHours: number;
  specializedRecommendations: any[];
  selectedSkillToBump: string;
  setSelectedSkillToBump: (s: string) => void;
  bumpValue: number;
  setBumpValue: (v: number) => void;
  simulationResult: WhatIfSimulateResult | null;
  setSimulationResult: (r: WhatIfSimulateResult | null) => void;
  isSimulating: boolean;
  onRunSimulation: () => void;
  bumpHistory: BumpLogEntry[];
  bestExperiment: BumpLogEntry | null;
  setBumpHistory: React.Dispatch<React.SetStateAction<BumpLogEntry[]>>;
  roleSearchQuery: string;
  setRoleSearchQuery: (q: string) => void;
  selectedDomainFilter: string;
  setSelectedDomainFilter: (d: string) => void;
  filteredTaxonomyRoles: any[];
  onSelectRole: (slug: string) => void;
  onInspectProof: (type: any, data: any) => void;
  onViewTimeline: (skill: string, hours: number) => void;
  onSwitchTab: (tab: "overview" | "roadmap" | "specializations" | "parser") => void;
  setGapFilter: (f: "all" | "critical" | "core" | "supporting" | "strengths") => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = (props) => {
  const {
    activeRole, studentProfile, matchResult, gapResult, rawScore, readinessScore,
    barChartData, domainRadarData, percentileStanding, zScore, placementTierInfo,
    totalRoadmapHours, specializedRecommendations, selectedSkillToBump,
    setSelectedSkillToBump, bumpValue, setBumpValue, simulationResult,
    setSimulationResult, isSimulating, onRunSimulation, bumpHistory,
    bestExperiment, setBumpHistory, roleSearchQuery, setRoleSearchQuery,
    selectedDomainFilter, setSelectedDomainFilter, filteredTaxonomyRoles,
    onSelectRole, onInspectProof, onViewTimeline, onSwitchTab, setGapFilter,
  } = props;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "28px", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", minWidth: 0, gridColumn: "span 2" }}>
        <ReadinessGauge
          activeRole={activeRole} studentProfile={studentProfile} matchResult={matchResult}
          rawScore={rawScore} criticalGapsCount={gapResult?.critical_gaps.length || 0}
          onInspectProof={(type, data) => onInspectProof(type, data)}
          onViewCriticalGaps={() => { setGapFilter("critical"); onSwitchTab("roadmap"); }}
        />

        <section style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-elevation)" }}>
          <div style={{ marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid var(--border-subtle)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px 0", color: "var(--text-primary)" }}>Visual Competency & Benchmark Diagnostics</h2>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
              Side-by-side skill comparison against {activeRole.title} requirements, multi-domain 6-axis radar, and Gaussian national standing.
            </p>
          </div>
          <CompetencyCharts
            roleTitle={activeRole.title} barChartData={barChartData} domainRadarData={domainRadarData}
            onBarClick={(data) => {
              if (data?.activePayload?.length) {
                const it = data.activePayload[0].payload;
                onInspectProof("gap", { skill_name: it.name, required_level: it.Required, student_level: it.Current, gap: Math.max(0, it.Required - it.Current), tier: it.tier || "Competency Gap" });
              }
            }}
          />
          <div style={{ marginTop: "16px" }}>
            <NationalStandingCard
              percentileStanding={percentileStanding} zScore={zScore} placementTierInfo={placementTierInfo}
              onInspectProof={() => onInspectProof("statistical", { role_title: activeRole.title, readiness_score: readinessScore, national_mean: 48.2, national_std: 16.4, z_score: zScore, percentile: percentileStanding, placement_tier: placementTierInfo.tier, salary_band: placementTierInfo.salary, cohort_size: "1,200,000 AICTE Engineering Candidates" })}
            />
          </div>
        </section>

        <GatewayCards
          gapResult={gapResult} totalRoadmapHours={totalRoadmapHours} specializedRecommendations={specializedRecommendations}
          onOpenRoadmap={() => onSwitchTab("roadmap")} onOpenSpecializations={() => onSwitchTab("specializations")}
        />

        <section style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-elevation)" }}>
          <div style={{ marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid var(--border-subtle)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px 0", color: "var(--text-primary)" }}>Live Skill Bump Simulator & Comparative Experiment Log</h2>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
              Hypothetical &quot;what-if&quot; placement score projections with side-by-side comparative logging.
            </p>
          </div>
          <Simulator
            skills={studentProfile.skills} selectedSkillToBump={selectedSkillToBump} setSelectedSkillToBump={setSelectedSkillToBump}
            bumpValue={bumpValue} setBumpValue={setBumpValue} simulationResult={simulationResult} setSimulationResult={setSimulationResult}
            isSimulating={isSimulating} onRunSimulation={onRunSimulation} readinessScore={readinessScore} activeRoleTitle={activeRole.title}
            onViewTimeline={onViewTimeline}
          />
          <SimulationHistoryTable
            bumpHistory={bumpHistory} bestExperiment={bestExperiment} onClearHistory={() => setBumpHistory([])}
            onReapplyExperiment={(entry) => { setSelectedSkillToBump(entry.skill); setBumpValue(entry.bumpedLevel); }}
            onRemoveExperiment={(id) => setBumpHistory(bumpHistory.filter((e) => e.id !== id))}
          />
        </section>
      </div>

      <BenchmarkSidebar
        activeRole={activeRole} studentProfile={studentProfile} readinessScore={readinessScore}
        criticalGapsSkillName={gapResult?.critical_gaps[0]?.skill_name} roleSearchQuery={roleSearchQuery}
        setRoleSearchQuery={setRoleSearchQuery} selectedDomainFilter={selectedDomainFilter}
        setSelectedDomainFilter={setSelectedDomainFilter} filteredTaxonomyRoles={filteredTaxonomyRoles}
        onSelectRole={onSelectRole}
      />
    </div>
  );
};
