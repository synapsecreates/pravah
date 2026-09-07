// FILE: src/pages/OnboardingPage.tsx
// PURPOSE: 3-step student onboarding wizard with interactive SVG Skill Radar, Holographic Archetype Decks, Tactile 4-Stage Mastery Pods, AI Skill Synergies, and Proctored Verification Roadmap.
// PHASE: 8 | DEPENDS ON: src/api/client.ts, src/types/student.ts, lucide-react | LAST TOUCHED: Phase 8

import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Sparkles,
  Sliders,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Layers,
  Search,
  X,
  Award,
  Lock,
  Zap,
  RotateCcw,
  Star,
  Cpu,
  Globe,
  Database,
  Shield,
  BarChart3,
  Cloud,
} from "lucide-react";
import {
  ANCHOR_ROLES_DATA,
  evaluateStudentLocally,
  getTopRoles,
  saveStudentProfile,
} from "../api/client";
import type { RoleMatchSummary, StudentProfileData } from "../types/student";

interface OnboardingPageProps {
  onComplete: (profile: StudentProfileData, targetRole: RoleMatchSummary) => void;
  onInstantDemo: () => void;
}

const DEGREE_OPTIONS = [
  "Computer Science",
  "Information Technology",
  "Data Science",
  "Artificial Intelligence",
  "Electronics and Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other STEM",
  "Non-STEM",
];

// 6 Core Engineering Domains for Radar Chart and Skill Organization
export const DOMAIN_CRITICAL_SKILLS: {
  domain: string;
  shortLabel: string;
  icon: any;
  color: string;
  skills: string[];
}[] = [
  {
    domain: "Frontend Architecture",
    shortLabel: "Frontend",
    icon: Globe,
    color: "#38bdf8",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Responsive Design",
      "UI/UX",
      "Figma",
      "Web Vitals",
    ],
  },
  {
    domain: "Backend & Systems",
    shortLabel: "Backend",
    icon: Database,
    color: "#34d399",
    skills: [
      "Python",
      "Java",
      "Node.js",
      "Go",
      "C++",
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "REST APIs",
      "Microservices",
      "System Design",
    ],
  },
  {
    domain: "Cloud & DevOps",
    shortLabel: "Cloud/DevOps",
    icon: Cloud,
    color: "#fbbf24",
    skills: [
      "Docker",
      "Kubernetes",
      "Linux",
      "CI/CD",
      "AWS",
      "Azure",
      "GCP",
      "Terraform",
      "Bash",
      "Git",
      "Networking",
      "Prometheus",
    ],
  },
  {
    domain: "AI & Cognitive Intelligence",
    shortLabel: "AI & ML",
    icon: Cpu,
    color: "#a78bfa",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Statistics",
      "Linear Algebra",
      "Probability",
      "PyTorch",
      "TensorFlow",
      "NLP",
      "Computer Vision",
      "LLMs",
      "LangChain",
    ],
  },
  {
    domain: "Data & Quantitative Analytics",
    shortLabel: "Data & BI",
    icon: BarChart3,
    color: "#f472b6",
    skills: [
      "SQL",
      "Pandas",
      "NumPy",
      "Data Analysis",
      "Data Visualization",
      "Power BI",
      "Tableau",
      "Apache Spark",
      "Kafka",
      "ETL",
      "Data Warehousing",
    ],
  },
  {
    domain: "Cyber Resilience & Security",
    shortLabel: "Security",
    icon: Shield,
    color: "#f87171",
    skills: [
      "Security",
      "Network Security",
      "Penetration Testing",
      "Cryptography",
      "Linux",
      "Wireshark",
      "C",
      "C++",
      "SIEM",
      "Web Security",
    ],
  },
];

// Holographic Archetype Decks (Instant 1-Click Load)
const ARCHETYPE_DECKS = [
  {
    id: "fullstack",
    name: "Full-Stack Dynamo",
    tagline: "End-to-End Web & High-Throughput APIs",
    icon: "🌐",
    color: "#38bdf8",
    badge: "High Demand",
    skills: [
      { name: "React", level: 80 },
      { name: "TypeScript", level: 75 },
      { name: "Node.js", level: 75 },
      { name: "PostgreSQL", level: 70 },
      { name: "REST APIs", level: 75 },
      { name: "Git", level: 70 },
    ],
  },
  {
    id: "aiml",
    name: "AI & ML Pioneer",
    tagline: "Neural Networks, LLMs & Quantitative Math",
    icon: "🤖",
    color: "#a78bfa",
    badge: "Emerging Tech",
    skills: [
      { name: "Python", level: 85 },
      { name: "Machine Learning", level: 75 },
      { name: "PyTorch", level: 70 },
      { name: "Statistics", level: 75 },
      { name: "Linear Algebra", level: 70 },
      { name: "Pandas", level: 80 },
    ],
  },
  {
    id: "devops",
    name: "Cloud & DevOps Architect",
    tagline: "Containerization, CI/CD & Scale",
    icon: "☁️",
    color: "#fbbf24",
    badge: "Top Compensation",
    skills: [
      { name: "Docker", level: 80 },
      { name: "Kubernetes", level: 70 },
      { name: "Linux", level: 85 },
      { name: "AWS", level: 65 },
      { name: "CI/CD", level: 75 },
      { name: "Git", level: 80 },
    ],
  },
  {
    id: "data",
    name: "Data Intelligence Specialist",
    tagline: "Big Data Pipelines & Enterprise BI",
    icon: "📊",
    color: "#f472b6",
    badge: "Enterprise Core",
    skills: [
      { name: "SQL", level: 85 },
      { name: "Python", level: 75 },
      { name: "Pandas", level: 80 },
      { name: "Power BI", level: 75 },
      { name: "ETL", level: 70 },
      { name: "Statistics", level: 70 },
    ],
  },
  {
    id: "security",
    name: "Cyber Defense Guardian",
    tagline: "Zero Trust, Cryptography & Pentesting",
    icon: "🔒",
    color: "#f87171",
    badge: "Mission Critical",
    skills: [
      { name: "Linux", level: 85 },
      { name: "Network Security", level: 75 },
      { name: "Cryptography", level: 70 },
      { name: "Penetration Testing", level: 65 },
      { name: "Wireshark", level: 65 },
      { name: "Python", level: 70 },
    ],
  },
];

// Smart Skill Synergies map
const SKILL_SYNERGIES: Record<string, { name: string; gain: string }[]> = {
  React: [
    { name: "TypeScript", gain: "+18% Role Fit" },
    { name: "Next.js", gain: "+15% Stack Depth" },
    { name: "Tailwind CSS", gain: "+12% Velocity" },
  ],
  Python: [
    { name: "FastAPI", gain: "+16% API Fit" },
    { name: "PyTorch", gain: "+24% AI Roles" },
    { name: "PostgreSQL", gain: "+19% Backend Fit" },
  ],
  Docker: [
    { name: "Kubernetes", gain: "+22% DevOps Value" },
    { name: "CI/CD", gain: "+17% Production" },
    { name: "AWS", gain: "+19% Cloud Placement" },
  ],
  SQL: [
    { name: "PostgreSQL", gain: "+15% Relational Depth" },
    { name: "Redis", gain: "+14% Caching Fit" },
    { name: "ETL", gain: "+18% Data Eng" },
  ],
  "Machine Learning": [
    { name: "PyTorch", gain: "+20% Deep Learning" },
    { name: "Statistics", gain: "+16% Math Core" },
    { name: "LLMs", gain: "+25% GenAI Horizon" },
  ],
};

const DEFAULT_FALLBACK_ROLE: RoleMatchSummary = {
  role_id: "ai-ml-engineer",
  slug: "ai-ml-engineer",
  title: "AI & Machine Learning Engineer",
  domain: "AI & Cognitive Intelligence",
  match_percentage: 78.5,
  industry_demand: 9.5,
  primary_focus: "Neural Networks & Predictive Analytics",
  why_match_rationale: "Strong mathematical core and programming proficiency across models.",
};

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, onInstantDemo }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedRoleSlug, setSelectedRoleSlug] = useState<string>("ai-ml-engineer");
  const [predictedRoles, setPredictedRoles] = useState<RoleMatchSummary[]>([]);
  const [isPredictingRoles, setIsPredictingRoles] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState<string>("");
  const [degreeField, setDegreeField] = useState<string>("Computer Science");
  const [currentYear, setCurrentYear] = useState<number>(2);
  const [collegeName, setCollegeName] = useState<string>("");
  const [skills, setSkills] = useState<{ name: string; level: number }[]>([
    { name: "Python", level: 75 },
    { name: "SQL", level: 70 },
    { name: "Git", level: 60 },
  ]);
  const [newSkillName, setNewSkillName] = useState<string>("");
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>("All");
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [activeArchetypeId, setActiveArchetypeId] = useState<string | null>(null);

  // Strict About-You Completion Validator
  const isAboutYouComplete = fullName.trim().length > 0 && collegeName.trim().length > 0;

  // Convert array of skills to Record<string, number> for calculations
  const skillsRecord = useMemo<Record<string, number>>(() => {
    const rec: Record<string, number> = {};
    skills.forEach((s) => {
      rec[s.name] = s.level;
    });
    return rec;
  }, [skills]);

  // Synchronous Local Market Alignment for Real-Time HUD
  const localRoleRankings = useMemo(() => {
    if (skills.length === 0) return [];
    const scored = ANCHOR_ROLES_DATA.map((role) => {
      const calc = evaluateStudentLocally(role, skillsRecord, degreeField);
      return {
        role,
        score: Math.round(calc.finalScore),
      };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [skillsRecord, degreeField, skills.length]);

  // Auto-fetch predicted roles on entering Step 3
  useEffect(() => {
    if (step === 3 && predictedRoles.length === 0 && !isPredictingRoles && skills.length > 0) {
      setIsPredictingRoles(true);
      setPredictionError(null);

      getTopRoles(skillsRecord, degreeField)
        .then((roles) => {
          setPredictedRoles(roles);
          if (roles.length > 0) {
            setSelectedRoleSlug(roles[0].slug);
          }
          setIsPredictingRoles(false);
        })
        .catch((err) => {
          console.error("Failed to predict top roles:", err);
          setPredictionError("Could not calculate role affinities. Please check backend status.");
          setIsPredictingRoles(false);
        });
    }
  }, [step, skillsRecord, degreeField, predictedRoles.length, isPredictingRoles, skills.length]);

  // Calculations for Skill XP, Archetype, and 6 Radar Axes
  const { totalXP, avgProficiency, dominantArchetype, domainScores } = useMemo(() => {
    const avg = skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length) : 0;
    const xp = Math.min(1000, skills.length * 40 + avg * 6);

    const scores: { [key: string]: number } = {};
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
        archetype = "🌐 Full-Stack Architect";
      } else if (topDomain.includes("AI")) {
        archetype = "🧠 AI Systems Specialist";
      } else if (topDomain.includes("Cloud")) {
        archetype = "☁️ Cloud Platform Engineer";
      } else if (topDomain.includes("Security")) {
        archetype = "🛡️ Cyber Defense Specialist";
      } else if (topDomain.includes("Data")) {
        archetype = "📊 Data Intelligence Engineer";
      } else if (topDomain.includes("Backend")) {
        archetype = "⚙️ Distributed Systems Lead";
      } else {
        archetype = "⚡ Polymath Engineer";
      }
    } else if (skills.length > 0) {
      archetype = `Aspiring ${topDomain.split(" ")[0]} Engineer`;
    }

    return {
      totalXP: xp,
      avgProficiency: avg,
      dominantArchetype: archetype,
      domainScores: scores,
    };
  }, [skills]);

  // Filter skills catalog
  const filteredDomainSkills = useMemo(() => {
    return DOMAIN_CRITICAL_SKILLS.map((d) => {
      if (activeDomainFilter !== "All" && d.domain !== activeDomainFilter) {
        return null;
      }
      const matchingSkills = d.skills.filter((s) =>
        s.toLowerCase().includes(skillSearchQuery.toLowerCase().trim())
      );
      if (matchingSkills.length === 0) return null;
      return {
        ...d,
        skills: matchingSkills,
      };
    }).filter(Boolean) as typeof DOMAIN_CRITICAL_SKILLS;
  }, [activeDomainFilter, skillSearchQuery]);

  // Compute smart suggestions based on equipped skills
  const smartSynergies = useMemo(() => {
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
  }, [skills]);

  // Handlers
  const handleToggleSkill = (skillName: string, defaultLevel = 70) => {
    const existingIndex = skills.findIndex((s) => s.name.toLowerCase() === skillName.toLowerCase());
    if (existingIndex >= 0) {
      setSkills(skills.filter((_, i) => i !== existingIndex));
    } else {
      setSkills([...skills, { name: skillName, level: defaultLevel }]);
    }
  };

  const handleUpdateLevel = (index: number, newLevel: number) => {
    const clamped = Math.max(10, Math.min(100, Math.round(newLevel)));
    const updated = [...skills];
    updated[index].level = clamped;
    setSkills(updated);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleApplyArchetype = (deck: typeof ARCHETYPE_DECKS[0]) => {
    setActiveArchetypeId(deck.id);
    setSkills(deck.skills);
  };

  const handleAddCustomSkill = () => {
    if (!newSkillName.trim()) return;
    const trimmed = newSkillName.trim();
    if (!skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { name: trimmed, level: 70 }]);
    }
    setNewSkillName("");
  };

  const handleLoadDemoPreset = () => {
    setFullName("Aaditya Sharma");
    setCollegeName("Indian Institute of Technology, Roorkee");
    setDegreeField("Computer Science");
    setCurrentYear(3);
    setSkills([
      { name: "Python", level: 85 },
      { name: "React", level: 80 },
      { name: "TypeScript", level: 75 },
      { name: "Docker", level: 70 },
      { name: "SQL", level: 80 },
      { name: "Machine Learning", level: 65 },
      { name: "Git", level: 85 },
    ]);
  };

  const handleFinalSubmit = async () => {
    const selectedRole = predictedRoles.find((r) => r.slug === selectedRoleSlug) || DEFAULT_FALLBACK_ROLE;

    const finalProfile: StudentProfileData = {
      full_name: fullName || "Student",
      institution_name: collegeName || "Verified Institution",
      region: "North",
      department: degreeField,
      degree_field: degreeField,
      current_year_of_study: currentYear,
      graduation_year: 2026,
      career_intent: "Industry Ready Placement",
      target_work_mobility: "Pan-India",
      target_role_slug: selectedRole.slug,
      skills: skillsRecord,
      is_demo_account: false,
    };

    try {
      await saveStudentProfile(finalProfile);
    } catch (e) {
      console.warn("Backend profile save skipped/failed, proceeding in-memory:", e);
    }

    onComplete(finalProfile, selectedRole);
  };

  // SVG Radar Polygon Math
  const radarPoints = useMemo(() => {
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
  }, [domainScores]);

  return (
    <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "28px 20px" }}>
      {/* CARD WRAPPER */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "var(--shadow-elevation)",
        }}
      >
        {/* TOP BAR: STEP WIZARD HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
            paddingBottom: "20px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "var(--brand-600)",
                  backgroundColor: "var(--brand-50)",
                  padding: "2px 8px",
                  borderRadius: "6px",
                }}
              >
                Step {step} of 3
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>· Pravah Intelligence Engine</span>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "6px 0 0 0", color: "var(--text-primary)" }}>
              {step === 1 && "Academic & Candidate Background"}
              {step === 2 && "Tactile Skill Mastery & Archetype Studio"}
              {step === 3 && "Verified Target Role Matching & Readiness Forecast"}
            </h1>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  width: "36px",
                  height: "7px",
                  borderRadius: "4px",
                  backgroundColor: s === step ? "var(--brand-600)" : s < step ? "var(--success)" : "var(--border-strong)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: ABOUT YOU */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Candidate Full Name <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aaditya Sharma"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-base)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                  College / University <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Indian Institute of Technology, Roorkee"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-base)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Discipline / Major
                </label>
                <select
                  value={degreeField}
                  onChange={(e) => setDegreeField(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-base)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  {DEGREE_OPTIONS.map((deg) => (
                    <option key={deg} value={deg}>
                      {deg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Current Year of Study
                </label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-base)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value={1}>1st Year (Foundational)</option>
                  <option value={2}>2nd Year (Core Competencies)</option>
                  <option value={3}>3rd Year (Pre-Placement)</option>
                  <option value={4}>4th Year (Graduating / Placements)</option>
                </select>
              </div>
            </div>

            {!isAboutYouComplete && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                }}
              >
                <AlertCircle size={16} color="var(--warning)" />
                <span>
                  Please enter your <strong>Full Name</strong> and <strong>College Name</strong> to activate the Skill Studio.
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "20px",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <button
                type="button"
                onClick={handleLoadDemoPreset}
                style={{
                  fontSize: "12px",
                  color: "var(--brand-600)",
                  background: "none",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Sparkles size={14} />
                <span>Autofill Sample Profile</span>
              </button>

              <button
                type="button"
                disabled={!isAboutYouComplete}
                onClick={() => {
                  if (isAboutYouComplete) setStep(2);
                }}
                className="interactive-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 26px",
                  borderRadius: "10px",
                  backgroundColor: "var(--brand-600)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "none",
                  cursor: isAboutYouComplete ? "pointer" : "not-allowed",
                  opacity: isAboutYouComplete ? 1 : 0.45,
                  boxShadow: isAboutYouComplete ? "0 4px 14px rgba(96, 165, 250, 0.35)" : "none",
                }}
              >
                <span>Enter Skill Studio</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AWESOME GAMIFIED SKILL MATRIX & ARCHETYPE STUDIO */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* 1. TOP PROTOCOL SHIELD BANNER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px",
                padding: "12px 18px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10b981",
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)" }}>
                      Pravah Integrity Protocol:
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "1px 8px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(96, 165, 250, 0.15)",
                        color: "var(--brand-600)",
                      }}
                    >
                      Self-Attestation Mode Active
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Instant calibration mode enabled for rapid role discovery.
                  </div>
                </div>
              </div>

              {/* VERIFICATION TRIGGER BUTTON */}
              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                className="interactive-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  color: "#10b981",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                <ShieldCheck size={15} />
                <span>🛡️ Verify via Proctored Quiz</span>
                <span
                  style={{
                    fontSize: "9px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                  }}
                >
                  ROADMAP
                </span>
              </button>
            </div>

            {/* 2. HERO SECTION: INTERACTIVE RADAR & ARCHETYPE DECK */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px",
                alignItems: "stretch",
              }}
            >
              {/* RADAR CHART HUD */}
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
                    <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "var(--brand-600)" }}>
                      Competency Constellation
                    </span>
                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", margin: "2px 0 0 0" }}>
                      {dominantArchetype}
                    </h3>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "18px", fontWeight: 900, color: "var(--brand-600)", fontFamily: "monospace" }}>
                      {totalXP} <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>/ 1000 XP</span>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: totalXP >= 600 ? "var(--success)" : "var(--warning)" }}>
                      {totalXP >= 750 ? "Tier IV: Elite Ready" : totalXP >= 500 ? "Tier III: Industry Qualified" : "Tier II: Developing Core"}
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
                    {radarPoints.points.map((p, idx) => {
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
                      strokeWidth="2.5"
                      style={{ transition: "all 0.3s ease" }}
                    />

                    {/* Vertex Data Points */}
                    {radarPoints.points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r="4"
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
                          fontWeight="700"
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
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>
                      {skills.length} Skills
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Avg Level</div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--brand-600)" }}>
                      {avgProficiency}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Domains</div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--success)" }}>
                      {Object.values(domainScores).filter((s) => s > 0.3).length} / 6 Active
                    </div>
                  </div>
                </div>
              </div>

              {/* 1-CLICK ARCHETYPE DECKS (CARDS) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)" }}>
                      ⚡ Instant Archetype Decks (1-Click Equip)
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--brand-600)", fontWeight: 600 }}>
                      Pre-calibrated to NOS Standards
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                    {ARCHETYPE_DECKS.map((deck) => {
                      const isActive = activeArchetypeId === deck.id;
                      return (
                        <div
                          key={deck.id}
                          onClick={() => handleApplyArchetype(deck)}
                          className="interactive-btn"
                          style={{
                            padding: "12px 14px",
                            borderRadius: "12px",
                            backgroundColor: isActive ? "var(--brand-50)" : "var(--bg-sunken)",
                            border: isActive ? `1.5px solid ${deck.color}` : "1px solid var(--border-subtle)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "8px",
                            boxShadow: isActive ? `0 4px 12px ${deck.color}25` : "none",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ fontSize: "18px" }}>{deck.icon}</span>
                              <span
                                style={{
                                  fontSize: "9px",
                                  fontWeight: 800,
                                  padding: "1px 6px",
                                  borderRadius: "6px",
                                  backgroundColor: "var(--bg-surface)",
                                  color: deck.color,
                                  border: `1px solid ${deck.color}40`,
                                }}
                              >
                                {deck.badge}
                              </span>
                            </div>
                            <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)" }}>
                              {deck.name}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                              {deck.tagline}
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid var(--border-subtle)" }}>
                            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                              {deck.skills.length} core competencies
                            </span>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: 800,
                                color: isActive ? deck.color : "var(--brand-600)",
                              }}
                            >
                              {isActive ? "✓ Equipped" : "Equip Deck →"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI SYNERGY RECOMMENDATIONS STRIP */}
                {smartSynergies.length > 0 && (
                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-sunken)",
                      border: "1px solid var(--border-strong)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 800, color: "var(--violet-accent)" }}>
                      <Sparkles size={13} />
                      <span>RECOMMENDED SYNERGIES FOR YOUR STACK:</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {smartSynergies.map((syn) => (
                        <button
                          key={syn.name}
                          type="button"
                          onClick={() => handleToggleSkill(syn.name, 75)}
                          className="interactive-btn"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "14px",
                            backgroundColor: "var(--bg-surface)",
                            border: "1px solid var(--violet-accent)",
                            color: "var(--text-primary)",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          <Plus size={12} color="var(--violet-accent)" />
                          <span>{syn.name}</span>
                          <span style={{ fontSize: "9px", color: "var(--violet-accent)", opacity: 0.9 }}>
                            ({syn.gain})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. MAIN WORKSPACE: 2 COLUMNS (SKILL CATALOG vs RATED PORTFOLIO PODS) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: "22px",
                alignItems: "start",
              }}
            >
              {/* LEFT COLUMN: VISUAL SKILL CATALOG */}
              <div
                style={{
                  backgroundColor: "var(--bg-sunken)",
                  borderRadius: "14px",
                  border: "1px solid var(--border-subtle)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Search Bar */}
                <div style={{ position: "relative" }}>
                  <Search
                    size={15}
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                    placeholder="Search 50+ canonical skills (e.g. Python, Docker, PyTorch)..."
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 36px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-base)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                  {skillSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setSkillSearchQuery("")}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Domain Selector Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setActiveDomainFilter("All")}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "14px",
                      fontSize: "11px",
                      fontWeight: activeDomainFilter === "All" ? 800 : 500,
                      backgroundColor: activeDomainFilter === "All" ? "var(--brand-600)" : "var(--bg-surface)",
                      color: activeDomainFilter === "All" ? "#ffffff" : "var(--text-secondary)",
                      border: activeDomainFilter === "All" ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    All Domains
                  </button>
                  {DOMAIN_CRITICAL_SKILLS.map((dom) => {
                    const isSelected = activeDomainFilter === dom.domain;
                    const Icon = dom.icon;
                    return (
                      <button
                        key={dom.domain}
                        type="button"
                        onClick={() => setActiveDomainFilter(dom.domain)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "5px 10px",
                          borderRadius: "14px",
                          fontSize: "11px",
                          fontWeight: isSelected ? 800 : 500,
                          backgroundColor: isSelected ? dom.color : "var(--bg-surface)",
                          color: isSelected ? "#0B1020" : "var(--text-secondary)",
                          border: isSelected ? `1px solid ${dom.color}` : "1px solid var(--border-subtle)",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Icon size={12} />
                        <span>{dom.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Scrollable Skill Chips Group */}
                <div
                  style={{
                    maxHeight: "360px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    paddingRight: "4px",
                  }}
                >
                  {filteredDomainSkills.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text-muted)", fontSize: "12px" }}>
                      No competencies match "{skillSearchQuery}". Add it as a custom skill below!
                    </div>
                  ) : (
                    filteredDomainSkills.map((domGroup) => (
                      <div key={domGroup.domain}>
                        <div style={{ fontSize: "11px", fontWeight: 800, color: domGroup.color, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <domGroup.icon size={13} />
                          <span>{domGroup.domain}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {domGroup.skills.map((skillName) => {
                            const isEquipped = skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
                            const level = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())?.level;
                            return (
                              <button
                                key={skillName}
                                type="button"
                                onClick={() => handleToggleSkill(skillName, 70)}
                                className="interactive-btn"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  padding: "5px 11px",
                                  borderRadius: "14px",
                                  fontSize: "11px",
                                  backgroundColor: isEquipped ? "var(--brand-50)" : "var(--bg-surface)",
                                  border: isEquipped ? `1.5px solid ${domGroup.color}` : "1px solid var(--border-strong)",
                                  color: isEquipped ? "var(--text-primary)" : "var(--text-secondary)",
                                  fontWeight: isEquipped ? 800 : 500,
                                  cursor: "pointer",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                {isEquipped ? (
                                  <>
                                    <CheckCircle2 size={12} color={domGroup.color} />
                                    <span>{skillName}</span>
                                    <span style={{ opacity: 0.8, fontSize: "10px", color: domGroup.color }}>{level}%</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus size={11} />
                                    <span>{skillName}</span>
                                  </>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Custom Skill Input */}
                <div style={{ display: "flex", gap: "8px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Add custom competence (e.g. Solidity, Rust, OpenCV)..."
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-base)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Plus size={13} />
                    <span>Equip</span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: TACTILE 4-STAGE MASTERY PODS */}
              <div
                style={{
                  backgroundColor: "var(--bg-base)",
                  borderRadius: "14px",
                  border: "1px solid var(--border-strong)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Header with Clear Action */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>
                      Active Competency Pods ({skills.length})
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        backgroundColor: "var(--brand-50)",
                        color: "var(--brand-600)",
                      }}
                    >
                      Calibrated
                    </span>
                  </div>

                  {skills.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSkills([])}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--danger)",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Empty State */}
                {skills.length === 0 ? (
                  <div
                    style={{
                      padding: "48px 20px",
                      textAlign: "center",
                      backgroundColor: "var(--bg-surface)",
                      borderRadius: "12px",
                      border: "1px dashed var(--border-strong)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Compass size={32} style={{ opacity: 0.4, margin: "0 auto 12px auto", display: "block" }} />
                    <p style={{ margin: "0 0 4px 0", fontWeight: 700, fontSize: "14px" }}>No Competencies Equipped</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
                      Equip an Archetype Deck above or select competencies from the left catalog.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      maxHeight: "440px",
                      overflowY: "auto",
                      paddingRight: "4px",
                    }}
                  >
                    {skills.map((skill, index) => {
                      const tier =
                        skill.level >= 85
                          ? { label: "Master 👑", color: "#a78bfa" }
                          : skill.level >= 65
                          ? { label: "Advanced 🚀", color: "#34d399" }
                          : skill.level >= 45
                          ? { label: "Competent ⚡", color: "#38bdf8" }
                          : { label: "Novice 🌱", color: "#fbbf24" };

                      return (
                        <div
                          key={skill.name}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "12px",
                            backgroundColor: "var(--bg-surface)",
                            border: "1px solid var(--border-subtle)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                          }}
                        >
                          {/* Pod Top Bar */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)" }}>
                                {skill.name}
                              </span>
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  padding: "1px 7px",
                                  borderRadius: "8px",
                                  backgroundColor: "var(--bg-sunken)",
                                  color: tier.color,
                                  border: `1px solid ${tier.color}35`,
                                }}
                              >
                                {tier.label}
                              </span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 900,
                                  color: tier.color,
                                  fontFamily: "monospace",
                                }}
                              >
                                {skill.level}%
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(index)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "var(--text-muted)",
                                  cursor: "pointer",
                                  padding: "2px",
                                }}
                                title="Remove competence"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* 4-STAGE TACTILE SEGMENTED POWER BAR */}
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
                            {[
                              { label: "Novice", pct: 25, color: "#fbbf24" },
                              { label: "Competent", pct: 50, color: "#38bdf8" },
                              { label: "Advanced", pct: 75, color: "#34d399" },
                              { label: "Master", pct: 100, color: "#a78bfa" },
                            ].map((stage) => {
                              const isActive = skill.level >= stage.pct - 15;
                              const isExact = Math.abs(skill.level - stage.pct) <= 12;
                              return (
                                <button
                                  key={stage.label}
                                  type="button"
                                  onClick={() => handleUpdateLevel(index, stage.pct)}
                                  className="interactive-btn"
                                  style={{
                                    padding: "6px 4px",
                                    borderRadius: "6px",
                                    backgroundColor: isActive ? stage.color : "var(--bg-sunken)",
                                    border: isExact ? `1.5px solid ${stage.color}` : "1px solid var(--border-subtle)",
                                    color: isActive ? "#0B1020" : "var(--text-muted)",
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    textAlign: "center",
                                    transition: "all 0.15s ease",
                                    boxShadow: isExact ? `0 2px 8px ${stage.color}35` : "none",
                                  }}
                                >
                                  {stage.label} ({stage.pct}%)
                                </button>
                              );
                            })}
                          </div>

                          {/* MICRO FINE-TUNING SLIDER */}
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateLevel(index, skill.level - 5)}
                              style={{
                                background: "var(--bg-sunken)",
                                border: "1px solid var(--border-strong)",
                                color: "var(--text-secondary)",
                                borderRadius: "4px",
                                width: "22px",
                                height: "20px",
                                fontSize: "11px",
                                fontWeight: 800,
                                cursor: "pointer",
                              }}
                            >
                              -
                            </button>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              value={skill.level}
                              onChange={(e) => handleUpdateLevel(index, Number(e.target.value))}
                              style={{
                                flex: 1,
                                height: "4px",
                                borderRadius: "2px",
                                accentColor: tier.color,
                                cursor: "pointer",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateLevel(index, skill.level + 5)}
                              style={{
                                background: "var(--bg-sunken)",
                                border: "1px solid var(--border-strong)",
                                color: "var(--text-secondary)",
                                borderRadius: "4px",
                                width: "22px",
                                height: "20px",
                                fontSize: "11px",
                                fontWeight: 800,
                                cursor: "pointer",
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 4. REAL-TIME NATIONAL MARKET MAGNET HUD */}
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "14px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-strong)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(96, 165, 250, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--brand-600)",
                  }}
                >
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>National Career Alignment Real-Time HUD</span>
                    {localRoleRankings.length > 0 && (
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand-600)" }}>
                        (Top Match: {localRoleRankings[0].role.title} · {localRoleRankings[0].score}%)
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                    {localRoleRankings.slice(0, 3).map((item) => (
                      <span
                        key={item.role.slug}
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "8px",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          color: item.score >= 70 ? "var(--success)" : "var(--text-secondary)",
                        }}
                      >
                        {item.role.title}: {item.score}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ← Back to Bio
                </button>

                <button
                  type="button"
                  disabled={skills.length < 3}
                  onClick={() => {
                    if (skills.length >= 3) setStep(3);
                  }}
                  className="interactive-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 24px",
                    borderRadius: "10px",
                    backgroundColor: "var(--brand-600)",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 800,
                    border: "none",
                    cursor: skills.length >= 3 ? "pointer" : "not-allowed",
                    opacity: skills.length >= 3 ? 1 : 0.45,
                    boxShadow: skills.length >= 3 ? "0 4px 14px rgba(96, 165, 250, 0.3)" : "none",
                  }}
                >
                  <span>Predict Top Roles</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PREDICTED TARGET ROLES */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                National Role Affinities &amp; Readiness Standing
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                Ranked by deterministic cosine similarity against NOS-2015 benchmarks with critical skill penalty floors.
              </p>
            </div>

            {isPredictingRoles ? (
              <div style={{ padding: "60px 0", textAlign: "center" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "3px solid var(--border-strong)",
                    borderTopColor: "var(--brand-600)",
                    borderRadius: "50%",
                    margin: "0 auto 16px auto",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Analyzing {skills.length} competencies against National Occupational Roles...
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Calibrating critical skill penalties, domain weights, and degree alignment floors.
                </p>
              </div>
            ) : predictionError ? (
              <div
                style={{
                  padding: "24px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--danger)",
                  textAlign: "center",
                }}
              >
                <AlertCircle size={28} color="var(--danger)" style={{ margin: "0 auto 10px auto" }} />
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>
                  {predictionError}
                </p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: "var(--brand-600)",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Modify Skills
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                {predictedRoles.map((role, idx) => {
                  const isSelected = role.slug === selectedRoleSlug;
                  const matchColor =
                    role.match_percentage >= 75
                      ? "var(--success)"
                      : role.match_percentage >= 50
                      ? "var(--brand-600)"
                      : "var(--warning)";

                  return (
                    <div
                      key={role.slug}
                      onClick={() => setSelectedRoleSlug(role.slug)}
                      className="interactive-btn"
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        backgroundColor: isSelected ? "var(--brand-50)" : "var(--bg-sunken)",
                        border: isSelected ? "2px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        boxShadow: isSelected ? "0 4px 14px rgba(96, 165, 250, 0.2)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 800,
                              width: "22px",
                              height: "22px",
                              borderRadius: "6px",
                              backgroundColor: "var(--bg-base)",
                              color: "var(--text-secondary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            #{idx + 1}
                          </span>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>
                            {role.title}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: 900,
                            color: matchColor,
                            fontFamily: "monospace",
                          }}
                        >
                          {role.match_percentage.toFixed(0)}%
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(96, 165, 250, 0.15)",
                            color: "var(--brand-600)",
                          }}
                        >
                          {role.domain}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: "6px",
                            backgroundColor: "var(--bg-base)",
                            color: "var(--text-muted)",
                          }}
                        >
                          Demand: {role.industry_demand}/10
                        </span>
                      </div>

                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                        {role.why_match_rationale}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ACTION FOOTER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "20px",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ← Edit Skills
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="interactive-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  backgroundColor: "var(--brand-600)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 800,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(96, 165, 250, 0.35)",
                }}
              >
                <span>Complete Onboarding &amp; Enter Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. PROCTORED SKILL VERIFICATION ROADMAP MODAL */}
      {showVerificationModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setShowVerificationModal(false)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "600px",
              width: "100%",
              boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10b981",
                  }}
                >
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                      Pravah Verified Candidate Protocol
                    </h3>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        padding: "2px 7px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                        color: "#10b981",
                      }}
                    >
                      H2 2026 ROADMAP
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Automated trust, diagnostic assessment, and tamper-proof verification blueprint.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Explanatory Note */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                backgroundColor: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
                fontSize: "13px",
                lineHeight: "1.5",
                color: "var(--text-secondary)",
              }}
            >
              <strong style={{ color: "var(--text-primary)" }}>Why Self-Attestation for MVP?</strong>
              <br />
              Pravah currently utilizes structured self-evaluation so students can immediately explore role matching, syllabus gap analytics, and learning pathways without upfront test friction. In production deployment, all claims are verified via proctored assessments.
            </div>

            {/* 4 Pillars of Verification */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <Zap size={16} color="#38bdf8" style={{ marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    1. Adaptive 15-Minute Diagnostic Quizzes
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Computerized Adaptive Testing (CAT) calibrating question difficulty dynamically based on real-time candidate answers.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <Cpu size={16} color="#34d399" style={{ marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    2. Live Interactive Sandboxes &amp; Unit Tests
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Real-time browser-based coding execution against automated unit test suites for verified hands-on proficiency.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <Award size={16} color="#fbbf24" style={{ marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    3. Tamper-Proof Cryptographic Skill Badges
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Candidates who pass proctored diagnostics earn a permanent verified badge, appearing at the top of employer searches.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <Lock size={16} color="#a78bfa" style={{ marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    4. Anti-Cheat &amp; LLM Deterrence Proctoring
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Tab-switch monitoring, keystroke entropy analysis, and prompt-injection defenses to guarantee authentic student assessment.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Action */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                className="interactive-btn"
                style={{
                  padding: "10px 22px",
                  borderRadius: "8px",
                  backgroundColor: "var(--brand-600)",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Got It · Continue with Self-Attestation for MVP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
