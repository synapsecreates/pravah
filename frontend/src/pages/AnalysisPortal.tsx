// FILE: src/pages/AnalysisPortal.tsx
// PURPOSE: National Career & Skill Intelligence Terminal featuring modular sub-page navigation, gateway navigator cards, comparative simulation log table, 106-role national catalog search, and Gaussian statistical national standing.
// PHASE: 5 | DEPENDS ON: src/api/client.ts, src/data/roles_taxonomy.ts, src/components/CalculationModal.tsx, src/components/LearningTimelineModal.tsx, recharts, lucide-react | LAST TOUCHED: Phase 5

import React, { useState, useEffect, useMemo } from "react";
import {
  Calculator,
  Sliders,
  GraduationCap,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Clock,
  Briefcase,
  X,
  Target,
  Download,
  TrendingUp,
  Award,
  Zap,
  Building2,
  Globe,
  CheckCircle2,
  Layers,
  BarChart3,
  Compass,
  Calendar,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  Cpu,
  Eye,
  Play,
  RotateCcw,
  Search,
  Users,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Trash2,
  History,
  LayoutDashboard,
  MapPin,
  ListOrdered,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { ANCHOR_ROLES_DATA, calculateGaps, calculateMatch, getRoadmap, whatIfSimulate } from "../api/client";
import { ALL_106_ROLES, TaxonomyRole } from "../data/roles_taxonomy";
import type {
  GapAnalysisResult,
  MatchCalculationResult,
  RoadmapResult,
  RoleMatchSummary,
  SkillGapItem,
  StudentProfileData,
  WhatIfSimulateResult,
} from "../types/student";
import { CalculationModal, CalculationPayload } from "../components/CalculationModal";
import { LearningTimelineModal } from "../components/LearningTimelineModal";

interface AnalysisPortalProps {
  studentProfile: StudentProfileData;
  targetRole: RoleMatchSummary;
  onBackToOnboarding: () => void;
  onSwitchTargetRole: (newRoleSlug: string) => void;
}

// Preset real-world job postings for the Live Job Description Parser
interface JobPreset {
  id: string;
  title: string;
  company: string;
  type: string;
  skills: { name: string; required: boolean; weight: number }[];
  description: string;
}

const JOB_PRESETS: JobPreset[] = [
  {
    id: "ai-ml",
    title: "Senior AI/ML & LLM Applications Engineer",
    company: "NexusAI Global · Bengaluru / Remote",
    type: "₹24 - ₹38 LPA · Full-time",
    skills: [
      { name: "Python", required: true, weight: 1.0 },
      { name: "PyTorch", required: true, weight: 0.9 },
      { name: "Machine Learning", required: true, weight: 0.9 },
      { name: "Deep Learning", required: true, weight: 0.8 },
      { name: "Transformers / LLMs", required: false, weight: 0.7 },
      { name: "Docker", required: false, weight: 0.6 },
      { name: "SQL", required: false, weight: 0.5 },
    ],
    description:
      "Seeking an applied ML engineer to design high-throughput inference microservices, fine-tune transformer models, and deploy containerized AI pipelines.",
  },
  {
    id: "frontend",
    title: "Lead Frontend & Web Applications Engineer",
    company: "StripeTech Solutions · Hyderabad / Hybrid",
    type: "₹18 - ₹28 LPA · Full-time",
    skills: [
      { name: "React", required: true, weight: 1.0 },
      { name: "TypeScript", required: true, weight: 0.9 },
      { name: "JavaScript", required: true, weight: 0.9 },
      { name: "HTML/CSS", required: true, weight: 0.8 },
      { name: "Tailwind CSS", required: false, weight: 0.7 },
      { name: "REST APIs", required: false, weight: 0.6 },
      { name: "Git", required: false, weight: 0.5 },
    ],
    description:
      "Architect responsive, high-performance web dashboards with strict accessibility, atomic component architecture, and automated end-to-end testing.",
  },
  {
    id: "backend",
    title: "Senior Backend Systems & Distributed Engineer",
    company: "DataCore Infrastructure · Pune / On-site",
    type: "₹20 - ₹32 LPA · Full-time",
    skills: [
      { name: "Python", required: true, weight: 0.9 },
      { name: "SQL", required: true, weight: 1.0 },
      { name: "PostgreSQL", required: true, weight: 0.8 },
      { name: "REST APIs", required: true, weight: 0.9 },
      { name: "System Design", required: true, weight: 0.9 },
      { name: "Docker", required: false, weight: 0.7 },
      { name: "Linux", required: false, weight: 0.6 },
    ],
    description:
      "Design fault-tolerant microservices, relational schemas with ACID guarantees, rate-limiting reverse proxies, and asynchronous event streams.",
  },
  {
    id: "devops",
    title: "Cloud & DevOps Infrastructure Engineer",
    company: "CloudScale Systems · Gurugram / Hybrid",
    type: "₹22 - ₹35 LPA · Full-time",
    skills: [
      { name: "Docker", required: true, weight: 1.0 },
      { name: "Kubernetes", required: true, weight: 0.9 },
      { name: "AWS", required: true, weight: 0.9 },
      { name: "CI/CD Pipelines", required: true, weight: 0.8 },
      { name: "Linux", required: true, weight: 0.8 },
      { name: "Python", required: false, weight: 0.6 },
      { name: "Git", required: false, weight: 0.5 },
    ],
    description:
      "Automate multi-region cloud infrastructure using IaC, configure zero-downtime Kubernetes deployments, and enforce cloud governance policies.",
  },
];

// Helper: Gaussian Cumulative Distribution Function Φ(z)
function gaussianCDF(z: number): number {
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014337 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1.0 - p;
  return p;
}

// Custom tooltip for Recharts Dual-Bar chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const requiredVal = payload.find((p: any) => p.dataKey === "Required")?.value || 0;
    const currentVal = payload.find((p: any) => p.dataKey === "Current")?.value || 0;
    const gapVal = Math.max(0, requiredVal - currentVal);

    return (
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "8px",
          padding: "10px 14px",
          boxShadow: "var(--shadow-hover)",
          fontSize: "12px",
          color: "var(--text-primary)",
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
            marginTop: "6px",
            paddingTop: "6px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
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

// Interface for recording comparative skill bump experiments
export interface BumpLogEntry {
  id: string;
  experimentNumber: number;
  skill: string;
  baselineLevel: number;
  bumpedLevel: number;
  gain: number;
  simulatedScore: number;
  baselineScore: number;
  timestamp: string;
}

// Master Analysis Portal Component
export const AnalysisPortal: React.FC<AnalysisPortalProps> = ({
  studentProfile,
  targetRole: propTargetRole,
  onBackToOnboarding,
  onSwitchTargetRole,
}) => {
  // Navigation State: "overview" (Main Deck) | "roadmap" (Action Plan) | "specializations" (106 Roles) | "parser" (Job Matcher)
  const [activePortalTab, setActivePortalTab] = useState<"overview" | "roadmap" | "specializations" | "parser">("overview");

  // Local active target role state to ensure zero UI desynchronization
  const [activeRole, setActiveRole] = useState<RoleMatchSummary>(propTargetRole);

  // Keep local active role in sync when prop changes
  useEffect(() => {
    setActiveRole(propTargetRole);
  }, [propTargetRole]);

  const [matchResult, setMatchResult] = useState<MatchCalculationResult | null>(null);
  const [gapResult, setGapResult] = useState<GapAnalysisResult | null>(null);
  const [roadmapResult, setRoadmapResult] = useState<RoadmapResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state for gaps list in the roadmap page
  const [gapFilter, setGapFilter] = useState<"all" | "critical" | "core" | "supporting" | "strengths">("all");

  // Transparency Modal state
  const [calculationPayload, setCalculationPayload] = useState<CalculationPayload | null>(null);

  // Learning Timeline Modal state
  const [timelineModalData, setTimelineModalData] = useState<{
    skillName: string;
    estimatedHours: number;
    priorityTier?: string;
  } | null>(null);

  // Target Role Switcher Drawer state & Search / Filter across 106 roles
  const [showOtherRoles, setShowOtherRoles] = useState<boolean>(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState<string>("");
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>("all");

  // Radar chart interpretation helper modal/drawer toggle
  const [showRadarGuide, setShowRadarGuide] = useState<boolean>(false);

  // Active Tool state in Section 04: "simulator" | "parser"
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<"simulator" | "parser">("simulator");

  // What-If Simulator state
  const [selectedSkillToBump, setSelectedSkillToBump] = useState<string>("Python");
  const [bumpValue, setBumpValue] = useState<number>(85);
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulateResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Comparative Simulation History Log state
  const [bumpHistory, setBumpHistory] = useState<BumpLogEntry[]>([]);

  // Job Description Parser state
  const [selectedJobPreset, setSelectedJobPreset] = useState<string>("ai-ml");

  // Export notification state
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Switch role handler updating local state and calling parent callback
  const handleSelectRole = (newSlug: string) => {
    const found = ALL_106_ROLES.find((r) => r.slug === newSlug) || ANCHOR_ROLES_DATA.find((r) => r.slug === newSlug);
    if (found) {
      const updatedRole: RoleMatchSummary = {
        role_id: (found as any).id || (found as any).role_id || found.slug,
        slug: found.slug,
        title: found.title,
        domain: found.domain,
        match_percentage: 0,
        industry_demand: found.industry_demand,
        primary_focus: found.primary_focus || (found as any).description || "",
        why_match_rationale: "Selected benchmark target from national catalog",
      };
      setActiveRole(updatedRole);
    }
    onSwitchTargetRole(newSlug);
    setShowOtherRoles(false);
  };

  // Load calculations on mount and role change
  useEffect(() => {
    let isMounted = true;
    const runAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [match, gaps, roadmap] = await Promise.all([
          calculateMatch(activeRole.slug, studentProfile.skills, studentProfile.degree_field),
          calculateGaps(activeRole.slug, studentProfile.skills, studentProfile.degree_field),
          getRoadmap(activeRole.slug, studentProfile.skills, studentProfile.degree_field),
        ]);
        if (isMounted) {
          setMatchResult(match);
          setGapResult(gaps);
          setRoadmapResult(roadmap);

          const skillKeys = Object.keys(studentProfile.skills);
          if (skillKeys.length > 0) {
            setSelectedSkillToBump(skillKeys[0]);
            setBumpValue(Math.min(100, (studentProfile.skills[skillKeys[0]] || 50) + 25));
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to compute intelligence calculation.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    runAnalysis();
    return () => {
      isMounted = false;
    };
  }, [activeRole.slug, studentProfile]);

  // Execute live simulation and log to comparative history
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await whatIfSimulate(
        activeRole.slug,
        studentProfile.skills,
        selectedSkillToBump,
        bumpValue,
        studentProfile.degree_field
      );
      setSimulationResult(res);

      // Record this attempt in the persistent comparative simulation history table
      const newEntry: BumpLogEntry = {
        id: `${Date.now()}-${selectedSkillToBump}-${bumpValue}`,
        experimentNumber: bumpHistory.length + 1,
        skill: selectedSkillToBump,
        baselineLevel: studentProfile.skills[selectedSkillToBump] || 0,
        bumpedLevel: bumpValue,
        gain: res.projected_gain,
        simulatedScore: res.simulated_score,
        baselineScore: matchResult?.final_readiness_score || 0,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setBumpHistory((prev) => [newEntry, ...prev]);
    } catch {
      // handled
    } finally {
      setIsSimulating(false);
    }
  };

  // Re-apply a logged experiment back into the active simulator controls
  const handleReapplyExperiment = (entry: BumpLogEntry) => {
    setSelectedSkillToBump(entry.skill);
    setBumpValue(entry.bumpedLevel);
  };

  // Remove a single experiment from log
  const handleRemoveExperiment = (id: string) => {
    setBumpHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all experiment history
  const handleClearHistory = () => {
    setBumpHistory([]);
  };

  // Identify highest ROI experiment in the history
  const bestExperiment = useMemo(() => {
    if (bumpHistory.length === 0) return null;
    return [...bumpHistory].sort((a, b) => b.gain - a.gain)[0];
  }, [bumpHistory]);

  // Export summary
  const handleExportSummary = () => {
    setExportNotice("Executive Brief Prepared · Opening System Print Dialog...");
    setTimeout(() => {
      window.print();
      setExportNotice(null);
    }, 400);
  };

  // 106 Roles Filtering & Search
  const filteredTaxonomyRoles = useMemo(() => {
    const q = roleSearchQuery.toLowerCase().trim();
    return ALL_106_ROLES.filter((role) => {
      if (role.slug === activeRole.slug) return false;
      const matchesDomain =
        selectedDomainFilter === "all" ||
        role.domain.toLowerCase().includes(selectedDomainFilter.toLowerCase());
      const matchesQuery =
        !q ||
        role.title.toLowerCase().includes(q) ||
        role.domain.toLowerCase().includes(q) ||
        role.skills.some((s) => s.name.toLowerCase().includes(q));
      return matchesDomain && matchesQuery;
    });
  }, [roleSearchQuery, selectedDomainFilter, activeRole.slug]);

  // Specialized Adjacent Role Recommendations from the 106-role database
  const specializedRecommendations = useMemo(() => {
    const studentRatings = studentProfile.skills;
    const candidates = ALL_106_ROLES.filter(
      (r) => !r.is_anchor_role && r.slug !== activeRole.slug
    );

    const scored = candidates.map((role) => {
      let totalReq = 0;
      let earnedReq = 0;
      const alignedSkills: string[] = [];

      for (const s of role.skills) {
        const studentLvl = studentRatings[s.name] || 0;
        const wt = s.importance_weight || 8.0;
        totalReq += s.required_level * wt;
        earnedReq += Math.min(studentLvl, s.required_level) * wt;

        if (studentLvl >= s.required_level * 0.65) {
          alignedSkills.push(s.name);
        }
      }

      const matchPct = totalReq > 0 ? Math.round((earnedReq / totalReq) * 100) : 50;
      return {
        ...role,
        matchPct,
        alignedSkills,
      };
    });

    scored.sort((a, b) => b.matchPct - a.matchPct || b.industry_demand - a.industry_demand);
    return scored.slice(0, 6);
  }, [studentProfile.skills, activeRole.slug]);

  if (isLoading) {
    return (
      <div style={{ maxWidth: "1520px", margin: "80px auto", textAlign: "center", padding: "40px" }}>
        <Sparkles size={36} color="var(--brand-600)" style={{ animation: "spin 1s linear infinite", marginBottom: "16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          Executing Deterministic Intelligence Engine...
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px" }}>
          Benchmarking candidate proficiencies for {activeRole.title} across national occupational standards.
        </p>
      </div>
    );
  }

  if (error || !matchResult) {
    return (
      <div style={{ maxWidth: "680px", margin: "80px auto", textAlign: "center", padding: "36px", backgroundColor: "var(--bg-surface)", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
        <AlertTriangle size={36} color="var(--danger)" style={{ marginBottom: "16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Intelligence Calculation Interrupted</h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>{error}</p>
        <button
          type="button"
          onClick={onBackToOnboarding}
          className="interactive-btn"
          style={{ padding: "10px 22px", borderRadius: "8px", backgroundColor: "var(--brand-600)", color: "var(--bg-base)", border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          Return to Onboarding
        </button>
      </div>
    );
  }

  // Bar chart data preparation
  const barChartData = [
    ...(gapResult?.critical_gaps || []),
    ...(gapResult?.core_gaps || []),
    ...(gapResult?.supporting_gaps || []),
    ...(gapResult?.strengths || []),
  ].map((item) => ({
    name: item.skill_name,
    Required: item.required_level,
    Current: item.student_level,
    tier: item.tier_category,
    gap: item.gap,
  }));

  // 6-Domain radar competencies calculation
  const domainRadarData = [
    {
      domain: "Frontend",
      Student: Math.round(((studentProfile.skills["React"] || 40) + (studentProfile.skills["TypeScript"] || 30) + (studentProfile.skills["HTML/CSS"] || 50)) / 3),
      Industry: 75,
    },
    {
      domain: "Backend",
      Student: Math.round(((studentProfile.skills["Python"] || 60) + (studentProfile.skills["SQL"] || 50) + (studentProfile.skills["REST APIs"] || 40)) / 3),
      Industry: 80,
    },
    {
      domain: "DevOps",
      Student: Math.round(((studentProfile.skills["Docker"] || 30) + (studentProfile.skills["Git"] || 60) + (studentProfile.skills["CI/CD"] || 25)) / 3),
      Industry: 70,
    },
    {
      domain: "AI / ML",
      Student: Math.round(((studentProfile.skills["Machine Learning"] || 40) + (studentProfile.skills["PyTorch"] || 30) + (studentProfile.skills["Deep Learning"] || 20)) / 3),
      Industry: 75,
    },
    {
      domain: "Data Eng.",
      Student: Math.round(((studentProfile.skills["Pandas"] || 50) + (studentProfile.skills["SQL"] || 50) + (studentProfile.skills["NumPy"] || 45)) / 3),
      Industry: 75,
    },
    {
      domain: "Security",
      Student: Math.round(((studentProfile.skills["Authentication"] || 45) + (studentProfile.skills["API Security"] || 35)) / 2) || 40,
      Industry: 70,
    },
  ];

  // Filtered gaps list for the roadmap page
  const filteredGaps: SkillGapItem[] = (() => {
    if (!gapResult) return [];
    switch (gapFilter) {
      case "critical":
        return gapResult.critical_gaps;
      case "core":
        return gapResult.core_gaps;
      case "supporting":
        return gapResult.supporting_gaps;
      case "strengths":
        return gapResult.strengths;
      default:
        return [
          ...gapResult.critical_gaps,
          ...gapResult.core_gaps,
          ...gapResult.supporting_gaps,
          ...gapResult.strengths,
        ];
    }
  })();

  // Job description matching evaluation
  const activePreset = JOB_PRESETS.find((p) => p.id === selectedJobPreset) || JOB_PRESETS[0];
  const jobMatchEvaluation = (() => {
    let totalWeight = 0;
    let earnedWeight = 0;
    const skillsStatus = activePreset.skills.map((s) => {
      const studentLvl = studentProfile.skills[s.name] || 0;
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
    return { matchScore, skillsStatus };
  })();

  const readinessScore = matchResult.final_readiness_score;
  const rawScore = matchResult.raw_match_score;
  const isHighReadiness = readinessScore >= 75;
  const isModerateReadiness = readinessScore >= 50 && readinessScore < 75;

  // Gaussian Statistical Standing calculation
  const nationalMean = 48.2;
  const nationalStd = 16.4;
  const zScore = (readinessScore - nationalMean) / nationalStd;
  const percentileStanding = Math.min(99.8, Math.max(0.5, gaussianCDF(zScore) * 100));

  const placementTierInfo = (() => {
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
  })();

  // Calculate total roadmap estimated hours
  const totalRoadmapHours = (gapResult?.critical_gaps || []).reduce(
    (acc, item) => acc + Math.max(15, Math.round(item.gap * 0.8)),
    0
  ) + (gapResult?.core_gaps || []).reduce(
    (acc, item) => acc + Math.max(15, Math.round(item.gap * 0.8)),
    0
  );

  return (
    <div
      style={{
        maxWidth: "1520px",
        margin: "0 auto",
        padding: "24px 20px 60px 20px",
        color: "var(--text-primary)",
      }}
    >
      {/* Modals */}
      <CalculationModal payload={calculationPayload} onClose={() => setCalculationPayload(null)} />
      {timelineModalData && (
        <LearningTimelineModal
          skillName={timelineModalData.skillName}
          estimatedHours={timelineModalData.estimatedHours}
          priorityTier={timelineModalData.priorityTier}
          onClose={() => setTimelineModalData(null)}
        />
      )}

      {/* Top Banner Notice for Export */}
      {exportNotice && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: "var(--brand-600)",
            color: "var(--bg-base)",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: 700,
            boxShadow: "var(--shadow-hover)",
          }}
        >
          {exportNotice}
        </div>
      )}

      {/* ========================================================= */}
      {/* EXECUTIVE COMMAND HEADER WITH SUB-PAGE NAVIGATION TABS     */}
      {/* ========================================================= */}
      <header
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "24px",
          boxShadow: "var(--shadow-elevation)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Candidate Bio & Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                backgroundColor: "var(--brand-50)",
                border: "2px solid var(--brand-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--brand-600)",
                fontWeight: 800,
                fontSize: "20px",
                fontFamily: "monospace",
              }}
            >
              DS
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  {studentProfile.full_name}
                </h1>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 8px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 700,
                    backgroundColor: "var(--success-bg)",
                    color: "var(--success)",
                    border: "1px solid var(--success)",
                  }}
                >
                  <ShieldCheck size={13} />
                  Verified Candidate
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 8px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: "var(--bg-sunken)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <Building2 size={13} />
                  {studentProfile.institution_name}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 8px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 700,
                    backgroundColor: "var(--brand-50)",
                    color: "var(--brand-600)",
                    border: "1px solid var(--brand-600)",
                  }}
                >
                  <Target size={12} />
                  Target: {activeRole.title}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px", fontSize: "12px", color: "var(--text-muted)", flexWrap: "wrap" }}>
                <span>{studentProfile.degree_field}</span>
                <span>•</span>
                <span>Pre-final Year (Sem VI)</span>
                <span>•</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--brand-600)" }}>
                  <Globe size={12} />
                  Pan-India Placement Open
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() =>
                setCalculationPayload({
                  type: "readiness",
                  data: {
                    role_title: activeRole.title,
                    readiness_score: matchResult.final_readiness_score,
                    composite_match: rawScore,
                    education_factor: matchResult.education_factor,
                    degree_field: studentProfile.degree_field,
                  },
                })
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-strong)",
                backgroundColor: "var(--bg-sunken)",
                color: "var(--brand-600)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Calculator size={14} />
              <span>Inspect Math Proof</span>
            </button>

            <button
              type="button"
              onClick={handleExportSummary}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-strong)",
                backgroundColor: "var(--bg-sunken)",
                color: "var(--text-primary)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Download size={14} />
              <span>Export PDF Brief</span>
            </button>

            <button
              type="button"
              onClick={onBackToOnboarding}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "transparent",
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={14} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Modular Sub-Page Navigation Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "14px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => setActivePortalTab("overview")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              border: activePortalTab === "overview" ? "1px solid var(--brand-600)" : "1px solid transparent",
              backgroundColor: activePortalTab === "overview" ? "var(--brand-50)" : "transparent",
              color: activePortalTab === "overview" ? "var(--brand-600)" : "var(--text-secondary)",
            }}
          >
            <LayoutDashboard size={16} />
            <span>Executive Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalTab("roadmap")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              border: activePortalTab === "roadmap" ? "1px solid var(--brand-600)" : "1px solid transparent",
              backgroundColor: activePortalTab === "roadmap" ? "var(--brand-50)" : "transparent",
              color: activePortalTab === "roadmap" ? "var(--brand-600)" : "var(--text-secondary)",
            }}
          >
            <Calendar size={16} />
            <span>Learning Action Plan & Courseware</span>
            <span
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "10px",
                backgroundColor: activePortalTab === "roadmap" ? "var(--brand-600)" : "var(--bg-sunken)",
                color: activePortalTab === "roadmap" ? "var(--bg-base)" : "var(--text-muted)",
              }}
            >
              {(gapResult?.critical_gaps.length || 0) + (gapResult?.core_gaps.length || 0)} Actions
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalTab("specializations")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              border: activePortalTab === "specializations" ? "1px solid var(--brand-600)" : "1px solid transparent",
              backgroundColor: activePortalTab === "specializations" ? "var(--brand-50)" : "transparent",
              color: activePortalTab === "specializations" ? "var(--brand-600)" : "var(--text-secondary)",
            }}
          >
            <Compass size={16} />
            <span>Specialized Roles & Pathways</span>
            <span
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "10px",
                backgroundColor: activePortalTab === "specializations" ? "var(--brand-600)" : "var(--bg-sunken)",
                color: activePortalTab === "specializations" ? "var(--bg-base)" : "var(--text-muted)",
              }}
            >
              106 Roles
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalTab("parser")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              border: activePortalTab === "parser" ? "1px solid var(--brand-600)" : "1px solid transparent",
              backgroundColor: activePortalTab === "parser" ? "var(--brand-50)" : "transparent",
              color: activePortalTab === "parser" ? "var(--brand-600)" : "var(--text-secondary)",
            }}
          >
            <Cpu size={16} />
            <span>Job Description Matcher</span>
            <span
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "10px",
                backgroundColor: activePortalTab === "parser" ? "var(--brand-600)" : "var(--bg-sunken)",
                color: activePortalTab === "parser" ? "var(--bg-base)" : "var(--text-muted)",
              }}
            >
              ATS Match
            </span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* VIEW 1: EXECUTIVE OVERVIEW DASHBOARD (BALANCED 2-COLUMN)   */}
      {/* ========================================================= */}
      {activePortalTab === "overview" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* MAIN COLUMN (LEFT): BALANCED 4 SECTIONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", minWidth: 0, gridColumn: "span 2" }}>
            {/* ----------------------------------------------------- */}
            {/* SECTION 01: EXECUTIVE DIAGNOSTIC & KEY METRICS         */}
            {/* ----------------------------------------------------- */}
            <section
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-elevation)",
              }}
            >
              {/* Guide Banner */}
              <div style={{ marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      fontFamily: "monospace",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      border: "1px solid var(--brand-600)",
                    }}
                  >
                    SECTION 01
                  </span>
                  <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Executive Diagnostic & Placement Metrics
                  </h2>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
                  <strong style={{ color: "var(--text-primary)" }}>What this shows: </strong>
                  High-level placement readiness, direct skill alignment, degree multipliers, and critical deficits for{" "}
                  <strong style={{ color: "var(--brand-600)" }}>{activeRole.title}</strong>.{" "}
                  <strong style={{ color: "var(--brand-600)" }}>How to use it: </strong>
                  Click on any card below to inspect its exact deterministic formula and arithmetic proof.
                </p>
              </div>

              {/* 4 Interactive Metric Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "14px",
                }}
              >
                {/* Card 1: Target Readiness */}
                <div
                  onClick={() =>
                    setCalculationPayload({
                      type: "readiness",
                      data: {
                        role_title: activeRole.title,
                        readiness_score: matchResult.final_readiness_score,
                        composite_match: rawScore,
                        education_factor: matchResult.education_factor,
                        degree_field: studentProfile.degree_field,
                      },
                    })
                  }
                  style={{
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "12px",
                    padding: "16px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Target Readiness</span>
                    <Calculator size={15} color="var(--brand-600)" />
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: isHighReadiness ? "var(--success)" : isModerateReadiness ? "var(--warning)" : "var(--danger)", fontFamily: "monospace" }}>
                    {Math.round(readinessScore)}%
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Targeted: {activeRole.title}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--brand-600)", marginTop: "6px", fontStyle: "italic" }}>
                    Click to inspect proof →
                  </div>
                </div>

                {/* Card 2: Pre-Factor Match */}
                <div
                  onClick={() =>
                    setCalculationPayload({
                      type: "match",
                      data: {
                        role_title: activeRole.title,
                        final_score: matchResult.final_readiness_score,
                        skill_match_score: rawScore,
                        education_factor: matchResult.education_factor,
                        formula_breakdown: "Composite = 0.60(Req) + 0.25(Pref) + 0.15(Exp)",
                      },
                    })
                  }
                  style={{
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "12px",
                    padding: "16px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Pre-Factor Match</span>
                    <Sliders size={15} color="#0284c7" />
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#0284c7", fontFamily: "monospace" }}>
                    {Math.round(rawScore)}%
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Direct raw skill alignment
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--brand-600)", marginTop: "6px", fontStyle: "italic" }}>
                    Click to inspect weights →
                  </div>
                </div>

                {/* Card 3: Education Factor */}
                <div
                  onClick={() =>
                    setCalculationPayload({
                      type: "readiness",
                      data: {
                        role_title: activeRole.title,
                        readiness_score: matchResult.final_readiness_score,
                        composite_match: rawScore,
                        education_factor: matchResult.education_factor,
                        degree_field: studentProfile.degree_field,
                      },
                    })
                  }
                  style={{
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "12px",
                    padding: "16px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Education Factor</span>
                    <GraduationCap size={15} color="var(--warning)" />
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--warning)", fontFamily: "monospace" }}>
                    ×{matchResult.education_factor.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    {studentProfile.degree_field} Multiplier
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--brand-600)", marginTop: "6px", fontStyle: "italic" }}>
                    Audited via AICTE standard →
                  </div>
                </div>

                {/* Card 4: Critical Gaps */}
                <div
                  onClick={() => {
                    setGapFilter("critical");
                    setActivePortalTab("roadmap");
                  }}
                  style={{
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "12px",
                    padding: "16px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Critical Gaps</span>
                    <AlertTriangle size={15} color="var(--danger)" />
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--danger)", fontFamily: "monospace" }}>
                    {gapResult?.critical_gaps.length || 0}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Deficits &gt; 40 percentage points
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--brand-600)", marginTop: "6px", fontStyle: "italic" }}>
                    View in Action Plan →
                  </div>
                </div>
              </div>
            </section>

            {/* ----------------------------------------------------- */}
            {/* SECTION 02: VISUAL COMPETENCY & BENCHMARK DIAGNOSTICS */}
            {/* ----------------------------------------------------- */}
            <section
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-elevation)",
              }}
            >
              {/* Guide Banner */}
              <div style={{ marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      fontFamily: "monospace",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      border: "1px solid var(--brand-600)",
                    }}
                  >
                    SECTION 02
                  </span>
                  <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Visual Competency & Benchmark Diagnostics
                  </h2>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
                  <strong style={{ color: "var(--text-primary)" }}>What this shows: </strong>
                  Side-by-side skill comparison against {activeRole.title} requirements, multi-domain 6-axis radar, and Gaussian national standing.{" "}
                  <strong style={{ color: "var(--brand-600)" }}>How to use it: </strong>
                  Click any bar on the dual chart to inspect its individual gap formula, or review the radar framework guide to understand your T-shaped profile.
                </p>
              </div>

              {/* Visual Charts Layout */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Dual Bar Chart */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <BarChart3 size={16} color="var(--brand-600)" />
                      <span>Skill Repertoire vs. {activeRole.title} Benchmark Requirements</span>
                    </h3>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                      Click bar to inspect math proof
                    </span>
                  </div>

                  <div
                    style={{
                      backgroundColor: "var(--bg-sunken)",
                      borderRadius: "12px",
                      border: "1px solid var(--border-subtle)",
                      padding: "16px 12px",
                      height: "320px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{ top: 10, right: 20, left: -10, bottom: 25 }}
                        onClick={(data: any) => {
                          if (data && data.activePayload && data.activePayload.length) {
                            const item = data.activePayload[0].payload;
                            setCalculationPayload({
                              type: "gap",
                              data: {
                                skill_name: item.name,
                                required_level: item.Required,
                                student_level: item.Current,
                                gap: Math.max(0, item.Required - item.Current),
                                tier: item.tier || "Competency Gap",
                              },
                            });
                          }
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="var(--text-muted)"
                          fontSize={11}
                          tickLine={false}
                          angle={-25}
                          textAnchor="end"
                        />
                        <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} tickLine={false} />
                        <RechartsTooltip content={<CustomBarTooltip />} />
                        <Legend
                          verticalAlign="top"
                          align="right"
                          iconType="circle"
                          wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
                        />
                        <Bar dataKey="Required" fill="#0284c7" name="Industry Benchmark" radius={[4, 4, 0, 0]} cursor="pointer" />
                        <Bar dataKey="Current" fill="#10b981" name="Student Evaluated" radius={[4, 4, 0, 0]} cursor="pointer" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sub-grid: 6-Axis Radar & National Placement Standing */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                  {/* 6-Axis Competency Radar with Interpretation Guide Drawer */}
                  <div
                    style={{
                      backgroundColor: "var(--bg-sunken)",
                      borderRadius: "12px",
                      border: "1px solid var(--border-subtle)",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, margin: 0, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Compass size={15} color="var(--brand-600)" />
                        <span>Domain Competency Profile</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowRadarGuide(!showRadarGuide)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--brand-600)",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
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

                    {/* Radar Interpretation Framework Guide */}
                    {showRadarGuide && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "12px",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border-strong)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          lineHeight: "1.4",
                        }}
                      >
                        <strong style={{ color: "var(--text-primary)" }}>How to Interpret Your Radar Polygon:</strong>
                        <div>
                          • <strong>T-Shaped Profile:</strong> A balanced hexagon reflects a versatile systems generalist. A spiked polygon indicates a specialized expert (e.g. AI/ML and Data Eng heavy).
                        </div>
                        <div>
                          • <strong>Green Overlap vs Blue:</strong> Where Green extends outside Blue, you possess a <em>verified competitive moat</em>. Where Blue extends beyond Green, you have an <em>inter-disciplinary deficit</em>.
                        </div>
                        <div>
                          • <strong>Analyzed Pillars:</strong> Frontend (UI/UX), Backend (APIs/Databases), DevOps (CI/CD/Containers), AI/ML (Models/Inference), Data Eng (Pipelines/ETL), Security (Auth/Hardening).
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grounded Gaussian National Placement Standing */}
                  <div
                    style={{
                      backgroundColor: "var(--bg-sunken)",
                      borderRadius: "12px",
                      border: "1px solid var(--border-subtle)",
                      padding: "18px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                        <h4 style={{ fontSize: "13px", fontWeight: 700, margin: 0, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Award size={15} color="var(--warning)" />
                          <span>National Placement Standing & Salary Band</span>
                        </h4>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
                          AICTE NOS Standard
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "14px 0" }}>
                        {/* Circular Gauge */}
                        <div style={{ position: "relative", width: "92px", height: "92px", flexShrink: 0 }}>
                          <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-strong)" strokeWidth="9" />
                            <circle
                              cx="50"
                              cy="50"
                              r="42"
                              fill="none"
                              stroke={placementTierInfo.color}
                              strokeWidth="9"
                              strokeDasharray={264}
                              strokeDashoffset={264 - (264 * Math.min(100, percentileStanding)) / 100}
                              strokeLinecap="round"
                              style={{ transition: "stroke-dashoffset 0.8s ease" }}
                            />
                          </svg>
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "monospace",
                            }}
                          >
                            <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                              {percentileStanding.toFixed(0)}%
                            </span>
                            <span style={{ fontSize: "8px", color: "var(--text-muted)", textTransform: "uppercase" }}>Percentile</span>
                          </div>
                        </div>

                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                          <div style={{ fontWeight: 700, color: placementTierInfo.color, fontSize: "13px" }}>
                            {placementTierInfo.tier}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                            Target Hiring: {placementTierInfo.label}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--warning)", marginTop: "3px", fontWeight: 600 }}>
                            Expected CTC Band: {placementTierInfo.salary}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gaussian z-Score & Bell Curve Inspector */}
                    <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>
                        <span>Statistical Standing: <strong style={{ color: "var(--brand-600)", fontFamily: "monospace" }}>z = +{zScore.toFixed(2)}σ</strong></span>
                        <button
                          type="button"
                          onClick={() =>
                            setCalculationPayload({
                              type: "statistical",
                              data: {
                                role_title: activeRole.title,
                                readiness_score: readinessScore,
                                national_mean: nationalMean,
                                national_std: nationalStd,
                                z_score: zScore,
                                percentile: percentileStanding,
                                placement_tier: placementTierInfo.tier,
                                salary_band: placementTierInfo.salary,
                                cohort_size: "1,200,000 AICTE Engineering Candidates",
                              },
                            })
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--brand-600)",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          Inspect Statistical Proof →
                        </button>
                      </div>
                      <div style={{ height: "7px", borderRadius: "6px", backgroundColor: "var(--border-strong)", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(99.8, percentileStanding)}%`,
                            background: "var(--gradient-brand)",
                            borderRadius: "6px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ----------------------------------------------------- */}
            {/* SECTION 03: STRATEGIC GATEWAY NAVIGATOR CARDS         */}
            {/* REPLACES HUGE LISTS WITH COMPACT, BALANCED PREVIEWS   */}
            {/* ----------------------------------------------------- */}
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Gateway Card 1: Learning Action Plan */}
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "16px",
                  padding: "22px",
                  boxShadow: "var(--shadow-elevation)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          backgroundColor: "var(--brand-50)",
                          border: "1px solid var(--brand-600)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--brand-600)",
                        }}
                      >
                        <Calendar size={18} />
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                        Learning Action Plan
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: "var(--danger-bg)",
                        color: "var(--danger)",
                        border: "1px solid var(--danger)",
                      }}
                    >
                      {gapResult?.critical_gaps.length || 0} Critical Deficits
                    </span>
                  </div>

                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 14px 0", lineHeight: "1.5" }}>
                    Structured 8-week remedial roadmap with curated lectures & capstone deliverables calibrated to bridge target deficits.
                  </p>

                  {/* Quick Preview of Top 2 Gaps */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(gapResult?.critical_gaps.slice(0, 2) || []).map((gap, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "var(--bg-sunken)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "11px",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{gap.skill_name}</span>
                        <span style={{ color: "var(--danger)", fontWeight: 700, fontFamily: "monospace" }}>
                          Deficit -{gap.gap}%
                        </span>
                      </div>
                    ))}
                    {gapResult?.critical_gaps.length === 0 && (
                      <div style={{ fontSize: "11px", color: "var(--success)", padding: "4px 0" }}>
                        ✓ All required core competencies meet industry baseline!
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Total Plan: <strong>~{totalRoadmapHours} hrs</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePortalTab("roadmap")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      backgroundColor: "var(--brand-600)",
                      color: "var(--bg-base)",
                      fontWeight: 700,
                      fontSize: "12px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span>Open Full Action Plan</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Gateway Card 2: Specialized Career Pathways */}
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "16px",
                  padding: "22px",
                  boxShadow: "var(--shadow-elevation)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          backgroundColor: "var(--brand-50)",
                          border: "1px solid var(--brand-600)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--brand-600)",
                        }}
                      >
                        <Compass size={18} />
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                        Specialized Roles & Pathways
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: "var(--brand-50)",
                        color: "var(--brand-600)",
                        border: "1px solid var(--brand-600)",
                      }}
                    >
                      106 Catalog
                    </span>
                  </div>

                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 14px 0", lineHeight: "1.5" }}>
                    Discovered high-demand engineering careers from our national catalog matching your existing skill fingerprint.
                  </p>

                  {/* Quick Preview of Top 2 Roles */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {specializedRecommendations.slice(0, 2).map((role) => (
                      <div
                        key={role.slug}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "var(--bg-sunken)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "11px",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{role.title}</div>
                          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{role.domain}</div>
                        </div>
                        <span style={{ color: "var(--success)", fontWeight: 700, fontFamily: "monospace" }}>
                          {role.matchPct}% Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    6 High-Match Roles
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePortalTab("specializations")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      backgroundColor: "var(--brand-600)",
                      color: "var(--bg-base)",
                      fontWeight: 700,
                      fontSize: "12px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span>Explore All 106 Roles</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* ----------------------------------------------------- */}
            {/* SECTION 04: INTERACTIVE INTELLIGENCE TOOLS            */}
            {/* LIVE SKILL BUMP WITH COMPARATIVE LOG TABLE            */}
            {/* ----------------------------------------------------- */}
            <section
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-elevation)",
              }}
            >
              {/* Guide Banner */}
              <div style={{ marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      fontFamily: "monospace",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      border: "1px solid var(--brand-600)",
                    }}
                  >
                    SECTION 04
                  </span>
                  <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Live Skill Bump Simulator & Comparative Experiment Log
                  </h2>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
                  <strong style={{ color: "var(--text-primary)" }}>What this shows: </strong>
                  Hypothetical &quot;what-if&quot; placement score projections with side-by-side comparative logging.{" "}
                  <strong style={{ color: "var(--brand-600)" }}>How to use it: </strong>
                  Select a deficit skill, adjust the target proficiency slider, and click &quot;Calculate Score Bump&quot;. Every attempt is recorded in the comparative table below so you can determine which skill yields the highest placement ROI.
                </p>
              </div>

              {/* Simulator Controls Deck */}
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "end" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                      Select Deficit Skill to Upgrade:
                    </label>
                    <select
                      value={selectedSkillToBump}
                      onChange={(e) => {
                        setSelectedSkillToBump(e.target.value);
                        setBumpValue(Math.min(100, (studentProfile.skills[e.target.value] || 50) + 25));
                        setSimulationResult(null);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        backgroundColor: "var(--bg-sunken)",
                        border: "1px solid var(--border-strong)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        fontSize: "13px",
                      }}
                    >
                      {Object.keys(studentProfile.skills).map((skill) => (
                        <option key={skill} value={skill}>
                          {skill} (Current: {studentProfile.skills[skill]}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Target Proficiency Level:</span>
                      <strong style={{ color: "var(--brand-600)", fontFamily: "monospace" }}>{bumpValue}%</strong>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={bumpValue}
                      onChange={(e) => {
                        setBumpValue(Number(e.target.value));
                        setSimulationResult(null);
                      }}
                      style={{ width: "100%", cursor: "pointer", accentColor: "var(--brand-600)" }}
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleRunSimulation}
                      disabled={isSimulating}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        backgroundColor: "var(--brand-600)",
                        color: "var(--bg-base)",
                        border: "none",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Sparkles size={15} />
                      <span>{isSimulating ? "Simulating..." : "Calculate Score Bump"}</span>
                    </button>
                  </div>
                </div>

                {/* Simulation Result Projection Box */}
                {simulationResult && (
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      backgroundColor: "var(--bg-sunken)",
                      border: "1px solid var(--brand-600)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                        Active Simulation Result for {activeRole.title}
                      </div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                        Elevating {selectedSkillToBump} to {bumpValue}% yields{" "}
                        <span style={{ color: "var(--success)" }}>
                          +{simulationResult.projected_gain.toFixed(2)}% Score Gain
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                        Projected New Readiness:{" "}
                        <strong style={{ color: "var(--brand-600)", fontFamily: "monospace" }}>
                          {Math.round(simulationResult.simulated_score)}%
                        </strong>{" "}
                        (Baseline: {Math.round(readinessScore)}%) · Recorded in comparison log below.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setTimelineModalData({
                          skillName: selectedSkillToBump,
                          estimatedHours: Math.max(20, Math.round((bumpValue - (studentProfile.skills[selectedSkillToBump] || 0)) * 1.2)),
                          priorityTier: "Simulated Target",
                        })
                      }
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        backgroundColor: "var(--brand-50)",
                        border: "1px solid var(--brand-600)",
                        color: "var(--brand-600)",
                        fontWeight: 700,
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      View Learning Timeline for {selectedSkillToBump} →
                    </button>
                  </div>
                )}

                {/* COMPARATIVE SIMULATION LOG TABLE */}
                <div style={{ marginTop: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <History size={16} color="var(--brand-600)" />
                      <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                        Comparative What-If Experiment Log ({bumpHistory.length})
                      </h4>
                    </div>

                    {bumpHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearHistory}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Clear History</span>
                      </button>
                    )}
                  </div>

                  {/* Highest ROI Callout Banner */}
                  {bestExperiment && bumpHistory.length >= 2 && (
                    <div
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "var(--success-bg)",
                        border: "1px solid var(--success)",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Zap size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                      <span>
                        <strong style={{ color: "var(--success)" }}>Highest ROI Finding: </strong>
                        Elevating <strong>{bestExperiment.skill}</strong> to <strong>{bestExperiment.bumpedLevel}%</strong> produces the greatest acceleration (
                        <strong>+{bestExperiment.gain.toFixed(2)}%</strong>) among all tested hypotheses.
                      </span>
                    </div>
                  )}

                  {/* History Table */}
                  {bumpHistory.length > 0 ? (
                    <div style={{ overflowX: "auto", border: "1px solid var(--border-strong)", borderRadius: "10px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                        <thead>
                          <tr style={{ backgroundColor: "var(--bg-sunken)", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                            <th style={{ padding: "10px 14px", fontWeight: 600, width: "60px" }}>#</th>
                            <th style={{ padding: "10px 14px", fontWeight: 600 }}>Target Skill</th>
                            <th style={{ padding: "10px 14px", fontWeight: 600 }}>Shift Range</th>
                            <th style={{ padding: "10px 14px", fontWeight: 600 }}>Score Gain</th>
                            <th style={{ padding: "10px 14px", fontWeight: 600 }}>Simulated Score</th>
                            <th style={{ padding: "10px 14px", fontWeight: 600 }}>Time</th>
                            <th style={{ padding: "10px 14px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bumpHistory.map((entry) => {
                            const isBest = bestExperiment?.id === entry.id && bumpHistory.length >= 2;
                            return (
                              <tr
                                key={entry.id}
                                style={{
                                  borderBottom: "1px solid var(--border-subtle)",
                                  backgroundColor: isBest ? "var(--bg-surface)" : "transparent",
                                }}
                              >
                                <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                                  #{entry.experimentNumber}
                                </td>
                                <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--text-primary)" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span>{entry.skill}</span>
                                    {isBest && (
                                      <span
                                        style={{
                                          fontSize: "9px",
                                          padding: "1px 5px",
                                          borderRadius: "4px",
                                          backgroundColor: "var(--success-bg)",
                                          color: "var(--success)",
                                          fontWeight: 700,
                                        }}
                                      >
                                        BEST ROI
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "var(--text-secondary)" }}>
                                  <span>{entry.baselineLevel}%</span>
                                  <span style={{ color: "var(--brand-600)", margin: "0 6px" }}>→</span>
                                  <strong style={{ color: "var(--text-primary)" }}>{entry.bumpedLevel}%</strong>
                                  <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "6px" }}>
                                    (+{entry.bumpedLevel - entry.baselineLevel}%)
                                  </span>
                                </td>
                                <td style={{ padding: "10px 14px" }}>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      padding: "2px 8px",
                                      borderRadius: "6px",
                                      fontWeight: 700,
                                      fontFamily: "monospace",
                                      backgroundColor: "var(--success-bg)",
                                      color: "var(--success)",
                                      border: "1px solid var(--success)",
                                    }}
                                  >
                                    +{entry.gain.toFixed(2)}%
                                  </span>
                                </td>
                                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--brand-600)" }}>
                                  {Math.round(entry.simulatedScore)}%
                                </td>
                                <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontSize: "11px" }}>
                                  {entry.timestamp}
                                </td>
                                <td style={{ padding: "10px 14px", textAlign: "right" }}>
                                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                    <button
                                      type="button"
                                      onClick={() => handleReapplyExperiment(entry)}
                                      style={{
                                        background: "none",
                                        border: "1px solid var(--border-subtle)",
                                        borderRadius: "6px",
                                        padding: "4px 8px",
                                        color: "var(--brand-600)",
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                      }}
                                    >
                                      Re-test
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveExperiment(entry.id)}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        color: "var(--text-muted)",
                                        cursor: "pointer",
                                        padding: "4px",
                                      }}
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        backgroundColor: "var(--bg-sunken)",
                        borderRadius: "10px",
                        border: "1px dashed var(--border-subtle)",
                        color: "var(--text-muted)",
                        fontSize: "12px",
                      }}
                    >
                      No simulation experiments logged yet. Adjust the proficiency slider above and click &quot;Calculate Score Bump&quot; to test and compare multiple upskilling hypotheses.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT DOCK (STICKY): TARGET BENCHMARK & 106-ROLE SEARCH */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", minWidth: "320px" }}>
            {/* Target Role Benchmark Card */}
            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "var(--shadow-elevation)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Target Role Benchmark
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
                    Active Benchmark
                  </span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  {activeRole.title}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0", lineHeight: "1.4" }}>
                  {activeRole.primary_focus || activeRole.why_match_rationale}
                </p>
              </div>

              {/* Collapsible Switch Target Role Drawer with Search & Domain Filters */}
              <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                <button
                  type="button"
                  onClick={() => setShowOtherRoles(!showOtherRoles)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <span>Switch Benchmark Target (106 National Roles)</span>
                  {showOtherRoles ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showOtherRoles && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "12px",
                      maxHeight: "440px",
                      overflowY: "auto",
                      paddingRight: "4px",
                    }}
                  >
                    {/* Search Input */}
                    <div style={{ position: "relative" }}>
                      <Search size={14} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "10px" }} />
                      <input
                        type="text"
                        placeholder="Search across 106 roles (e.g. MLOps, Cloud, Vision)..."
                        value={roleSearchQuery}
                        onChange={(e) => setRoleSearchQuery(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px 8px 30px",
                          backgroundColor: "var(--bg-sunken)",
                          border: "1px solid var(--border-strong)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    {/* Domain Filter Pills */}
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {[
                        { key: "all", label: "All (106)" },
                        { key: "ai", label: "AI & ML" },
                        { key: "data", label: "Data" },
                        { key: "cloud", label: "Cloud" },
                        { key: "software", label: "Software" },
                        { key: "security", label: "Security" },
                        { key: "mobile", label: "Mobile" },
                      ].map((d) => (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => setSelectedDomainFilter(d.key)}
                          style={{
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: selectedDomainFilter === d.key ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                            backgroundColor: selectedDomainFilter === d.key ? "var(--brand-50)" : "var(--bg-sunken)",
                            color: selectedDomainFilter === d.key ? "var(--brand-600)" : "var(--text-secondary)",
                          }}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>

                    {/* List of Filtered Roles */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {filteredTaxonomyRoles.slice(0, 30).map((role) => (
                        <div
                          key={role.slug}
                          onClick={() => handleSelectRole(role.slug)}
                          style={{
                            padding: "10px 12px",
                            backgroundColor: "var(--bg-sunken)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            transition: "border-color 0.15s ease",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                              {role.title}
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                              {role.domain} · Demand: {role.industry_demand.toFixed(1)}/10
                            </div>
                          </div>
                          <span style={{ fontSize: "11px", color: "var(--brand-600)", fontWeight: 700 }}>
                            Select →
                          </span>
                        </div>
                      ))}
                      {filteredTaxonomyRoles.length > 30 && (
                        <div style={{ textAlign: "center", fontSize: "10px", color: "var(--text-muted)", padding: "4px" }}>
                          Showing top 30 of {filteredTaxonomyRoles.length} matching roles. Refine search query for more.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Executive Strategic Narrative Brief */}
            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "var(--shadow-elevation)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} color="var(--brand-600)" />
                <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Executive Strategic Brief
                </h4>
              </div>

              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                <strong style={{ color: "var(--text-primary)" }}>Placement Trajectory: </strong>
                {readinessScore >= 75
                  ? `Candidate is in prime hiring tier for ${activeRole.title}. Verified core competencies exceed minimum threshold for direct placement shortlisting.`
                  : `Candidate demonstrates strong foundations for ${activeRole.title} but possesses critical core deficits. Completing the 8-week roadmap will accelerate shortlisting probability.`}
              </div>

              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)" }}>
                <strong style={{ color: "var(--success)" }}>Competitive Moats: </strong>
                Strong proficiency in {Object.keys(studentProfile.skills).slice(0, 2).join(" and ")} provides a defensible technical edge against peer applicants.
              </div>

              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)" }}>
                <strong style={{ color: "var(--warning)" }}>High-Impact Quick Win: </strong>
                Upskilling in {gapResult?.critical_gaps[0]?.skill_name || "Cloud Infrastructure"} provides the highest immediate score acceleration.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: DEDICATED LEARNING ACTION PLAN & COURSEWARE PAGE   */}
      {/* ========================================================= */}
      {activePortalTab === "roadmap" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header Banner */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "var(--shadow-elevation)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <button
                  type="button"
                  onClick={() => setActivePortalTab("overview")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    color: "var(--brand-600)",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Overview</span>
                </button>
                <span style={{ color: "var(--text-muted)" }}>•</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                  Target Role: {activeRole.title}
                </span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                Prioritized Learning Action Plan & Curated Courseware
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                Every deficit skill is mapped to an 8-week structured roadmap with curated free video lectures, allocated study hours, and capstone milestones.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setCalculationPayload({
                  type: "priority",
                  data: {
                    skill_name: gapResult?.critical_gaps[0]?.skill_name || "Core Skill",
                    gap: gapResult?.critical_gaps[0]?.gap || 35,
                    industry_demand: 8.5,
                    role_importance: 8.0,
                    priority_score: ((gapResult?.critical_gaps[0]?.gap || 35) / 100) * 8.5 * 8.0,
                    why_text: "Skills are ranked by ROI = (Gap / 100) × Demand × Criticality to optimize placement return per study hour.",
                  },
                })}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--brand-600)",
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                <Calculator size={14} />
                <span>Inspect Priority Formula</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { key: "all", label: `All Gaps (${(gapResult?.critical_gaps.length || 0) + (gapResult?.core_gaps.length || 0) + (gapResult?.supporting_gaps.length || 0)})` },
              { key: "critical", label: `Critical Deficit (${gapResult?.critical_gaps.length || 0})` },
              { key: "core", label: `Core Competency (${gapResult?.core_gaps.length || 0})` },
              { key: "supporting", label: `Supporting (${gapResult?.supporting_gaps.length || 0})` },
              { key: "strengths", label: `Strengths Verified (${gapResult?.strengths.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setGapFilter(tab.key as any)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: gapFilter === tab.key ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                  backgroundColor: gapFilter === tab.key ? "var(--brand-50)" : "var(--bg-surface)",
                  color: gapFilter === tab.key ? "var(--brand-600)" : "var(--text-secondary)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredGaps.map((gap, idx) => {
              const tierLabel =
                gap.tier_category === "critical"
                  ? "Critical Deficit"
                  : gap.tier_category === "core"
                  ? "Core Competency"
                  : gap.tier_category === "supporting"
                  ? "Supporting"
                  : "Strengths Verified";

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "14px",
                    padding: "18px 22px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxShadow: "var(--shadow-elevation)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {gap.skill_name}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            gap.tier_category === "critical"
                              ? "var(--danger-bg)"
                              : gap.tier_category === "core"
                              ? "var(--warning-bg)"
                              : "var(--brand-50)",
                          color:
                            gap.tier_category === "critical"
                              ? "var(--danger)"
                              : gap.tier_category === "core"
                              ? "var(--warning)"
                              : "var(--brand-600)",
                          border: "1px solid currentColor",
                        }}
                      >
                        {tierLabel}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                        Current: {gap.student_level}% / Benchmark: {gap.required_level}%
                      </span>
                    </div>

                    {/* Timeline & Lectures CTA */}
                    <button
                      type="button"
                      onClick={() =>
                        setTimelineModalData({
                          skillName: gap.skill_name,
                          estimatedHours: Math.max(15, Math.round(gap.gap * 0.8)),
                          priorityTier: tierLabel,
                        })
                      }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        backgroundColor: "var(--brand-50)",
                        border: "1px solid var(--brand-600)",
                        color: "var(--brand-600)",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <Calendar size={14} />
                      <span>~{Math.max(15, Math.round(gap.gap * 0.8))} hrs Timeline & Video Lectures</span>
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div style={{ height: "7px", borderRadius: "4px", backgroundColor: "var(--border-strong)", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(100, gap.student_level)}%`,
                          backgroundColor: gap.gap > 0 ? "var(--danger)" : "var(--success)",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", paddingTop: "4px" }}>
                    <span>
                      {gap.gap > 0 ? `Calculated Deficit: -${gap.gap}%` : "Verified Strength · Target Satisfied"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setCalculationPayload({
                          type: "priority",
                          data: {
                            skill_name: gap.skill_name,
                            gap: gap.gap,
                            industry_demand: 8.5,
                            role_importance: 8.0,
                            priority_score: (gap.gap / 100) * 8.5 * 8.0,
                            why_text: `Critical requirement for ${activeRole.title}. Deficit of ${gap.gap}% reduces shortlisting probability.`,
                          },
                        })
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--brand-600)",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      Inspect Priority Proof →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Capstone Project Brief */}
          {roadmapResult?.capstone_project && (
            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-elevation)",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <Award size={26} color="var(--warning)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: "4px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
                    Capstone Deliverable
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Estimated Duration: {roadmapResult.capstone_project.estimated_weeks}
                  </span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
                  {roadmapResult.capstone_project.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 10px 0", lineHeight: "1.5" }}>
                  {roadmapResult.capstone_project.deliverables}
                </p>
                <div style={{ fontSize: "12px", color: "var(--brand-600)", fontWeight: 600 }}>
                  Build and publish to GitHub with comprehensive README to prove end-to-end competency to hiring committees.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: DEDICATED SPECIALIZED ROLES PAGE (106 CATALOG)     */}
      {/* ========================================================= */}
      {activePortalTab === "specializations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header Banner */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "var(--shadow-elevation)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <button
                  type="button"
                  onClick={() => setActivePortalTab("overview")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    color: "var(--brand-600)",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Overview</span>
                </button>
                <span style={{ color: "var(--text-muted)" }}>•</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                  106-Role National Taxonomy
                </span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                Specialized Career Pathways & Adjacent Roles
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                Discover niche, high-paying engineering roles that strongly align with your verified skill profile. Click &quot;Switch Benchmark&quot; to recalculate the entire terminal for any path.
              </p>
            </div>
          </div>

          {/* Search & Domain Filter Bar */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ position: "relative" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "12px" }} />
              <input
                type="text"
                placeholder="Search across all 106 roles (e.g. MLOps, Security, Cloud, Computer Vision)..."
                value={roleSearchQuery}
                onChange={(e) => setRoleSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 38px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { key: "all", label: "All Technical Domains (106)" },
                { key: "ai", label: "AI & Machine Learning" },
                { key: "data", label: "Data & Analytics" },
                { key: "cloud", label: "Cloud & DevOps" },
                { key: "software", label: "Software Engineering" },
                { key: "security", label: "Cybersecurity" },
                { key: "mobile", label: "Mobile & Embedded" },
              ].map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDomainFilter(d.key)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: selectedDomainFilter === d.key ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                    backgroundColor: selectedDomainFilter === d.key ? "var(--brand-50)" : "var(--bg-sunken)",
                    color: selectedDomainFilter === d.key ? "var(--brand-600)" : "var(--text-secondary)",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Specialized Role Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {specializedRecommendations.map((role) => (
              <div
                key={role.slug}
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "14px",
                  padding: "20px",
                  boxShadow: "var(--shadow-elevation)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: "var(--brand-50)",
                        color: "var(--brand-600)",
                        border: "1px solid var(--brand-600)",
                      }}
                    >
                      {role.domain}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 800,
                        fontFamily: "monospace",
                        color: role.matchPct >= 65 ? "var(--success)" : "var(--brand-600)",
                      }}
                    >
                      {role.matchPct}% Match
                    </span>
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
                    {role.title}
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 12px 0", lineHeight: "1.45" }}>
                    {role.primary_focus || role.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>Your Aligned Skills:</span>
                    {role.alignedSkills.slice(0, 4).map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "10px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: "var(--bg-sunken)",
                          border: "1px solid var(--border-subtle)",
                          color: "var(--success)",
                          fontWeight: 600,
                        }}
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    Market Demand: <strong>{role.industry_demand.toFixed(1)}/10</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectRole(role.slug);
                      setActivePortalTab("overview");
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "7px 14px",
                      borderRadius: "8px",
                      backgroundColor: "var(--brand-600)",
                      color: "var(--bg-base)",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span>Switch Benchmark</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 4: DEDICATED JOB DESCRIPTION PARSER & MATCHER         */}
      {/* ========================================================= */}
      {activePortalTab === "parser" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header Banner */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "var(--shadow-elevation)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <button
                  type="button"
                  onClick={() => setActivePortalTab("overview")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    color: "var(--brand-600)",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Overview</span>
                </button>
                <span style={{ color: "var(--text-muted)" }}>•</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                  Real-World ATS Engine
                </span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                Real-World Job Description Parser & Match Evaluator
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                Select live market postings or inspect candidate fit percentages against real employer requirements across Indian tech hubs.
              </p>
            </div>
          </div>

          {/* Job Presets Selector */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "14px",
              padding: "18px 22px",
            }}
          >
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase" }}>
              Select Active Industry Job Listing:
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {JOB_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedJobPreset(preset.id)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: selectedJobPreset === preset.id ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                    backgroundColor: selectedJobPreset === preset.id ? "var(--brand-50)" : "var(--bg-sunken)",
                    color: selectedJobPreset === preset.id ? "var(--brand-600)" : "var(--text-secondary)",
                  }}
                >
                  {preset.title.split("&")[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Parsed Job Card & Skills Fit */}
          <div style={{ backgroundColor: "var(--bg-surface)", borderRadius: "16px", border: "1px solid var(--border-strong)", padding: "24px", boxShadow: "var(--shadow-elevation)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>{activePreset.title}</h3>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{activePreset.company} · {activePreset.type}</span>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>ATS Candidate Fit</span>
                <span style={{ fontSize: "26px", fontWeight: 800, fontFamily: "monospace", color: jobMatchEvaluation.matchScore >= 70 ? "var(--success)" : jobMatchEvaluation.matchScore >= 50 ? "var(--warning)" : "var(--danger)" }}>
                  {jobMatchEvaluation.matchScore}% Match
                </span>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 20px 0", lineHeight: "1.5" }}>
              {activePreset.description}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                Parsed Technical Requirements & Candidate Assessed Level:
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                {jobMatchEvaluation.skillsStatus.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-sunken)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {s.isMet ? <CheckCircle2 size={16} color="var(--success)" /> : <AlertTriangle size={16} color="var(--danger)" />}
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: "12px", fontFamily: "monospace", color: s.isMet ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>
                      {s.studentLvl}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
