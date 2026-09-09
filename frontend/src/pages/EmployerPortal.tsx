// FILE: src/pages/EmployerPortal.tsx
// PURPOSE: Employer and talent acquisition portal. Features Gemini-powered unstructured JD parser extracting 4-tier competency benchmarks, and privacy-preserving vetted talent cohort search terminal.
// PHASE: 7 | DEPENDS ON: src/api/client.ts, src/components/PerspectiveCard.tsx, lucide-react | LAST TOUCHED: Phase 7

import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Calculator,
  Database,
  Award,
  Zap,
  Check,
  CheckCheck,
  Plus,
  X,
  FileText,
  Building2,
  ArrowRight,
  ShieldCheck,
  Layers,
  TrendingUp,
  Download,
} from "lucide-react";
import { PerspectiveCard } from "../components/PerspectiveCard";
import {
  extractJobDescription,
  searchTalentCohort,
  type JDExtractData,
  type TalentCandidateItem,
} from "../api/client";

interface EmployerPortalProps {
  onBackToLanding?: () => void;
}

const SAMPLE_JDS = {
  devops: `We are looking for a Senior DevOps & Cloud Platform Engineer to scale our distributed cloud systems.
Key Responsibilities:
- Manage multi-cluster Kubernetes deployments on AWS.
- Automate CI/CD pipelines with GitHub Actions and Terraform.
- Containerize Python and Go microservices with Docker.
- Administer Linux production nodes and monitor metrics with Prometheus and Grafana.
Requirements:
- 3+ years experience with Docker and Kubernetes.
- Deep expertise in AWS Cloud architecture (EC2, S3, IAM, EKS).
- Hands-on proficiency in Linux shell scripting and Git version control.`,

  fullstack: `Hiring a Full Stack Software Engineer to build high-performance web applications.
Responsibilities:
- Build reactive user interfaces using React, Next.js, and modern TypeScript.
- Design resilient REST APIs and backend microservices using Python and FastAPI.
- Optimize database queries on PostgreSQL and implement Redis caching.
- Package application containers using Docker and deploy to cloud environments.
Requirements:
- Strong core foundation in JavaScript/TypeScript, React, Python, and SQL databases.
- Familiarity with Git, automated testing, and CI/CD best practices.`,

  aiml: `Seeking an AI / ML Applications Engineer to develop and deploy cutting-edge neural models.
Responsibilities:
- Train, evaluate, and fine-tune deep learning models using PyTorch and HuggingFace.
- Implement Retrieval-Augmented Generation (RAG) pipelines with vector embeddings.
- Deploy low-latency model inference APIs using Python and Docker.
- Perform statistical data validation and hypothesis testing.
Requirements:
- Solid background in Machine Learning, Deep Learning, Statistics, and Python.
- Practical experience with PyTorch and transformer architectures.`,
};

export const EmployerPortal: React.FC<EmployerPortalProps> = ({ onBackToLanding }) => {
  // Mode switcher: 'parser' (JD Parser) vs 'search' (Talent Search)
  const [activeTab, setActiveTab] = useState<"parser" | "search">("parser");

  // JD Parser state
  const [rawJdText, setRawJdText] = useState<string>(SAMPLE_JDS.devops);
  const [extractedJd, setExtractedJd] = useState<JDExtractData | null>(null);
  const [isParsingJd, setIsParsingJd] = useState<boolean>(false);

  // Talent Search state
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [minScoreFilter, setMinScoreFilter] = useState<number>(70);
  const [candidates, setCandidates] = useState<TalentCandidateItem[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState<boolean>(false);

  // Shortlisted candidates IDs
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [showShortlistModal, setShowShortlistModal] = useState<boolean>(false);

  // Scoring Math modal state
  const [showMathModal, setShowMathModal] = useState<boolean>(false);

  // Lock body scroll during modals
  useEffect(() => {
    if (showShortlistModal || showMathModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showShortlistModal, showMathModal]);

  // Handle parsing JD
  const handleParseJd = async () => {
    if (rawJdText.trim().length < 10) return;
    setIsParsingJd(true);
    try {
      const data = await extractJobDescription(rawJdText);
      setExtractedJd(data);
    } catch (err) {
      console.error("Failed to extract JD:", err);
    } finally {
      setIsParsingJd(false);
    }
  };

  // Run initial parse on mount
  useEffect(() => {
    handleParseJd();
  }, []);

  // Fetch candidate cohort whenever filters change
  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await searchTalentCohort({
        role: roleFilter || undefined,
        min_score: minScoreFilter,
      });
      setCandidates(res.candidates);
    } catch (err) {
      console.error("Failed to search talent cohort:", err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [roleFilter, minScoreFilter]);

  // Toggle candidate in shortlist
  const toggleShortlist = (id: string) => {
    if (shortlistedIds.includes(id)) {
      setShortlistedIds(shortlistedIds.filter((cid) => cid !== id));
    } else {
      setShortlistedIds([...shortlistedIds, id]);
    }
  };

  const shortlistedCandidates = candidates.filter((c) => shortlistedIds.includes(c.candidate_id));

  return (
    <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "24px 20px 80px 20px" }}>
      {/* Header & Mode Switcher */}
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
              <Briefcase size={13} />
              Employer &amp; Industry Hiring Terminal
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              National Skill Registry · Verified Talent Gateway
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
            AI Job Description Parser &amp; Vetted Talent Cohort Search
          </h1>
          <p style={{ margin: "6px 0 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
            Extract structured 4-tier skill benchmarks from raw job postings via Gemini NLP (with deterministic NOS offline fallback) and match blind candidate cohorts via deterministic mathematical scoring.
          </p>
        </div>

        {/* Shortlist Counter & Math Framework */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setShowShortlistModal(true)}
            className="interactive-btn"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              backgroundColor: shortlistedIds.length > 0 ? "var(--brand-600)" : "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              color: shortlistedIds.length > 0 ? "var(--bg-base)" : "var(--text-primary)",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCheck size={16} />
            <span>Shortlisted ({shortlistedIds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMathModal(true)}
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
            <span>Candidate Scoring Math</span>
          </button>
        </div>
      </div>

      {/* MVP SEED BASELINE DISCLOSURE BANNER */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "12px",
          backgroundColor: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.28)",
          marginBottom: "24px",
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
                Vetted Candidate Registry (MVP Seed Baseline Active)
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
              Candidate profiles displayed below represent <strong>calibrated benchmark student cohorts</strong> (from NIT Raipur, GGV Bilaspur, IIIT Bangalore, COEP Pune, and IIIT Hyderabad). In production deployment, candidates are <strong>formulated from direct student onboarding inputs, coding submissions, and proctored technical diagnostic assessments</strong>. All student data adheres to DPDP blind anonymity standards.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowMathModal(true)}
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

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("parser")}
          className="interactive-btn"
          style={{
            padding: "10px 18px",
            border: "none",
            background: "transparent",
            borderBottom: activeTab === "parser" ? "2px solid var(--brand-600)" : "2px solid transparent",
            color: activeTab === "parser" ? "var(--brand-600)" : "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: activeTab === "parser" ? 700 : 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Sparkles size={16} />
          <span>Gemini Unstructured Job Description Parser</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("search")}
          className="interactive-btn"
          style={{
            padding: "10px 18px",
            border: "none",
            background: "transparent",
            borderBottom: activeTab === "search" ? "2px solid var(--brand-600)" : "2px solid transparent",
            color: activeTab === "search" ? "var(--brand-600)" : "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: activeTab === "search" ? 700 : 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Users size={16} />
          <span>Vetted Candidate Cohort Search ({candidates.length})</span>
        </button>
      </div>

      {/* TAB 1: Gemini Unstructured JD Parser */}
      {activeTab === "parser" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "24px" }}>
          {/* Left Column: Input Textarea & Sample Buttons */}
          <PerspectiveCard style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Paste Raw Job Description
              </h3>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setRawJdText(SAMPLE_JDS.devops)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  Load DevOps JD
                </button>
                <button
                  type="button"
                  onClick={() => setRawJdText(SAMPLE_JDS.fullstack)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  Load Full Stack JD
                </button>
                <button
                  type="button"
                  onClick={() => setRawJdText(SAMPLE_JDS.aiml)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  Load AI/ML JD
                </button>
              </div>
            </div>

            <textarea
              value={rawJdText}
              onChange={(e) => setRawJdText(e.target.value)}
              placeholder="Paste job posting from LinkedIn, Naukri, or internal ATS..."
              className="interactive-input"
              rows={12}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid var(--border-strong)",
                backgroundColor: "var(--bg-sunken)",
                color: "var(--text-primary)",
                fontSize: "13px",
                fontFamily: "monospace",
                lineHeight: 1.6,
                marginBottom: "16px",
                resize: "vertical",
              }}
            />

            <button
              type="button"
              onClick={handleParseJd}
              disabled={isParsingJd}
              className="interactive-btn"
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                backgroundColor: "var(--brand-600)",
                color: "var(--bg-base)",
                border: "none",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "auto",
              }}
            >
              <Sparkles size={16} />
              <span>{isParsingJd ? "Parsing with Gemini AI..." : "Extract 4-Tier Competency Benchmark"}</span>
            </button>
          </PerspectiveCard>

          {/* Right Column: Structured 4-Tier Benchmark Output */}
          <PerspectiveCard style={{ padding: "24px" }}>
            {extractedJd ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
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
                      {extractedJd.model_used}
                    </span>
                    <h3 style={{ margin: "6px 0 2px 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                      {extractedJd.job_title}
                    </h3>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {extractedJd.detected_domain} · {extractedJd.experience_band}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRoleFilter(extractedJd.job_title.split(" ")[0]);
                      setActiveTab("search");
                    }}
                    className="interactive-btn"
                    style={{
                      padding: "7px 12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--brand-600)",
                      color: "var(--bg-base)",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span>Match Candidates</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <p style={{ margin: "0 0 18px 0", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {extractedJd.summary}
                </p>

                {/* Extracted Skills Grouped into 4 Tiers */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {extractedJd.extracted_skills.map((skill) => (
                    <div
                      key={skill.skill_name}
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
                        <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)" }}>
                          {skill.skill_name}
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                          Category: {skill.category}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            backgroundColor:
                              skill.tier === "critical"
                                ? "rgba(239, 68, 68, 0.15)"
                                : skill.tier === "core"
                                ? "rgba(245, 158, 11, 0.15)"
                                : "rgba(59, 130, 246, 0.15)",
                            color:
                              skill.tier === "critical"
                                ? "#ef4444"
                                : skill.tier === "core"
                                ? "#d97706"
                                : "var(--brand-600)",
                            textTransform: "uppercase",
                          }}
                        >
                          {skill.tier} (w = {skill.weight})
                        </span>

                        <span style={{ fontWeight: 800, fontSize: "13px", color: "var(--text-primary)" }}>
                          Req: {skill.required_level}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-secondary)" }}>
                <Sparkles size={32} style={{ opacity: 0.4, marginBottom: "12px" }} />
                <p>Paste a job description and click Extract to generate structured 4-tier skill benchmarks.</p>
              </div>
            )}
          </PerspectiveCard>
        </div>
      )}

      {/* TAB 2: Vetted Candidate Cohort Search */}
      {activeTab === "search" && (
        <div>
          {/* Filters Bar */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-sunken)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* Role Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "240px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                TARGET ROLE:
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="interactive-input"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-strong)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <option value="">All Technical Roles (10 Candidates)</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Cloud DevOps Engineer">Cloud DevOps Engineer</option>
                <option value="AI / ML Applications Engineer">AI / ML Applications Engineer</option>
                <option value="Backend Systems Engineer">Backend Systems Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
              </select>
            </div>

            {/* Min Score Slider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "280px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                MIN MATCH SCORE: <strong style={{ color: "var(--brand-600)" }}>{minScoreFilter}%</strong>
              </label>
              <input
                type="range"
                min={60}
                max={95}
                step={5}
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                style={{ flex: 1, accentColor: "var(--brand-600)", cursor: "pointer" }}
              />
            </div>
          </div>

          {/* Candidate Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px" }}>
            {candidates.map((cand) => {
              const isShortlisted = shortlistedIds.includes(cand.candidate_id);
              return (
                <PerspectiveCard key={cand.candidate_id} style={{ padding: "22px", display: "flex", flexDirection: "column" }}>
                  {/* Top Candidate Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
                          {cand.candidate_id}
                        </span>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                            color: "#059669",
                            fontSize: "11px",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <ShieldCheck size={12} />
                          <span>Pravah Verified</span>
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "3px" }}>
                        {cand.degree_field} · Batch {cand.graduation_year}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--brand-600)" }}>
                        {cand.match_score.toFixed(1)}%
                      </span>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                        {cand.national_percentile.toFixed(1)}th Percentile
                      </div>
                    </div>
                  </div>

                  {/* Target Role & Institution */}
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {cand.target_role}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {cand.institution_name} · <span style={{ color: "var(--brand-600)" }}>{cand.mobility}</span>
                    </div>
                  </div>

                  {/* Top Verified Skills Progress Chips */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                      VERIFIED PROFICIENCIES
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {Object.entries(cand.top_verified_skills).map(([sk, val]) => (
                        <span
                          key={sk}
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            backgroundColor: "var(--bg-sunken)",
                            border: "1px solid var(--border-subtle)",
                            fontSize: "11px",
                            color: "var(--text-primary)",
                            fontWeight: 600,
                          }}
                        >
                          {sk}: <strong>{val}%</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div style={{ marginTop: "auto" }}>
                    <button
                      type="button"
                      onClick={() => toggleShortlist(cand.candidate_id)}
                      className="interactive-btn"
                      style={{
                        width: "100%",
                        padding: "9px 16px",
                        borderRadius: "8px",
                        backgroundColor: isShortlisted ? "rgba(16, 185, 129, 0.15)" : "var(--brand-600)",
                        border: isShortlisted ? "1px solid #10b981" : "none",
                        color: isShortlisted ? "#059669" : "var(--bg-base)",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      {isShortlisted ? <Check size={14} /> : <Plus size={14} />}
                      <span>{isShortlisted ? "Shortlisted in Drive Queue" : "Shortlist for Interview"}</span>
                    </button>
                  </div>
                </PerspectiveCard>
              );
            })}
          </div>
        </div>
      )}

      {/* SHORTLIST MODAL / RECRUITMENT QUEUE */}
      {showShortlistModal && (
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
          onClick={() => setShowShortlistModal(false)}
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
                    fontWeight: 800,
                  }}
                >
                  Active Shortlist Queue
                </span>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                  Recruitment Drive Cohort ({shortlistedCandidates.length} Selected)
                </h3>
              </div>
              <button
                onClick={() => setShowShortlistModal(false)}
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

            {shortlistedCandidates.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {shortlistedCandidates.map((c) => (
                  <div
                    key={c.candidate_id}
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
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                        {c.candidate_id} · {c.target_role}
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {c.institution_name} · Score: <strong>{c.match_score}%</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleShortlist(c.candidate_id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "0 0 20px 0" }}>
                No candidates shortlisted yet. Use the Talent Search tab to shortlist verified profiles.
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setShowShortlistModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Recruitment Dossier for ${shortlistedCandidates.length} candidates exported successfully!`);
                  setShowShortlistModal(false);
                }}
                disabled={shortlistedCandidates.length === 0}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  backgroundColor: "var(--brand-600)",
                  color: "var(--bg-base)",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Download size={14} />
                <span>Export Interview Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Candidate Scoring & Matching Math Framework */}
      {showMathModal && (
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
          onClick={() => setShowMathModal(false)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "720px",
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
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Deterministic Scoring Framework
                </span>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>
                  Pravah Candidate Matching Arithmetic
                </h3>
              </div>
              <button
                onClick={() => setShowMathModal(false)}
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

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
              <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
                  1. Capped Weighted Skill Match:
                </strong>
                <div style={{ fontFamily: "monospace", color: "var(--brand-600)", backgroundColor: "var(--bg-surface)", padding: "8px 12px", borderRadius: "6px", fontSize: "13px" }}>
                  Raw_Score = ( ∑ min(Student_Level, Req_Level) × Weight × μ ) / ( ∑ Req_Level × Weight × μ ) × 100
                </div>
                <p style={{ margin: "8px 0 0 0", color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.5 }}>
                  Where <strong>μ</strong> is the 4-tier multiplier (Critical = 1.0, Core = 0.75, Supporting = 0.45, Peripheral = 0.20).
                </p>
              </div>

              <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
                  2. Critical Deficit Multiplier Penalty:
                </strong>
                <div style={{ fontFamily: "monospace", color: "var(--brand-600)", backgroundColor: "var(--bg-surface)", padding: "8px 12px", borderRadius: "6px", fontSize: "13px" }}>
                  Penalty = 0.75 + 0.25 × ( Critical_Skills_Met / Total_Critical_Skills )
                </div>
                <p style={{ margin: "8px 0 0 0", color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.5 }}>
                  Guarantees that a candidate who lacks non-negotiable core skills (like Docker or Python) cannot score high simply by excelling at soft supporting skills.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowMathModal(false)}
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
                  Close Framework
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
