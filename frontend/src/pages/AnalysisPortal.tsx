// FILE: src/pages/AnalysisPortal.tsx
// PURPOSE: Modular coordinator shell for Student Analysis: executive diagnostic, visual benchmarks, simulation, and action plan.
// PHASE: 8 | DEPENDS ON: React, src/api/client.ts, src/types/student.ts, src/components/CalculationModal.tsx, src/components/LearningTimelineModal.tsx, ./analysis/* | LAST TOUCHED: Phase 8

import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, AlertTriangle } from "lucide-react";
import type {
  RoleMatchSummary, StudentProfileData, SkillGapItem,
  MatchCalculationResult, GapAnalysisResult, RoadmapResult, WhatIfSimulateResult,
} from "../types/student";
import { calculateMatch, calculateGaps, getRoadmap, whatIfSimulate, ANCHOR_ROLES_DATA } from "../api/client";
import { ALL_106_ROLES } from "../data/roles_taxonomy";
import { CalculationModal, type CalculationPayload } from "../components/CalculationModal";
import { LearningTimelineModal } from "../components/LearningTimelineModal";
import { type BumpLogEntry, gaussianCDF, JOB_PRESETS } from "./analysis/constants";
import {
  calculateSpecializedRecommendations, calculateDomainRadarData,
  calculatePlacementTierInfo, calculateJobMatchEvaluation,
} from "./analysis/analysisUtils";
import { AnalysisHeader } from "./analysis/AnalysisHeader";
import { OverviewTab } from "./analysis/OverviewTab";
import { Roadmap } from "./analysis/Roadmap";
import { RolesCatalogView } from "./analysis/RolesCatalogView";
import { JobParserView } from "./analysis/JobParserView";

interface AnalysisPortalProps {
  studentProfile: StudentProfileData;
  targetRole: RoleMatchSummary;
  onBackToOnboarding: () => void;
  onSwitchTargetRole: (newRoleSlug: string) => void;
}

export const AnalysisPortal: React.FC<AnalysisPortalProps> = ({
  studentProfile, targetRole: propTargetRole, onBackToOnboarding, onSwitchTargetRole,
}) => {
  const [activePortalTab, setActivePortalTab] = useState<"overview" | "roadmap" | "specializations" | "parser">("overview");
  const [activeRole, setActiveRole] = useState<RoleMatchSummary>(propTargetRole);
  const [matchResult, setMatchResult] = useState<MatchCalculationResult | null>(null);
  const [gapResult, setGapResult] = useState<GapAnalysisResult | null>(null);
  const [roadmapResult, setRoadmapResult] = useState<RoadmapResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gapFilter, setGapFilter] = useState<"all" | "critical" | "core" | "supporting" | "strengths">("all");
  const [calculationPayload, setCalculationPayload] = useState<CalculationPayload | null>(null);
  const [timelineModalData, setTimelineModalData] = useState<{ skillName: string; estimatedHours: number; priorityTier: string } | null>(null);
  const [roleSearchQuery, setRoleSearchQuery] = useState<string>("");
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>("all");
  const [selectedSkillToBump, setSelectedSkillToBump] = useState<string>("Python");
  const [bumpValue, setBumpValue] = useState<number>(85);
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulateResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [bumpHistory, setBumpHistory] = useState<BumpLogEntry[]>([]);
  const [selectedJobPreset, setSelectedJobPreset] = useState<string>("ai-ml");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => { setActiveRole(propTargetRole); }, [propTargetRole]);

  const handleSelectRole = (newSlug: string) => {
    const found = ALL_106_ROLES.find((r) => r.slug === newSlug) || ANCHOR_ROLES_DATA.find((r) => r.slug === newSlug);
    if (found) {
      setActiveRole({
        role_id: (found as any).id || (found as any).role_id || found.slug,
        slug: found.slug, title: found.title, domain: found.domain,
        match_percentage: 0, industry_demand: found.industry_demand,
        primary_focus: (found as any).primary_focus || (found as any).description || "",
        why_match_rationale: "Selected benchmark target from national catalog",
      });
      onSwitchTargetRole(newSlug);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [match, gaps, roadmap] = await Promise.all([
          calculateMatch(activeRole.slug, studentProfile.skills, studentProfile.degree_field),
          calculateGaps(activeRole.slug, studentProfile.skills, studentProfile.degree_field),
          getRoadmap(activeRole.slug, studentProfile.skills, studentProfile.degree_field),
        ]);
        if (!isMounted) return;
        setMatchResult(match); setGapResult(gaps); setRoadmapResult(roadmap);
        const skillKeys = Object.keys(studentProfile.skills);
        if (skillKeys.length > 0) {
          setSelectedSkillToBump(skillKeys[0]);
          setBumpValue(Math.min(100, (studentProfile.skills[skillKeys[0]] || 50) + 25));
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Intelligence Engine execution interrupted.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [activeRole.slug, studentProfile]);

  const handleRunSimulation = async () => {
    if (!selectedSkillToBump) return;
    setIsSimulating(true);
    try {
      const currentLevel = studentProfile.skills[selectedSkillToBump] || 0;
      const res = await whatIfSimulate(activeRole.slug, studentProfile.skills, selectedSkillToBump, bumpValue, studentProfile.degree_field);
      setSimulationResult(res);
      setBumpHistory((prev) => [
        {
          id: `${Date.now()}-${selectedSkillToBump}-${bumpValue}`, experimentNumber: prev.length + 1,
          skill: selectedSkillToBump, baselineLevel: currentLevel, bumpedLevel: bumpValue,
          gain: res.projected_gain, simulatedScore: res.simulated_score,
          baselineScore: matchResult ? matchResult.final_readiness_score : 0,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        ...prev,
      ]);
    } catch (_) {} finally { setIsSimulating(false); }
  };

  const bestExperiment = useMemo(() => bumpHistory.length === 0 ? null : [...bumpHistory].sort((a, b) => b.gain - a.gain)[0], [bumpHistory]);

  const filteredTaxonomyRoles = useMemo(() => {
    return ALL_106_ROLES.filter((role) => {
      if (role.slug === activeRole.slug) return false;
      const q = roleSearchQuery.toLowerCase().trim();
      return (!q || role.title.toLowerCase().includes(q) || role.domain.toLowerCase().includes(q) || role.skills.some((s) => s.name.toLowerCase().includes(q))) &&
        (selectedDomainFilter === "all" || role.domain.toLowerCase().includes(selectedDomainFilter.toLowerCase()));
    });
  }, [roleSearchQuery, selectedDomainFilter, activeRole.slug]);

  const specializedRecommendations = useMemo(() => calculateSpecializedRecommendations(studentProfile.skills, activeRole.slug), [studentProfile.skills, activeRole.slug]);

  const barChartData = useMemo(() => [
    ...(gapResult?.critical_gaps || []), ...(gapResult?.core_gaps || []),
    ...(gapResult?.supporting_gaps || []), ...(gapResult?.strengths || []),
  ].map((i) => ({ name: i.skill_name, Required: i.required_level, Current: i.student_level, tier: i.tier_category, gap: i.gap })), [gapResult]);

  const domainRadarData = useMemo(() => calculateDomainRadarData(studentProfile.skills), [studentProfile.skills]);

  const filteredGaps: SkillGapItem[] = useMemo(() => {
    if (!gapResult) return [];
    if (gapFilter === "critical") return gapResult.critical_gaps;
    if (gapFilter === "core") return gapResult.core_gaps;
    if (gapFilter === "supporting") return gapResult.supporting_gaps;
    if (gapFilter === "strengths") return gapResult.strengths;
    return [...gapResult.critical_gaps, ...gapResult.core_gaps, ...gapResult.supporting_gaps, ...gapResult.strengths];
  }, [gapResult, gapFilter]);

  const activeJobPreset = useMemo(() => JOB_PRESETS.find((p) => p.id === selectedJobPreset) || JOB_PRESETS[0], [selectedJobPreset]);
  const jobMatchEvaluation = useMemo(() => calculateJobMatchEvaluation(activeJobPreset, studentProfile.skills), [activeJobPreset, studentProfile.skills]);

  if (isLoading) {
    return (
      <div style={{ maxWidth: "1520px", margin: "80px auto", textAlign: "center", padding: "40px" }}>
        <Sparkles size={36} color="var(--brand-600)" style={{ animation: "spin 1s linear infinite", marginBottom: "16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Executing Deterministic Intelligence Engine...</h2>
      </div>
    );
  }

  if (error || !matchResult) {
    return (
      <div style={{ maxWidth: "680px", margin: "80px auto", textAlign: "center", padding: "36px", backgroundColor: "var(--bg-surface)", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
        <AlertTriangle size={36} color="var(--danger)" style={{ marginBottom: "16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Intelligence Calculation Interrupted</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>{error}</p>
        <button type="button" onClick={onBackToOnboarding} className="interactive-btn" style={{ padding: "10px 22px", borderRadius: "8px", backgroundColor: "var(--brand-600)", color: "var(--bg-base)", border: "none", fontWeight: 700, cursor: "pointer" }}>
          Return to Onboarding
        </button>
      </div>
    );
  }

  const readinessScore = matchResult.final_readiness_score;
  const rawScore = matchResult.raw_match_score;
  const zScore = (readinessScore - 48.2) / 16.4;
  const percentileStanding = Math.min(99.8, Math.max(0.5, gaussianCDF(zScore) * 100));
  const placementTierInfo = calculatePlacementTierInfo(percentileStanding);
  const totalRoadmapHours = (gapResult?.critical_gaps || []).reduce((acc, i) => acc + Math.max(15, Math.round(i.gap * 0.8)), 0) +
    (gapResult?.core_gaps || []).reduce((acc, i) => acc + Math.max(15, Math.round(i.gap * 0.8)), 0);

  return (
    <div style={{ maxWidth: "1520px", margin: "0 auto", padding: "24px 20px 60px 20px", color: "var(--text-primary)" }}>
      <CalculationModal payload={calculationPayload} onClose={() => setCalculationPayload(null)} />
      {timelineModalData && (
        <LearningTimelineModal skillName={timelineModalData.skillName} estimatedHours={timelineModalData.estimatedHours} priorityTier={timelineModalData.priorityTier} onClose={() => setTimelineModalData(null)} />
      )}
      {exportNotice && (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, backgroundColor: "var(--brand-600)", color: "var(--bg-base)", padding: "12px 20px", borderRadius: "10px", fontWeight: 700, boxShadow: "var(--shadow-hover)" }}>
          {exportNotice}
        </div>
      )}

      <AnalysisHeader
        studentProfile={studentProfile} activeRole={activeRole} activePortalTab={activePortalTab}
        setActivePortalTab={setActivePortalTab} roadmapGapsCount={(gapResult?.critical_gaps.length || 0) + (gapResult?.core_gaps.length || 0)}
        onOpenMathProof={() => setCalculationPayload({ type: "readiness", data: { role_title: activeRole.title, readiness_score: matchResult.final_readiness_score, composite_match: rawScore, education_factor: matchResult.education_factor, degree_field: studentProfile.degree_field } })}
        onExportSummary={() => { setExportNotice("Executive Brief Prepared · Opening System Print Dialog..."); setTimeout(() => { setExportNotice(null); window.print(); }, 900); }}
        onBackToOnboarding={onBackToOnboarding}
      />

      {activePortalTab === "overview" && (
        <OverviewTab
          activeRole={activeRole} studentProfile={studentProfile} matchResult={matchResult} gapResult={gapResult}
          rawScore={rawScore} readinessScore={readinessScore} barChartData={barChartData} domainRadarData={domainRadarData}
          percentileStanding={percentileStanding} zScore={zScore} placementTierInfo={placementTierInfo} totalRoadmapHours={totalRoadmapHours}
          specializedRecommendations={specializedRecommendations} selectedSkillToBump={selectedSkillToBump} setSelectedSkillToBump={setSelectedSkillToBump}
          bumpValue={bumpValue} setBumpValue={setBumpValue} simulationResult={simulationResult} setSimulationResult={setSimulationResult}
          isSimulating={isSimulating} onRunSimulation={handleRunSimulation} bumpHistory={bumpHistory} bestExperiment={bestExperiment}
          setBumpHistory={setBumpHistory} roleSearchQuery={roleSearchQuery} setRoleSearchQuery={setRoleSearchQuery}
          selectedDomainFilter={selectedDomainFilter} setSelectedDomainFilter={setSelectedDomainFilter} filteredTaxonomyRoles={filteredTaxonomyRoles}
          onSelectRole={handleSelectRole} onInspectProof={(type, data) => setCalculationPayload({ type, data })}
          onViewTimeline={(skill, hours) => setTimelineModalData({ skillName: skill, estimatedHours: hours, priorityTier: "Simulated Target" })}
          onSwitchTab={setActivePortalTab} setGapFilter={setGapFilter}
        />
      )}

      {activePortalTab === "roadmap" && (
        <Roadmap
          activeRoleTitle={activeRole.title} gapResult={gapResult} roadmapResult={roadmapResult}
          gapFilter={gapFilter} setGapFilter={setGapFilter} filteredGaps={filteredGaps}
          onBackToOverview={() => setActivePortalTab("overview")}
          onInspectPriorityFormula={() => setCalculationPayload({ type: "priority", data: { skill_name: gapResult?.critical_gaps[0]?.skill_name || "Core Skill", gap: gapResult?.critical_gaps[0]?.gap || 35, industry_demand: 8.5, role_importance: 8.0, priority_score: ((gapResult?.critical_gaps[0]?.gap || 35) / 100) * 8.5 * 8.0, why_text: "Skills are ranked by ROI = (Gap / 100) × Demand × Criticality to optimize placement return per study hour." } })}
          onViewTimeline={(skillName, estimatedHours, priorityTier) => setTimelineModalData({ skillName, estimatedHours, priorityTier })}
        />
      )}

      {activePortalTab === "specializations" && (
        <RolesCatalogView
          roleSearchQuery={roleSearchQuery} setRoleSearchQuery={setRoleSearchQuery}
          selectedDomainFilter={selectedDomainFilter} setSelectedDomainFilter={setSelectedDomainFilter}
          specializedRecommendations={specializedRecommendations} onBackToOverview={() => setActivePortalTab("overview")}
          onSelectRole={(slug) => { handleSelectRole(slug); setActivePortalTab("overview"); }}
        />
      )}

      {activePortalTab === "parser" && (
        <JobParserView
          selectedJobPreset={selectedJobPreset} setSelectedJobPreset={setSelectedJobPreset}
          jobMatchEvaluation={jobMatchEvaluation} onBackToOverview={() => setActivePortalTab("overview")}
        />
      )}
    </div>
  );
};
