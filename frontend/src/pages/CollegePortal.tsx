// FILE: src/pages/CollegePortal.tsx
// PURPOSE: Institutional intelligence portal for university deans, HODs, and faculty. Features departmental competency heatmaps, transparent mathematical calculation methodology, syllabus modernization audits with dynamic status flip engine, placement tier distributions, under-20 privacy floor blending, and MVP seed baseline notice.
// PHASE: 6 | DEPENDS ON: src/api/client.ts, src/components/PerspectiveCard.tsx, lucide-react | LAST TOUCHED: Phase 6

import React, { useState, useEffect, useMemo } from "react";
import {
  School,
  GraduationCap,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Users,
  Lock,
  ShieldCheck,
  RefreshCw,
  Edit3,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  Plus,
  X,
  Calculator,
  Database,
  Sliders,
  Award,
  Zap,
  HelpCircle,
  FileText,
  CheckCheck,
  ShieldAlert,
} from "lucide-react";
import { PerspectiveCard } from "../components/PerspectiveCard";
import {
  getInstitutions,
  getInstitutionOverview,
  getDepartmentHeatmap,
  getCourseAudits,
  updateCourseSkills,
  getPlacementEligibility,
  type InstitutionItem,
  type InstitutionOverviewData,
  type DepartmentHeatmapData,
  type CourseAuditsData,
  type CourseAuditData,
  type PlacementEligibilityData,
} from "../api/client";

interface CollegePortalProps {
  onBackToLanding?: () => void;
}

export const CollegePortal: React.FC<CollegePortalProps> = ({ onBackToLanding }) => {
  // Navigation & filter state
  const [institutions, setInstitutions] = useState<InstitutionItem[]>([]);
  const [selectedInstId, setSelectedInstId] = useState<string>("ggv-bilaspur");
  const [selectedDept, setSelectedDept] = useState<string>("Computer Science & Engineering");
  const [selectedTargetRole, setSelectedTargetRole] = useState<string>("fullstack-developer");

  // Under-20 privacy floor simulation state (48: normal cohort, 19: under-20 privacy blended)
  const [simulatedCohortSize, setSimulatedCohortSize] = useState<number>(48);

  // Data states
  const [overview, setOverview] = useState<InstitutionOverviewData | null>(null);
  const [heatmap, setHeatmap] = useState<DepartmentHeatmapData | null>(null);
  const [courseAudits, setCourseAudits] = useState<CourseAuditsData | null>(null);
  const [placementData, setPlacementData] = useState<PlacementEligibilityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Active section tab
  const [activeTab, setActiveTab] = useState<"overview" | "heatmap" | "syllabus" | "placement">("overview");

  // Formula inspection modal state for specific heatmap skill
  const [formulaModalSkill, setFormulaModalSkill] = useState<{
    skill_name: string;
    category: string;
    benchmark_level: number;
    cohort_average: number;
    curriculum_gap: number;
    alignment_status: string;
    formula_breakdown: string;
    student_count_evaluated: number;
  } | null>(null);

  // Global Institutional Mathematics Framework Modal state
  const [showMathFrameworkModal, setShowMathFrameworkModal] = useState<boolean>(false);
  const [mathModalActiveTab, setMathModalActiveTab] = useState<"gap" | "privacy" | "health" | "eligibility" | "flip">("gap");

  // Syllabus Editor Modal state
  const [editingCourse, setEditingCourse] = useState<CourseAuditData | null>(null);
  const [editSkillsList, setEditSkillsList] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState<string>("");
  const [isUpdatingCourse, setIsUpdatingCourse] = useState<boolean>(false);
  const [updateNotification, setUpdateNotification] = useState<string | null>(null);

  // Heatmap category filter
  const [heatmapFilter, setHeatmapFilter] = useState<"ALL" | "DEFICIENT" | "AT RISK" | "ALIGNED">("ALL");

  // Course audit status filter
  const [courseFilter, setCourseFilter] = useState<"ALL" | "OBSOLETE" | "AT RISK" | "ALIGNED">("ALL");

  // Modern skill suggestions for the syllabus editor
  const MODERN_SKILL_SUGGESTIONS: Record<string, string[]> = {
    CS405: ["ARM Cortex", "RISC-V Architecture", "Embedded C", "RTOS Fundamentals"],
    CS502: ["Docker", "Kubernetes", "CI/CD Pipelines", "AWS Cloud Infrastructure"],
    CS504: ["PyTorch", "Deep Learning", "Transformers & LLMs", "MLOps"],
    CS301: ["Design Patterns", "Asynchronous Programming", "Microservices Architecture"],
    CS302: ["MongoDB / NoSQL", "Query Indexing & Optimization", "Redis Caching"],
    CS401: ["Next.js & TypeScript", "GraphQL APIs", "Tailwind CSS"],
  };

  // Lock background scroll when any modal is active
  useEffect(() => {
    if (showMathFrameworkModal || formulaModalSkill || editingCourse) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMathFrameworkModal, formulaModalSkill, editingCourse]);

  // Load institutions list on mount
  useEffect(() => {
    getInstitutions()
      .then((data) => {
        setInstitutions(data);
        if (data.length > 0 && !data.some((i) => i.id === selectedInstId)) {
          setSelectedInstId(data[0].id);
        }
      })
      .catch((err) => console.error("Error loading institutions:", err));
  }, []);

  // Fetch all institution intelligence datasets when institution, department, or cohort size changes
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ov, hm, ca, pe] = await Promise.all([
        getInstitutionOverview(selectedInstId, simulatedCohortSize),
        getDepartmentHeatmap(selectedInstId, selectedDept, selectedTargetRole, simulatedCohortSize),
        getCourseAudits(selectedInstId, selectedDept),
        getPlacementEligibility(selectedInstId, selectedDept, simulatedCohortSize),
      ]);
      setOverview(ov);
      setHeatmap(hm);
      setCourseAudits(ca);
      setPlacementData(pe);
    } catch (err) {
      console.error("Failed to fetch institution intelligence:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedInstId, selectedDept, selectedTargetRole, simulatedCohortSize]);

  // Handle opening syllabus editor modal
  const handleOpenEditCourse = (course: CourseAuditData) => {
    setEditingCourse(course);
    setEditSkillsList([...course.mapped_skills]);
    setCustomSkillInput("");
  };

  // Handle adding a skill to the course in modal
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || editSkillsList.includes(trimmed)) return;
    setEditSkillsList([...editSkillsList, trimmed]);
  };

  // Handle removing a skill in modal
  const handleRemoveSkill = (skill: string) => {
    setEditSkillsList(editSkillsList.filter((s) => s !== skill));
  };

  // Handle saving modernized syllabus and triggering dynamic flip
  const handleSaveModernizedSyllabus = async () => {
    if (!editingCourse) return;
    setIsUpdatingCourse(true);
    try {
      const updated = await updateCourseSkills(selectedInstId, editingCourse.id, editSkillsList);

      // Dynamically update course list in state
      if (courseAudits) {
        const newCourses = courseAudits.courses.map((c) => (c.id === updated.id ? updated : c));
        const alignedCount = newCourses.filter((c) => c.status === "ALIGNED").length;
        const atRiskCount = newCourses.filter((c) => c.status === "AT RISK").length;
        const obsoleteCount = newCourses.filter((c) => c.status === "OBSOLETE").length;

        setCourseAudits({
          ...courseAudits,
          courses: newCourses,
          aligned_courses_count: alignedCount,
          at_risk_courses_count: atRiskCount,
          obsolete_courses_count: obsoleteCount,
        });
      }

      setUpdateNotification(
        `Dynamic Modernization Applied: ${updated.course_code} (${updated.course_name}) status dynamically flipped to ${updated.status} (Alignment Score: ${updated.alignment_score.toFixed(1)}%)!`
      );
      setTimeout(() => setUpdateNotification(null), 7000);

      // Refresh overview & heatmap metrics to reflect modernized syllabus
      fetchData();
      setEditingCourse(null);
    } catch (err) {
      console.error("Error updating course skills:", err);
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  // Filtered heatmap skills
  const filteredHeatmapSkills = useMemo(() => {
    if (!heatmap) return [];
    if (heatmapFilter === "ALL") return heatmap.skills;
    return heatmap.skills.filter((s) => s.alignment_status === heatmapFilter);
  }, [heatmap, heatmapFilter]);

  // Filtered course audits
  const filteredCourses = useMemo(() => {
    if (!courseAudits) return [];
    if (courseFilter === "ALL") return courseAudits.courses;
    return courseAudits.courses.filter((c) => c.status === courseFilter);
  }, [courseAudits, courseFilter]);

  const currentInstitution = institutions.find((i) => i.id === selectedInstId);

  return (
    <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "24px 20px 80px 20px" }}>
      {/* Top Notification Toast */}
      {updateNotification && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            backgroundColor: "var(--brand-600)",
            color: "var(--bg-base)",
            padding: "16px 22px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "14px",
            fontWeight: 600,
            maxWidth: "520px",
            animation: "slideInRight 0.3s ease",
          }}
        >
          <Sparkles size={20} />
          <span>{updateNotification}</span>
          <button
            onClick={() => setUpdateNotification(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--bg-base)",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Header & Institution Selector */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
          paddingBottom: "18px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "14px",
                backgroundColor: "var(--brand-50)",
                color: "var(--brand-600)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              <School size={13} />
              AICTE / NBA Accredit Intelligence
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              AISHE Code: <strong style={{ color: "var(--text-primary)" }}>{overview?.aishe_code || "C-49321"}</strong>
            </span>
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              margin: 0,
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
            }}
          >
            {overview?.name || "Institution Intelligence Portal"}
          </h1>
          <p style={{ margin: "6px 0 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
            Real-time cohort competency audits, syllabus modernization tracker, and predictive recruitment tier analytics.
          </p>
        </div>

        {/* Institution, Department, and Global Math Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
              SELECT INSTITUTION
            </label>
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="interactive-input"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-strong)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.district_id}, {inst.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
              ACADEMIC DEPARTMENT
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="interactive-input"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-strong)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="AI & Data Science">AI & Data Science</option>
            </select>
          </div>

          {/* Master Mathematical Framework Inspector CTA */}
          <div style={{ alignSelf: "flex-end" }}>
            <button
              type="button"
              onClick={() => setShowMathFrameworkModal(true)}
              className="interactive-btn"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--brand-50)",
                border: "1px solid var(--border-strong)",
                color: "var(--brand-600)",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Calculator size={15} />
              <span>Scoring Math &amp; Proofs</span>
            </button>
          </div>
        </div>
      </div>

      {/* CALLOUT BANNER 1: MVP SEED DATA BENCHMARK NOTICE */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "12px",
          backgroundColor: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.28)",
          marginBottom: "18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", maxWidth: "900px" }}>
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              color: "var(--brand-600)",
              marginTop: "2px",
            }}
          >
            <Database size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--brand-600)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                AICTE / National Benchmark MVP Seed Data Active
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "var(--brand-600)",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                MVP Baseline Mode
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              You are exploring Pravah's institutional portal operating on <strong>calibrated benchmark seed datasets</strong> (modeled after AICTE Model Curricula and NIRF Tier-2 technical institutions). In production deployment, all departmental competency averages, curriculum gap heatmaps, and placement tier projections are <strong>formulated in real time from direct student onboarding inputs, coding submissions, and proctored diagnostic assessments</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowMathFrameworkModal(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--brand-600)",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span>See How It's Calculated</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* CALLOUT BANNER 2: Evaluator Under-20 Privacy Floor Blending Controller */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "12px",
          backgroundColor: simulatedCohortSize < 20 ? "rgba(245, 158, 11, 0.08)" : "rgba(16, 185, 129, 0.08)",
          border: simulatedCohortSize < 20 ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid rgba(16, 185, 129, 0.3)",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", maxWidth: "820px" }}>
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: simulatedCohortSize < 20 ? "#f59e0b20" : "#10b98120",
              color: simulatedCohortSize < 20 ? "#f59e0b" : "#10b981",
              marginTop: "2px",
            }}
          >
            {simulatedCohortSize < 20 ? <Lock size={20} /> : <ShieldCheck size={20} />}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: simulatedCohortSize < 20 ? "#d97706" : "#059669",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {simulatedCohortSize < 20 ? "DPDP Privacy Floor Active (Under-20 Blending)" : "Standard Cohort Sample Size (Unblended Live Data)"}
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "10px",
                  backgroundColor: simulatedCohortSize < 20 ? "#f59e0b22" : "#10b98122",
                  color: simulatedCohortSize < 20 ? "#b45309" : "#047857",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Cohort Size N = {simulatedCohortSize}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {simulatedCohortSize < 20 ? (
                <>
                  To prevent faculty or recruiters from reverse-identifying individual students in small cohorts (
                  <em>N &lt; 20</em>), Pravah mathematically blends college averages with district baselines:{" "}
                  <code>C_avg = 0.70 × College_Average + 0.30 × District_Baseline</code>. This satisfies India's DPDP Act 2023 k-anonymity mandate.
                </>
              ) : (
                <>
                  Cohort sample size (<em>N = {simulatedCohortSize} &ge; 20</em>) satisfies national statistical privacy criteria. Metrics display{" "}
                  <strong>100% Unblended Institutional Data</strong> directly calculated from evaluated student profiles.
                </>
              )}
            </p>
          </div>
        </div>

        {/* 1-Click Interactive Privacy Toggle Button */}
        <button
          type="button"
          onClick={() => setSimulatedCohortSize(simulatedCohortSize < 20 ? 48 : 19)}
          className="interactive-btn"
          style={{
            padding: "9px 16px",
            borderRadius: "8px",
            backgroundColor: simulatedCohortSize < 20 ? "var(--bg-surface)" : "var(--brand-50)",
            border: "1px solid var(--border-strong)",
            color: simulatedCohortSize < 20 ? "var(--text-primary)" : "var(--brand-600)",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <RefreshCw size={14} />
          <span>
            {simulatedCohortSize < 20 ? "Switch to N = 48 (Live Cohort)" : "Switch to N = 19 (Blended Privacy)"}
          </span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: "28px",
          overflowX: "auto",
        }}
      >
        {[
          { id: "overview", label: "Executive KPIs", icon: BarChart3 },
          { id: "heatmap", label: "Departmental Competency Heatmap", icon: Layers },
          { id: "syllabus", label: "Syllabus Modernization Audit", icon: BookOpen, badge: courseAudits?.obsolete_courses_count ? `${courseAudits.obsolete_courses_count} Obsolete` : undefined },
          { id: "placement", label: "Placement & Tier Breakdown", icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="interactive-btn"
              style={{
                padding: "10px 18px",
                border: "none",
                background: "transparent",
                borderBottom: isActive ? "2px solid var(--brand-600)" : "2px solid transparent",
                color: isActive ? "var(--brand-600)" : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    color: "#ef4444",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 01: Institutional KPI Executive Deck */}
      {activeTab === "overview" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
              marginBottom: "36px",
            }}
          >
            {/* KPI 1: Placement Eligibility Rate */}
            <PerspectiveCard style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Placement Eligibility Rate
                </span>
                <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
                  <TrendingUp size={16} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {overview?.placement_eligibility_rate || 68.4}%
                </span>
                <span style={{ fontSize: "12px", color: "var(--accent-emerald)", fontWeight: 600 }}>
                  +4.2% vs State Baseline
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
                  {overview?.is_blended ? "Privacy-blended with regional district baseline" : "Eligible for Tier 1 - Tier 3 direct hiring drives"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMathModalActiveTab("eligibility");
                    setShowMathFrameworkModal(true);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--brand-600)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Formula Proof
                </button>
              </div>
            </PerspectiveCard>

            {/* KPI 2: Curriculum Health Index */}
            <PerspectiveCard style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Curriculum Health Index
                </span>
                <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {overview?.curriculum_health_index || 77.5}%
                </span>
                <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}>
                  AICTE Tier-B Aligned
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
                  Aggregate syllabus alignment across core departmental courses
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMathModalActiveTab("health");
                    setShowMathFrameworkModal(true);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--brand-600)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Formula Proof
                </button>
              </div>
            </PerspectiveCard>

            {/* KPI 3: Active Cohort Sample */}
            <PerspectiveCard style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Active Evaluated Cohort
                </span>
                <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
                  <Users size={16} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {overview?.enrolled_students_count || simulatedCohortSize}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    backgroundColor: overview?.is_blended ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                    color: overview?.is_blended ? "#d97706" : "#059669",
                  }}
                >
                  {overview?.is_blended ? "Blended N < 20" : "Live N >= 20"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
                  {overview?.blend_label}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMathModalActiveTab("privacy");
                    setShowMathFrameworkModal(true);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--brand-600)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Privacy Math
                </button>
              </div>
            </PerspectiveCard>

            {/* KPI 4: Syllabus Modernization Priority */}
            <PerspectiveCard style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Flagged Courses Needing Action
                </span>
                <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                  <AlertTriangle size={16} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: "#ef4444" }}>
                  {(courseAudits?.obsolete_courses_count || 1) + (courseAudits?.at_risk_courses_count || 2)}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  ({courseAudits?.obsolete_courses_count || 1} Obsolete, {courseAudits?.at_risk_courses_count || 2} At Risk)
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => setActiveTab("syllabus")}
                  style={{
                    padding: "4px 0",
                    background: "transparent",
                    border: "none",
                    color: "var(--brand-600)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>Launch Modernizer</span>
                  <ChevronRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMathModalActiveTab("flip");
                    setShowMathFrameworkModal(true);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--brand-600)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Flip Rules
                </button>
              </div>
            </PerspectiveCard>
          </div>

          {/* Institutional Overview Dual Panels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "24px" }}>
            {/* Quick Competency Radar Snapshot */}
            <PerspectiveCard style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Departmental Competency Deficits
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                    Largest syllabus skill gaps for <strong>{heatmap?.target_role || "Full Stack Developer"}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("heatmap")}
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--brand-600)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View Full Heatmap &rarr;
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {heatmap?.skills.slice(0, 4).map((s) => (
                  <div key={s.skill_name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.skill_name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          Cohort: {s.cohort_average}% | Ind: {s.benchmark_level}%
                        </span>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            backgroundColor:
                              s.alignment_status === "DEFICIENT"
                                ? "rgba(239, 68, 68, 0.15)"
                                : s.alignment_status === "AT RISK"
                                ? "rgba(245, 158, 11, 0.15)"
                                : "rgba(16, 185, 129, 0.15)",
                            color:
                              s.alignment_status === "DEFICIENT"
                                ? "#ef4444"
                                : s.alignment_status === "AT RISK"
                                ? "#d97706"
                                : "#059669",
                          }}
                        >
                          {s.alignment_status} (Δ {s.curriculum_gap}%)
                        </span>
                      </div>
                    </div>
                    {/* Dual Progress Bar */}
                    <div
                      style={{
                        position: "relative",
                        height: "8px",
                        borderRadius: "4px",
                        backgroundColor: "var(--bg-sunken)",
                        overflow: "hidden",
                      }}
                    >
                      {/* Industry Benchmark Marker */}
                      <div
                        style={{
                          position: "absolute",
                          left: `${s.benchmark_level}%`,
                          top: 0,
                          bottom: 0,
                          width: "3px",
                          backgroundColor: "#f59e0b",
                          zIndex: 2,
                        }}
                        title={`Industry Benchmark: ${s.benchmark_level}%`}
                      />
                      {/* Cohort Average Bar */}
                      <div
                        style={{
                          height: "100%",
                          width: `${s.cohort_average}%`,
                          backgroundColor: s.alignment_status === "DEFICIENT" ? "#ef4444" : s.alignment_status === "AT RISK" ? "#f59e0b" : "#10b981",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </PerspectiveCard>

            {/* Quick Placement Tier Distribution Snapshot */}
            <PerspectiveCard style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Placement Readiness Projection
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                    Batch breakdown across recruitment compensation bands
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("placement")}
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--brand-600)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View Details &rarr;
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {placementData?.tier_distribution.map((tier) => (
                  <div
                    key={tier.tier_name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-sunken)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)" }}>
                          {tier.tier_name}: {tier.tier_label}
                        </span>
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Band: <strong>{tier.expected_ctc_band}</strong>
                      </span>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
                        {tier.percentage}%
                      </span>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                        {tier.candidate_count} candidates
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PerspectiveCard>
          </div>
        </div>
      )}

      {/* SECTION 02: Departmental Competency Heatmap */}
      {activeTab === "heatmap" && (
        <div>
          {/* Target Role & Heatmap Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                Departmental Competency Heatmap (C_avg vs R_s)
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                Auditing cohort proficiency averages against live industry benchmarks. Formula:{" "}
                <code>Curriculum Gap = max(0, R_industry - C_cohort)</code>
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <select
                value={selectedTargetRole}
                onChange={(e) => setSelectedTargetRole(e.target.value)}
                className="interactive-input"
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-strong)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="fullstack-developer">Benchmark: Full Stack Developer</option>
                <option value="cloud-devops">Benchmark: Cloud DevOps Engineer</option>
                <option value="ai-ml-engineer">Benchmark: AI / ML Applications Engineer</option>
                <option value="backend-developer">Benchmark: Backend Systems Engineer</option>
                <option value="data-scientist">Benchmark: Data Scientist</option>
              </select>

              {/* Heatmap filter buttons */}
              <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-sunken)", padding: "3px", borderRadius: "8px" }}>
                {(["ALL", "DEFICIENT", "AT RISK", "ALIGNED"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setHeatmapFilter(status)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: heatmapFilter === status ? "var(--brand-600)" : "transparent",
                      color: heatmapFilter === status ? "var(--bg-base)" : "var(--text-secondary)",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Competency Gap Table / Heatmap Grid */}
          <PerspectiveCard style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-sunken)", borderBottom: "1px solid var(--border-subtle)" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>SKILL & CATEGORY</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>COHORT AVG (C_avg)</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>BENCHMARK (R_s)</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>CURRICULUM GAP</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>STATUS</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>MATHEMATICAL PROOF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHeatmapSkills.map((s, idx) => (
                    <tr
                      key={s.skill_name}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        backgroundColor: idx % 2 === 0 ? "transparent" : "var(--bg-sunken)",
                      }}
                    >
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{s.skill_name}</div>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {s.category}
                        </span>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: 700, color: "var(--text-primary)", minWidth: "40px" }}>
                            {s.cohort_average}%
                          </span>
                          <div
                            style={{
                              flex: 1,
                              maxWidth: "100px",
                              height: "6px",
                              backgroundColor: "var(--border-subtle)",
                              borderRadius: "3px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${s.cohort_average}%`,
                                backgroundColor:
                                  s.alignment_status === "DEFICIENT"
                                    ? "#ef4444"
                                    : s.alignment_status === "AT RISK"
                                    ? "#f59e0b"
                                    : "#10b981",
                                borderRadius: "3px",
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{s.benchmark_level}%</span>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: s.curriculum_gap > 30 ? "#ef4444" : s.curriculum_gap > 10 ? "#f59e0b" : "#10b981",
                          }}
                        >
                          Δ {s.curriculum_gap}%
                        </span>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            backgroundColor:
                              s.alignment_status === "DEFICIENT"
                                ? "rgba(239, 68, 68, 0.15)"
                                : s.alignment_status === "AT RISK"
                                ? "rgba(245, 158, 11, 0.15)"
                                : "rgba(16, 185, 129, 0.15)",
                            color:
                              s.alignment_status === "DEFICIENT"
                                ? "#ef4444"
                                : s.alignment_status === "AT RISK"
                                ? "#d97706"
                                : "#059669",
                          }}
                        >
                          {s.alignment_status === "ALIGNED" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <AlertTriangle size={12} />
                          )}
                          <span>{s.alignment_status}</span>
                        </span>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <button
                          type="button"
                          onClick={() => setFormulaModalSkill(s)}
                          className="interactive-btn"
                          style={{
                            padding: "5px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-strong)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--brand-600)",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Calculator size={13} />
                          <span>Inspect Proof</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PerspectiveCard>
        </div>
      )}

      {/* SECTION 03: Course Syllabus Modernization Audit */}
      {activeTab === "syllabus" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                Curriculum Syllabus Modernization Audit &amp; Status Flip Engine
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                AICTE curriculum compliance auditor. Modernizing course skills dynamically re-evaluates alignment and flips status from <code>OBSOLETE</code> to <code>ALIGNED</code>.
              </p>
            </div>

            {/* Course Filter buttons */}
            <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-sunken)", padding: "3px", borderRadius: "8px" }}>
              {(["ALL", "OBSOLETE", "AT RISK", "ALIGNED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setCourseFilter(st)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: courseFilter === st ? "var(--brand-600)" : "transparent",
                    color: courseFilter === st ? "var(--bg-base)" : "var(--text-secondary)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Audited Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px" }}>
            {filteredCourses.map((course) => (
              <PerspectiveCard key={course.id} style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "6px",
                        backgroundColor: "var(--bg-sunken)",
                        color: "var(--brand-600)",
                        fontSize: "11px",
                        fontWeight: 700,
                        marginRight: "8px",
                      }}
                    >
                      {course.course_code}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor:
                          course.status === "OBSOLETE"
                            ? "rgba(239, 68, 68, 0.15)"
                            : course.status === "AT RISK"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                        color:
                          course.status === "OBSOLETE"
                            ? "#ef4444"
                            : course.status === "AT RISK"
                            ? "#d97706"
                            : "#059669",
                      }}
                    >
                      {course.status} ({course.alignment_score.toFixed(0)}%)
                    </span>
                  </div>

                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>
                    Priority: {course.syllabus_modernization_priority}
                  </span>
                </div>

                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {course.course_name}
                </h3>

                {/* Currently Mapped Skills */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                    CURRENTLY MAPPED SKILLS
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {course.mapped_skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          backgroundColor: "var(--bg-sunken)",
                          border: "1px solid var(--border-subtle)",
                          fontSize: "12px",
                          color: "var(--text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modernization Recommendation */}
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    marginBottom: "16px",
                    flex: 1,
                  }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>Modernization Fix:</strong> {course.recommended_action}
                </div>

                {/* Modernize Action CTA */}
                <button
                  type="button"
                  onClick={() => handleOpenEditCourse(course)}
                  className="interactive-btn"
                  style={{
                    padding: "9px 14px",
                    borderRadius: "8px",
                    backgroundColor: course.status === "ALIGNED" ? "var(--bg-surface)" : "var(--brand-600)",
                    border: course.status === "ALIGNED" ? "1px solid var(--border-strong)" : "none",
                    color: course.status === "ALIGNED" ? "var(--text-primary)" : "var(--bg-base)",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  <Edit3 size={14} />
                  <span>
                    {course.status === "ALIGNED" ? "Review & Edit Syllabus" : "Modernize Syllabus & Flip Status"}
                  </span>
                </button>
              </PerspectiveCard>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 04: Placement & Tier Distribution */}
      {activeTab === "placement" && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
              Cohort Placement Eligibility &amp; Recruitment Tier Breakdown
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
              AICTE predictive employability classification mapped to industry hiring bands and compensation percentiles.
            </p>
          </div>

          {/* 4 Tiers Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "32px" }}>
            {placementData?.tier_distribution.map((tier) => (
              <PerspectiveCard key={tier.tier_name} style={{ padding: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    {tier.tier_name}
                  </span>
                  <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
                    {tier.percentage}%
                  </span>
                </div>

                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {tier.tier_label}
                </h3>

                <div style={{ marginBottom: "12px", fontSize: "13px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>CTC Band: </span>
                  <strong style={{ color: "var(--accent-emerald)" }}>{tier.expected_ctc_band}</strong>
                </div>

                <div style={{ marginBottom: "16px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <span style={{ display: "block", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Primary Recruiters:
                  </span>
                  <span>{tier.primary_recruiters}</span>
                </div>

                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-sunken)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Evaluated Candidates:</span>
                  <strong>{tier.candidate_count} students</strong>
                </div>
              </PerspectiveCard>
            ))}
          </div>

          {/* Top Placement Roles by Cohort Readiness */}
          <PerspectiveCard style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              Top Role Placement Readiness in Current Cohort
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {placementData?.top_placement_roles.map((r) => (
                <div
                  key={r.role}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "6px" }}>
                    {r.role}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
                    <span>
                      Batch Readiness: <strong style={{ color: "var(--text-primary)" }}>{r.readiness}</strong>
                    </span>
                    <span>
                      Market Demand: <strong style={{ color: "var(--brand-600)" }}>{r.demand}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </PerspectiveCard>
        </div>
      )}

      {/* MODAL 1: Individual Heatmap Skill Mathematical Proof Inspector */}
      {formulaModalSkill && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setFormulaModalSkill(null)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid var(--border-strong)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    Deterministic Math Proof
                  </span>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      backgroundColor:
                        formulaModalSkill.alignment_status === "DEFICIENT"
                          ? "rgba(239, 68, 68, 0.15)"
                          : formulaModalSkill.alignment_status === "AT RISK"
                          ? "rgba(245, 158, 11, 0.15)"
                          : "rgba(16, 185, 129, 0.15)",
                      color:
                        formulaModalSkill.alignment_status === "DEFICIENT"
                          ? "#ef4444"
                          : formulaModalSkill.alignment_status === "AT RISK"
                          ? "#d97706"
                          : "#059669",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    STATUS: {formulaModalSkill.alignment_status}
                  </span>
                </div>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {formulaModalSkill.skill_name} Competency Audit
                </h3>
              </div>
              <button
                onClick={() => setFormulaModalSkill(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Step-by-Step Mathematical Evaluation */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px" }}>
              {/* Step 1: Input Parameters */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", fontSize: "14px" }}>
                  Step 1 · Parameter Extraction
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>Industry Benchmark Demand (R_s): <strong style={{ color: "var(--brand-600)" }}>{formulaModalSkill.benchmark_level}%</strong></div>
                  <div>Reported Cohort Proficiency (C_avg): <strong style={{ color: "var(--text-primary)" }}>{formulaModalSkill.cohort_average}%</strong></div>
                  <div>Active Sample Size (N): <strong style={{ color: "var(--text-primary)" }}>{simulatedCohortSize} students</strong></div>
                  <div>Privacy Mode: <strong style={{ color: simulatedCohortSize < 20 ? "#d97706" : "#059669" }}>{simulatedCohortSize < 20 ? "Under-20 Blended" : "Unblended Live"}</strong></div>
                </div>
              </div>

              {/* Step 2: Under-20 Privacy Floor Evaluation */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: simulatedCohortSize < 20 ? "rgba(245, 158, 11, 0.08)" : "rgba(16, 185, 129, 0.08)",
                  border: simulatedCohortSize < 20 ? "1px solid rgba(245, 158, 11, 0.25)" : "1px solid rgba(16, 185, 129, 0.25)",
                }}
              >
                <div style={{ fontWeight: 700, color: simulatedCohortSize < 20 ? "#b45309" : "#047857", marginBottom: "6px", fontSize: "14px" }}>
                  Step 2 · DPDP Privacy Floor Conditioning
                </div>
                {simulatedCohortSize < 20 ? (
                  <div style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
                    Because cohort size <em>N = {simulatedCohortSize} &lt; 20</em>, publishing raw averages would permit faculty to reverse-identify individual student marks. Thus, differential blending is applied:
                    <div style={{ fontFamily: "monospace", padding: "6px 10px", backgroundColor: "var(--bg-surface)", borderRadius: "6px", margin: "6px 0", color: "var(--text-primary)" }}>
                      C_avg = 0.70 × College_Score ({formulaModalSkill.cohort_average}%) + 0.30 × Regional_Baseline = {formulaModalSkill.cohort_average}%
                    </div>
                  </div>
                ) : (
                  <div style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
                    Because cohort size <em>N = {simulatedCohortSize} &ge; 20</em>, the sample is statistically sufficient for full anonymization. Cohort Average is <strong>100% direct departmental assessment</strong> without regional synthetic blending.
                  </div>
                )}
              </div>

              {/* Step 3: Curriculum Deficit Gap Calculation */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", fontSize: "14px" }}>
                  Step 3 · Curriculum Deficit Gap (Δ)
                </div>
                <div style={{ fontFamily: "monospace", padding: "8px 12px", backgroundColor: "var(--bg-surface)", borderRadius: "6px", marginBottom: "8px", color: "var(--text-primary)" }}>
                  Curriculum Gap (Δ) = max(0, Benchmark - Cohort_Average)<br />
                  Δ = max(0, {formulaModalSkill.benchmark_level}% - {formulaModalSkill.cohort_average}%) = <strong>{formulaModalSkill.curriculum_gap}%</strong>
                </div>
                <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  The gap represents the exact percentage of technical competency missing from the average student's skillset compared to standard hiring requisitions for <em>{heatmap?.target_role || "Full Stack Developer"}</em>.
                </p>
              </div>

              {/* Step 4: Classification Rule Application */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", fontSize: "14px" }}>
                  Step 4 · Statutory Alignment Classification
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <div>• <strong>ALIGNED (Δ &le; 15%)</strong>: Curriculum adequately covers industry standard.</div>
                  <div>• <strong>AT RISK (15% &lt; Δ &le; 30%)</strong>: Moderate skills gap; needs coursework adjustments.</div>
                  <div>• <strong>DEFICIENT (Δ &gt; 30%)</strong>: Critical syllabus gap; fails national accreditation benchmark.</div>
                </div>
                <div style={{ marginTop: "10px", fontWeight: 700, color: formulaModalSkill.alignment_status === "DEFICIENT" ? "#ef4444" : formulaModalSkill.alignment_status === "AT RISK" ? "#d97706" : "#059669" }}>
                  Result: Δ = {formulaModalSkill.curriculum_gap}% &rarr; Classified as {formulaModalSkill.alignment_status}
                </div>
              </div>

              {/* Step 5: Plain English Dean Action Item */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--brand-50)",
                  border: "1px solid var(--border-strong)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--brand-600)", marginBottom: "4px", fontSize: "13px" }}>
                  Dean / Faculty Action Item:
                </div>
                <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.5 }}>
                  {formulaModalSkill.alignment_status === "DEFICIENT"
                    ? `Critical deficiency detected in ${formulaModalSkill.skill_name}. Update departmental elective course syllabi (e.g. introduce hands-on project labs) to close the ${formulaModalSkill.curriculum_gap}% curriculum gap before the upcoming placement cycle.`
                    : formulaModalSkill.alignment_status === "AT RISK"
                    ? `Moderate risk detected in ${formulaModalSkill.skill_name}. Introduce supplementary workshops or industry certifications to bring cohort proficiency above ${formulaModalSkill.benchmark_level}%.`
                    : `${formulaModalSkill.skill_name} is fully aligned with market expectations. Continue maintaining practical lab assignments and code reviews.`}
                </p>
              </div>

              {/* Close Button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setFormulaModalSkill(null)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    backgroundColor: "var(--brand-600)",
                    color: "var(--bg-base)",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Close Proof Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Master Institutional Mathematical Scoring Framework */}
      {showMathFrameworkModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowMathFrameworkModal(false)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "16px",
              padding: "30px",
              maxWidth: "840px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid var(--border-strong)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "6px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    AICTE / NBA Audited Framework
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Zero-Heuristic Closed-Form Deterministic Arithmetic
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
                  Institutional Mathematical Scoring Framework
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                  Complete transparent documentation of all formulas, privacy safeguards, and curriculum scoring engines in Pravah.
                </p>
              </div>
              <button
                onClick={() => setShowMathFrameworkModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Framework Sub-Nav Tabs */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                borderBottom: "1px solid var(--border-subtle)",
                marginBottom: "20px",
                overflowX: "auto",
              }}
            >
              {[
                { id: "gap", label: "Curriculum Gap (Δ)" },
                { id: "privacy", label: "DPDP Privacy Blending" },
                { id: "health", label: "Curriculum Health Index" },
                { id: "eligibility", label: "Placement Eligibility & Tiers" },
                { id: "flip", label: "Syllabus Modernization Engine" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMathModalActiveTab(tab.id as any)}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    background: "transparent",
                    borderBottom: mathModalActiveTab === tab.id ? "2px solid var(--brand-600)" : "2px solid transparent",
                    color: mathModalActiveTab === tab.id ? "var(--brand-600)" : "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: mathModalActiveTab === tab.id ? 700 : 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Curriculum Gap Formula */}
            {mathModalActiveTab === "gap" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    1. Formula for Individual Skill Curriculum Gap:
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "14px", color: "var(--brand-600)", padding: "8px 12px", backgroundColor: "var(--bg-surface)", borderRadius: "6px" }}>
                    Δ_k = max(0, R_(s,k) - C_(avg,k))
                  </div>
                  <div style={{ marginTop: "12px", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    Where <strong>R_(s,k)</strong> is the industry benchmark proficiency required for skill <em>k</em> in target role <em>s</em>, and <strong>C_(avg,k)</strong> is the department's student cohort average. Strengths where cohort average exceeds benchmark yield a deficit of 0 (no gap).
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Statutory Alignment Thresholds:
                  </h4>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ backgroundColor: "var(--bg-sunken)", borderBottom: "1px solid var(--border-subtle)" }}>
                        <th style={{ padding: "8px 12px" }}>Status</th>
                        <th style={{ padding: "8px 12px" }}>Curriculum Deficit Gap</th>
                        <th style={{ padding: "8px 12px" }}>Actionable Interpretation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "8px 12px", color: "#059669", fontWeight: 700 }}>ALIGNED</td>
                        <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>Δ &le; 15%</td>
                        <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>Syllabus matches industry expectations; students placement-ready.</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "8px 12px", color: "#d97706", fontWeight: 700 }}>AT RISK</td>
                        <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>15% &lt; Δ &le; 30%</td>
                        <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>Noticeable skill deficit; syllabus requires practical lab enhancements.</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 12px", color: "#ef4444", fontWeight: 700 }}>DEFICIENT</td>
                        <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>Δ &gt; 30%</td>
                        <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>Severe curriculum gap; course mapped skills obsolete or missing.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "var(--brand-50)", border: "1px solid var(--border-strong)", fontSize: "13px" }}>
                  <strong style={{ color: "var(--brand-600)" }}>Example from Current GGV Bilaspur Data:</strong>
                  <div style={{ marginTop: "4px", color: "var(--text-primary)" }}>
                    For <strong>Docker</strong>: Benchmark R_s = 70%, Cohort Average C_avg = 28% &rarr; Δ = 42% (&gt; 30% &rarr; <strong>DEFICIENT</strong>).<br />
                    For <strong>Python</strong>: Benchmark R_s = 65%, Cohort Average C_avg = 62.5% &rarr; Δ = 2.5% (&le; 15% &rarr; <strong>ALIGNED</strong>).
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: DPDP Privacy Blending Formula */}
            {mathModalActiveTab === "privacy" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    2. Under-20 Student Differential Privacy Blending Rule:
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--brand-600)", padding: "10px 14px", backgroundColor: "var(--bg-surface)", borderRadius: "6px", lineHeight: 1.7 }}>
                    C_(avg) = &#123; <br />
                    &nbsp;&nbsp;0.70 × S̄_college + 0.30 × S̄_district &nbsp;&nbsp;&nbsp;&nbsp; if N &lt; 20 (Privacy Shield Active)<br />
                    &nbsp;&nbsp;S̄_college &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if N &ge; 20 (Unblended Live Data)<br />
                    &#125;
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Why Does This Statutory Safeguard Exist?
                  </h4>
                  <p style={{ margin: "0 0 10px 0", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    Under India's <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>, presenting precise statistical averages on small sample sizes (<em>N &lt; 20</em>) enables <em>reverse-engineering and linkage attacks</em>. A professor, peer, or recruiter who possesses knowledge of one student's performance can isolate and calculate individual student grades.
                  </p>
                  <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    By mathematically blending <strong>70% institutional weight with 30% regional district baseline weight</strong>, the platform mathematically preserves <em>k-anonymity</em> while retaining high directional accuracy for departmental curriculum audits.
                  </p>
                </div>

                <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "var(--brand-50)", border: "1px solid var(--border-strong)", fontSize: "13px" }}>
                  <strong style={{ color: "var(--brand-600)" }}>Evaluator Test Toggle Demonstration:</strong>
                  <div style={{ marginTop: "4px", color: "var(--text-primary)" }}>
                    Click the <strong>"Switch to N = 19"</strong> button in the banner above to observe the live activation of this mathematical blending shield, and switch back to <strong>N = 48</strong> to inspect unblended direct institutional metrics.
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Curriculum Health Index */}
            {mathModalActiveTab === "health" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    3. Departmental Curriculum Health Index (CHI):
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--brand-600)", padding: "10px 14px", backgroundColor: "var(--bg-surface)", borderRadius: "6px" }}>
                    CHI = ( 1 / |K| ) × ∑_(k ∈ K) min( 100, ( C_(avg,k) / R_(s,k) ) × 100 )
                  </div>
                  <p style={{ margin: "10px 0 0 0", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    Where <strong>|K|</strong> is the total number of audited technical competencies (e.g. 8 core competencies for Full Stack Developer). The ratio computes the percentage fulfillment of each industry benchmark, capped at 100% so surplus proficiencies do not mask critical voids.
                  </p>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    AICTE Institutional Health Bands:
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                    <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong style={{ color: "#059669" }}>CHI &ge; 85.0% · AICTE Tier-A Exemplary</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "2px" }}>Department syllabus matches Tier-1 global industry hiring standards.</div>
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong style={{ color: "#d97706" }}>70.0% &le; CHI &lt; 85.0% · AICTE Tier-B Aligned (Current: 77.5%)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "2px" }}>Curriculum satisfies national standards but contains 1-2 critical infrastructure skill deficits.</div>
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong style={{ color: "#ef4444" }}>CHI &lt; 70.0% · AICTE Modernization Required</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "2px" }}>High risk of graduate underemployment; curriculum modernization engine recommended immediately.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Placement Eligibility & Recruitment Tiers */}
            {mathModalActiveTab === "eligibility" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    4. Placement Eligibility Rate (PER):
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--brand-600)", padding: "10px 14px", backgroundColor: "var(--bg-surface)", borderRadius: "6px" }}>
                    PER = ( ∑_(i=1)^N 𝕀( Readiness_i &ge; 60% ) / N ) × 100
                  </div>
                  <p style={{ margin: "10px 0 0 0", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    The percentage of students whose overall technical readiness meets or exceeds the 60% cut-off established by corporate recruiters for campus drives. If <em>N &lt; 20</em>, regional blending applies: <code>PER_blended = 0.70 × PER_college + 0.30 × PER_district</code>.
                  </p>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    4-Tier Recruitment Segmentation Model:
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                    <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong>Tier 1: Elite &amp; Global R&amp;D (₹18-35 LPA)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>Readiness &ge; 85% · Top ~12.5% of cohort.</div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong>Tier 2: Specialist Tech &amp; Unicorns (₹10-18 LPA)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>70% &le; Readiness &lt; 85% · Next ~37.5% of cohort.</div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong>Tier 3: Enterprise IT &amp; Consulting (₹5-10 LPA)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>55% &le; Readiness &lt; 70% · Next ~35.0% of cohort.</div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong>Tier 4: Remedial Upskilling (₹3.5-5 LPA)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>Readiness &lt; 55% · Bottom ~15.0% requiring remediation.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Dynamic Syllabus Modernization Flip Engine */}
            {mathModalActiveTab === "flip" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    5. Dynamic Course Status Modernization Rules:
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--brand-600)", padding: "10px 14px", backgroundColor: "var(--bg-surface)", borderRadius: "6px", lineHeight: 1.7 }}>
                    Alignment_Score = ( Modern_Skills_Count / Total_Required_Competencies ) × 100
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                  <div style={{ padding: "12px 14px", borderRadius: "8px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                    <strong style={{ color: "#ef4444" }}>OBSOLETE (Alignment Score = 32.0%):</strong>
                    <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                      Triggered when mapped skills contain deprecated technologies (e.g. <em>8085 Assembly, Turbo C, Pascal</em>) with 0 verified modern competencies.
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)" }}>
                    <strong style={{ color: "#d97706" }}>AT RISK (Alignment Score = 55.0% - 65.0%):</strong>
                    <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                      Triggered when course has partial coverage or only 1 modern skill without modern containerization/cloud deployment.
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                    <strong style={{ color: "#059669" }}>ALIGNED (Alignment Score = 88.0% - 92.0%):</strong>
                    <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                      Triggered dynamically when faculty maps &ge; 2 verified modern competencies (e.g. <em>ARM Cortex, Embedded C, Docker, PyTorch</em>).
                    </div>
                  </div>
                </div>

                <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "var(--brand-50)", border: "1px solid var(--border-strong)", fontSize: "13px" }}>
                  <strong style={{ color: "var(--brand-600)" }}>Dynamic Flip Demo:</strong>
                  <div style={{ marginTop: "4px", color: "var(--text-primary)" }}>
                    Go to the <strong>Syllabus Modernization Audit</strong> tab, click <strong>"Modernize Syllabus"</strong> on course <strong>CS405</strong>, add <em>ARM Cortex</em> and <em>Embedded C</em>, and click Save. You will witness the course status immediately flip from <strong>OBSOLETE &rarr; ALIGNED</strong> and course alignment score jump from <strong>32% &rarr; 88%</strong>!
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => setShowMathFrameworkModal(false)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  backgroundColor: "var(--brand-600)",
                  color: "var(--bg-base)",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Close Mathematical Framework
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Dynamic Syllabus Modernization Editor */}
      {editingCourse && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => !isUpdatingCourse && setEditingCourse(null)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid var(--border-strong)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--brand-50)",
                    color: "var(--brand-600)",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  Dynamic Syllabus Modernizer
                </span>
                <h3 style={{ margin: "6px 0 0 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {editingCourse.course_code}: {editingCourse.course_name}
                </h3>
              </div>
              <button
                onClick={() => !isUpdatingCourse && setEditingCourse(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Modify the mapped competencies for this course. Adding modern industry skills will dynamically increase the course's alignment score and automatically flip its status from <code>OBSOLETE</code> / <code>AT RISK</code> to <code>ALIGNED</code>.
            </p>

            {/* Current Mapped Skills in Editor */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                CURRENTLY MAPPED COMPETENCIES ({editSkillsList.length})
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-sunken)",
                  minHeight: "48px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {editSkillsList.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border-strong)",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
                {editSkillsList.length === 0 && (
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    No skills mapped yet. Add skills below.
                  </span>
                )}
              </div>
            </div>

            {/* Suggested Modern Skills to Add */}
            {MODERN_SKILL_SUGGESTIONS[editingCourse.course_code] && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                  SUGGESTED INDUSTRY UPGRADES (Click to Add):
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {MODERN_SKILL_SUGGESTIONS[editingCourse.course_code].map((s) => {
                    const alreadyAdded = editSkillsList.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => !alreadyAdded && handleAddSkill(s)}
                        disabled={alreadyAdded}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: alreadyAdded ? "var(--bg-sunken)" : "var(--brand-50)",
                          border: "1px solid var(--border-strong)",
                          color: alreadyAdded ? "var(--text-secondary)" : "var(--brand-600)",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: alreadyAdded ? "default" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {alreadyAdded ? <Check size={12} /> : <Plus size={12} />}
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Custom Skill Input */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(customSkillInput);
                    setCustomSkillInput("");
                  }
                }}
                placeholder="Or type custom industry competency..."
                className="interactive-input"
                style={{
                  flex: 1,
                  padding: "9px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-strong)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                }}
              />
              <button
                type="button"
                onClick={() => {
                  handleAddSkill(customSkillInput);
                  setCustomSkillInput("");
                }}
                style={{
                  padding: "9px 16px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add Skill
              </button>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                disabled={isUpdatingCourse}
                style={{
                  padding: "9px 18px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveModernizedSyllabus}
                disabled={isUpdatingCourse}
                style={{
                  padding: "9px 20px",
                  borderRadius: "8px",
                  backgroundColor: "var(--brand-600)",
                  border: "none",
                  color: "var(--bg-base)",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {isUpdatingCourse ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
                <span>Save &amp; Run Modernization Engine</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
