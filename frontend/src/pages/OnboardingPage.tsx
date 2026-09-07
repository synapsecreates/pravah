// FILE: src/pages/OnboardingPage.tsx
// PURPOSE: 3-step student onboarding wizard with strict about-you validation, 6-domain critical skill matrix, and reliable top-10 role prediction.
// PHASE: 5 | DEPENDS ON: src/api/client.ts, src/types/student.ts | LAST TOUCHED: Phase 5

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { getTopRoles, saveStudentProfile } from "../api/client";
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

// 6 Core Engineering Domains with their respective Critical and Essential Competencies
export const DOMAIN_CRITICAL_SKILLS: { domain: string; description: string; skills: string[] }[] = [
  {
    domain: "Frontend Development",
    description: "Client-side architecture, reactive user interfaces, and web performance.",
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
    domain: "Backend & Architecture",
    description: "High-throughput APIs, distributed concurrency, microservices, and databases.",
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
    description: "Container infrastructure, CI/CD pipelines, cloud platforms, and Linux systems.",
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
    domain: "AI & Machine Learning",
    description: "Predictive algorithms, deep neural nets, mathematical foundations, and LLMs.",
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
    domain: "Data Engineering & Analytics",
    description: "Data pipelines, distributed big data, telemetry visualization, and BI analysis.",
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
    domain: "Cybersecurity & Systems",
    description: "Information security, threat defense, network analysis, and systems programming.",
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

// Renders the 3-step student onboarding wizard with solid card container.
// Guides candidate from personal profile to domain skill ratings and role prediction.
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
    { name: "Python", level: 70 },
    { name: "SQL", level: 65 },
    { name: "Git", level: 50 },
  ]);
  const [newSkillName, setNewSkillName] = useState<string>("");
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>("All");

  // Strict About-You Completion Validator: both Name and College must be filled
  const isAboutYouComplete = fullName.trim().length > 0 && collegeName.trim().length > 0;

  // Auto-fetch predicted roles whenever Step 3 is entered and roles list is empty
  useEffect(() => {
    if (step === 3 && predictedRoles.length === 0 && !isPredictingRoles && skills.length > 0) {
      fetchPredictedRoles();
    }
  }, [step]);

  // Loads benchmark dataset for Demo Student to enable immediate testing.
  const handleLoadDemoPreset = () => {
    setFullName("Demo Student");
    setCollegeName("Demo Engineering Institute");
    setDegreeField("Computer Science");
    setCurrentYear(2);
    setSkills([
      { name: "Python", level: 75 },
      { name: "C++", level: 65 },
      { name: "JavaScript", level: 50 },
      { name: "React", level: 40 },
      { name: "SQL", level: 70 },
      { name: "Git", level: 55 },
      { name: "Statistics", level: 60 },
      { name: "Machine Learning", level: 45 },
      { name: "Linear Algebra", level: 65 },
    ]);
  };

  // Appends a skill to the student repertoire with default 50% score if not already present.
  const handleAddSkill = (skillNameToAdd?: string) => {
    const name = (skillNameToAdd || newSkillName).trim();
    if (!name) return;
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;

    setSkills([...skills, { name, level: 50 }]);
    setNewSkillName("");
  };

  // Dynamically updates a skill proficiency level when the user drags the continuous slider.
  const handleUpdateSkill = (index: number, level: number) => {
    const updated = [...skills];
    updated[index].level = level;
    setSkills(updated);
  };

  // Deletes an individual skill entry from the student profile.
  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Evaluates top-10 roles against anchor specifications via the intelligence engine.
  const fetchPredictedRoles = async () => {
    setIsPredictingRoles(true);
    setPredictionError(null);
    try {
      const ratingsDict: Record<string, number> = {};
      skills.forEach((s) => {
        ratingsDict[s.name] = s.level;
      });

      const roles = await getTopRoles(ratingsDict, degreeField);
      setPredictedRoles(roles);
      if (roles.length > 0) {
        setSelectedRoleSlug(roles[0].slug);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to predict market roles.";
      setPredictionError(msg);
    } finally {
      setIsPredictingRoles(false);
    }
  };

  // Finalizes onboarding, persists profile, and transitions smoothly to the separate Analysis Portal screen.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAboutYouComplete) return;

    const ratingsDict: Record<string, number> = {};
    skills.forEach((s) => {
      ratingsDict[s.name] = s.level;
    });

    const profileData: StudentProfileData = {
      full_name: fullName.trim(),
      degree_field: degreeField,
      current_year_of_study: currentYear,
      graduation_year: 2026,
      institution_name: collegeName.trim(),
      region: "Central India",
      department: "Computer Science & Engineering",
      career_intent: "Technical Placement",
      target_work_mobility: "Pan-India",
      target_role_slug: selectedRoleSlug,
      skills: ratingsDict,
      is_demo_account: true,
    };

    try {
      await saveStudentProfile(profileData);
    } catch {
      // local fallback handled in client
    }

    const matchedRole = predictedRoles.find((r) => r.slug === selectedRoleSlug) || {
      role_id: selectedRoleSlug,
      slug: selectedRoleSlug,
      title: "Target Role",
      domain: "Engineering",
      match_percentage: 65,
      industry_demand: 9.0,
      primary_focus: "Technical Execution",
      why_match_rationale: "Selected benchmark for deep gap diagnostics.",
    };

    onComplete(profileData, matchedRole);
  };

  // Filter skills for the domain tab selector
  const displayedDomainSkills =
    activeDomainFilter === "All"
      ? DOMAIN_CRITICAL_SKILLS
      : DOMAIN_CRITICAL_SKILLS.filter((d) => d.domain === activeDomainFilter);

  return (
    <div style={{ maxWidth: "920px", width: "100%", margin: "0 auto", padding: "32px 16px" }}>
      {/* Top Banner Header with 1-Click Instant Demo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "24px",
          borderBottom: "1px solid var(--border-subtle)",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "20px",
              backgroundColor: "var(--brand-50)",
              border: "1px solid var(--border-strong)",
              color: "var(--brand-600)",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            <ShieldCheck size={14} />
            <span>Pravah · Pure Deterministic Career Intelligence</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
            Student Profile Onboarding
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Zero AI hallucination. Mathematical scoring derived from verified industry benchmarks across 6 domains.
          </p>
        </div>

        <button
          type="button"
          onClick={onInstantDemo}
          className="interactive-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            borderRadius: "10px",
            backgroundColor: "var(--brand-600)",
            color: "var(--bg-base)",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            boxShadow: "var(--shadow-elevation)",
          }}
        >
          <Sparkles size={16} />
          <span>Instant Demo (Demo Student)</span>
        </button>
      </div>

      {/* 3-Step Wizard Navigation Indicator */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
        {[
          { id: 1, label: "1. About You", icon: User },
          { id: 2, label: "2. Skill Matrix", icon: Sliders },
          { id: 3, label: "3. Target Role", icon: Compass },
        ].map((s) => {
          const Icon = s.icon;
          const isCurrent = step === s.id;
          const isDone = step > s.id;
          const isAccessible = s.id === 1 || (s.id === 2 && isAboutYouComplete) || (s.id === 3 && isAboutYouComplete && skills.length > 0);

          return (
            <button
              key={s.id}
              type="button"
              disabled={!isAccessible}
              onClick={() => {
                if (isAccessible) {
                  setStep(s.id);
                  if (s.id === 3 && predictedRoles.length === 0) {
                    fetchPredictedRoles();
                  }
                }
              }}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                textAlign: "left",
                backgroundColor: isCurrent ? "var(--bg-surface)" : "var(--bg-sunken)",
                border: isCurrent ? "2px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                color: isCurrent ? "var(--text-primary)" : isAccessible ? "var(--text-secondary)" : "var(--text-muted)",
                cursor: isAccessible ? "pointer" : "not-allowed",
                opacity: isAccessible ? 1 : 0.6,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontWeight: isCurrent ? 700 : 500,
                fontSize: "13px",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon size={16} color={isCurrent ? "var(--brand-600)" : isDone ? "var(--success)" : "currentColor"} />
                <span>{s.label}</span>
              </div>
              {isDone && <CheckCircle2 size={16} color="var(--success)" />}
            </button>
          );
        })}
      </div>

      {/* Rock-Solid Static Form Container */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "14px",
          padding: "32px",
          boxShadow: "var(--shadow-elevation)",
        }}
      >
        {/* STEP 1: ABOUT YOU */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Personal & Academic Profile
                </h2>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                  Used to calibrate degree discipline factors and institutional benchmarks. Both name and college are required.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadDemoPreset}
                style={{
                  fontSize: "12px",
                  color: "var(--brand-600)",
                  background: "none",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Fill Demo Data
              </button>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Full Name <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Demo Student"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-base)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            {/* Academic Institution / College: Pure input field with NO dropdown and NO suggestions */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                College / Academic Institution <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="Enter your college / university name (e.g. Indian Institute of Technology, Delhi)..."
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-base)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Degree Discipline / Major
                </label>
                <select
                  value={degreeField}
                  onChange={(e) => setDegreeField(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
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
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Current Year of Study
                </label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-base)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year (Final)</option>
                </select>
              </div>
            </div>

            {/* Validation Alert when About-You is incomplete */}
            {!isAboutYouComplete && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                }}
              >
                <AlertCircle size={15} color="var(--warning)" />
                <span>Please provide both your <strong>Full Name</strong> and <strong>College Name</strong> to unlock the Skill Matrix.</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)" }}>
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
                  padding: "10px 22px",
                  borderRadius: "8px",
                  backgroundColor: "var(--brand-600)",
                  color: "var(--bg-base)",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  cursor: isAboutYouComplete ? "pointer" : "not-allowed",
                  opacity: isAboutYouComplete ? 1 : 0.45,
                }}
              >
                <span>Continue to Skill Matrix</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SKILL MATRIX (6 DOMAINS) */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Self-Evaluated Skill Repertoire
                </h2>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                  Select critical skills across the 6 core engineering domains and rate your proficiency (0–100%).
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadDemoPreset}
                style={{
                  fontSize: "12px",
                  color: "var(--brand-600)",
                  background: "none",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Load Demo Skills
              </button>
            </div>

            {/* Domain Filter Tabs */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <Layers size={14} color="var(--brand-600)" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Filter by Engineering Domain:
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["All", ...DOMAIN_CRITICAL_SKILLS.map((d) => d.domain)].map((dom) => {
                  const isSelected = activeDomainFilter === dom;
                  return (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => setActiveDomainFilter(dom)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "16px",
                        fontSize: "12px",
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? "var(--brand-600)" : "var(--bg-sunken)",
                        color: isSelected ? "var(--bg-base)" : "var(--text-primary)",
                        border: isSelected ? "1px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {dom}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Critical Skills Repository Grouped by Domain */}
            <div
              style={{
                backgroundColor: "var(--bg-sunken)",
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                maxHeight: "280px",
                overflowY: "auto",
              }}
            >
              {displayedDomainSkills.map((domGroup) => (
                <div key={domGroup.domain}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--brand-600)" }}>
                      {domGroup.domain}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {domGroup.description}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {domGroup.skills.map((skillName) => {
                      const isAdded = skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
                      return (
                        <button
                          key={skillName}
                          type="button"
                          onClick={() => handleAddSkill(skillName)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 10px",
                            borderRadius: "14px",
                            fontSize: "12px",
                            backgroundColor: isAdded ? "var(--brand-50)" : "var(--bg-surface)",
                            border: isAdded ? "1px solid var(--brand-600)" : "1px solid var(--border-strong)",
                            color: isAdded ? "var(--brand-600)" : "var(--text-primary)",
                            fontWeight: isAdded ? 700 : 500,
                            cursor: "pointer",
                          }}
                        >
                          {isAdded ? <CheckCircle2 size={12} color="var(--brand-600)" /> : <Plus size={12} />}
                          <span>{skillName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Skill Input */}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Type unlisted custom skill (e.g. Solidity, GraphQL, Rust)..."
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-base)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                style={{
                  padding: "9px 16px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Currently Evaluated Skills with Sliders */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Currently Rated Skills ({skills.length}):
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Continuous scale 0% to 100%
                </span>
              </div>

              {skills.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", backgroundColor: "var(--bg-sunken)", borderRadius: "8px", color: "var(--text-secondary)", fontSize: "13px" }}>
                  No skills added yet. Click any skill above or add a custom skill.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
                  {skills.map((skill, index) => (
                    <div
                      key={skill.name}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        backgroundColor: "var(--bg-base)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <span style={{ width: "140px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {skill.name}
                      </span>

                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={skill.level}
                          onChange={(e) => handleUpdateSkill(index, Number(e.target.value))}
                          style={{ flex: 1, accentColor: "var(--brand-600)", cursor: "pointer" }}
                        />
                        <span style={{ width: "42px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: "var(--brand-600)", fontFamily: "monospace" }}>
                          {skill.level}%
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                        title="Remove skill"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={15} />
                <span>Back to About You</span>
              </button>

              <button
                type="button"
                disabled={skills.length === 0}
                onClick={() => {
                  setStep(3);
                  fetchPredictedRoles();
                }}
                className="interactive-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 22px",
                  borderRadius: "8px",
                  backgroundColor: "var(--brand-600)",
                  color: "var(--bg-base)",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  cursor: skills.length > 0 ? "pointer" : "not-allowed",
                  opacity: skills.length > 0 ? 1 : 0.5,
                }}
              >
                <Sparkles size={15} />
                <span>Predict Top 10 Target Roles</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TARGET ROLE SELECTION */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Top 10 Target Market Roles
                </h2>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                  Evaluated your {skills.length} skills against industry benchmarks. Select target role to launch analysis.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchPredictedRoles}
                disabled={isPredictingRoles}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--brand-50)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--brand-600)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <TrendingUp size={14} />
                <span>Re-Calculate Roles</span>
              </button>
            </div>

            {/* Error banner if any */}
            {predictionError && (
              <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--danger-bg)", color: "var(--danger)", fontSize: "12px" }}>
                {predictionError}
              </div>
            )}

            {/* Loading animation */}
            {isPredictingRoles && (
              <div style={{ padding: "36px", textAlign: "center", backgroundColor: "var(--bg-sunken)", borderRadius: "10px" }}>
                <Sparkles size={24} color="var(--brand-600)" style={{ animation: "spin 1s linear infinite", marginBottom: "8px" }} />
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                  Computing multi-role alignments against 10 anchor specifications...
                </p>
              </div>
            )}

            {/* Roles Grid */}
            {!isPredictingRoles && predictedRoles.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "12px", maxHeight: "420px", overflowY: "auto", paddingRight: "4px" }}>
                {predictedRoles.map((role, idx) => {
                  const isSelected = selectedRoleSlug === role.slug;
                  return (
                    <div
                      key={role.slug}
                      onClick={() => setSelectedRoleSlug(role.slug)}
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        backgroundColor: isSelected ? "var(--bg-base)" : "var(--bg-sunken)",
                        border: isSelected ? "2px solid var(--brand-600)" : "1px solid var(--border-subtle)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)", fontFamily: "monospace" }}>
                              #{idx + 1}
                            </span>
                            <h3 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                              {role.title}
                            </h3>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: isSelected ? "var(--brand-600)" : "var(--text-secondary)", fontFamily: "monospace", marginTop: "2px", display: "inline-block" }}>
                            {role.match_percentage.toFixed(1)}% Match
                          </span>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand-600)", fontFamily: "monospace" }}>
                            {role.industry_demand.toFixed(1)}/10
                          </span>
                          <span style={{ fontSize: "9px", color: "var(--text-muted)", display: "block", textTransform: "uppercase" }}>
                            Demand
                          </span>
                          {isSelected && <CheckCircle2 size={16} color="var(--brand-600)" style={{ marginTop: "4px", marginLeft: "auto" }} />}
                        </div>
                      </div>

                      <p style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.4, margin: 0 }}>
                        {role.why_match_rationale}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)" }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={15} />
                <span>Back to Skill Matrix</span>
              </button>

              <button
                type="submit"
                disabled={predictedRoles.length === 0}
                className="interactive-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  backgroundColor: "var(--success)",
                  color: "#052e16",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  cursor: predictedRoles.length > 0 ? "pointer" : "not-allowed",
                  boxShadow: "var(--shadow-elevation)",
                }}
              >
                <span>
                  Launch Intelligence Engine with {predictedRoles.find((r) => r.slug === selectedRoleSlug)?.title || "Target Role"}
                </span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
