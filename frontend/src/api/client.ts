// FILE: src/api/client.ts
// PURPOSE: Unified HTTP API client for all Pravah backend endpoints with type safety and deterministic fallback.
// PHASE: 5 | DEPENDS ON: src/types/student.ts | LAST TOUCHED: Phase 5

import type {
  CapstoneBrief,
  GapAnalysisResult,
  MatchCalculationResult,
  RoadmapMilestone,
  RoadmapResult,
  RoleMatchSummary,
  SkillGapItem,
  StudentProfileData,
  WhatIfSimulateResult,
} from "../types/student";

// Uses relative path to leverage Vite development server reverse proxy
const API_BASE = "/api/v1";

// 10 Anchor roles specifications with exact requirement weights for client-side deterministic fallback
export const ANCHOR_ROLES_DATA = [
  {
    role_id: "frontend-dev",
    slug: "frontend-developer",
    title: "Frontend Developer",
    domain: "Frontend Engineering",
    industry_demand: 9.2,
    primary_focus: "Web applications, interactive UI components, and client-side performance.",
    skills: [
      { id: "html", name: "HTML", required: 85, weight: 8.0, category: "critical" },
      { id: "css", name: "CSS", required: 80, weight: 7.0, category: "core" },
      { id: "javascript", name: "JavaScript", required: 85, weight: 9.0, category: "critical" },
      { id: "typescript", name: "TypeScript", required: 75, weight: 7.5, category: "core" },
      { id: "react", name: "React", required: 80, weight: 8.5, category: "critical" },
      { id: "git", name: "Git", required: 70, weight: 6.0, category: "supporting" },
      { id: "rest-apis", name: "REST APIs", required: 75, weight: 7.0, category: "core" },
      { id: "responsive-design", name: "Responsive Design", required: 80, weight: 7.0, category: "core" },
    ],
  },
  {
    role_id: "backend-dev",
    slug: "backend-developer",
    title: "Backend Developer",
    domain: "Backend & Systems",
    industry_demand: 9.0,
    primary_focus: "Scalable backend microservices, database transactions, and robust API contracts.",
    skills: [
      { id: "python", name: "Python", required: 80, weight: 8.5, category: "critical" },
      { id: "java", name: "Java", required: 75, weight: 7.5, category: "core" },
      { id: "c", name: "C++", required: 70, weight: 6.5, category: "supporting" },
      { id: "sql", name: "SQL", required: 85, weight: 9.0, category: "critical" },
      { id: "rest-apis", name: "REST APIs", required: 85, weight: 9.0, category: "critical" },
      { id: "databases", name: "Databases", required: 80, weight: 8.0, category: "core" },
      { id: "git", name: "Git", required: 70, weight: 6.0, category: "supporting" },
      { id: "system-design", name: "System Design", required: 75, weight: 8.0, category: "critical" },
    ],
  },
  {
    role_id: "ai-ml-engineer",
    slug: "ai-ml-engineer",
    title: "AI/ML Engineer",
    domain: "AI & Machine Learning",
    industry_demand: 9.8,
    primary_focus: "Machine learning pipelines, deep neural architectures, and model inference.",
    skills: [
      { id: "python", name: "Python", required: 85, weight: 9.5, category: "critical" },
      { id: "linear-algebra", name: "Linear Algebra", required: 75, weight: 7.5, category: "core" },
      { id: "probability", name: "Probability", required: 75, weight: 7.0, category: "core" },
      { id: "statistics", name: "Statistics", required: 80, weight: 8.5, category: "critical" },
      { id: "machine-learning", name: "Machine Learning", required: 80, weight: 9.5, category: "critical" },
      { id: "numpy", name: "NumPy", required: 75, weight: 7.0, category: "core" },
      { id: "pandas", name: "Pandas", required: 80, weight: 8.0, category: "core" },
      { id: "sql", name: "SQL", required: 75, weight: 7.0, category: "core" },
      { id: "deep-learning", name: "Deep Learning", required: 75, weight: 8.5, category: "critical" },
    ],
  },
  {
    role_id: "data-analyst",
    slug: "data-analyst",
    title: "Data Analyst",
    domain: "Data Analytics",
    industry_demand: 8.8,
    primary_focus: "Exploratory data analysis, business metric telemetry, and interactive dashboards.",
    skills: [
      { id: "sql", name: "SQL", required: 85, weight: 9.5, category: "critical" },
      { id: "excel", name: "Excel", required: 80, weight: 7.5, category: "core" },
      { id: "statistics", name: "Statistics", required: 75, weight: 8.0, category: "core" },
      { id: "python", name: "Python", required: 70, weight: 7.0, category: "supporting" },
      { id: "pandas", name: "Pandas", required: 75, weight: 7.5, category: "core" },
      { id: "data-visualization", name: "Data Visualization", required: 80, weight: 8.5, category: "critical" },
      { id: "power-bi", name: "Power BI", required: 75, weight: 7.5, category: "core" },
      { id: "communication", name: "Communication", required: 80, weight: 7.0, category: "core" },
    ],
  },
  {
    role_id: "fullstack-dev",
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    domain: "Full Stack Systems",
    industry_demand: 9.5,
    primary_focus: "End-to-end full stack architecture connecting reactive UIs with distributed APIs.",
    skills: [
      { id: "javascript", name: "JavaScript", required: 85, weight: 9.0, category: "critical" },
      { id: "typescript", name: "TypeScript", required: 80, weight: 8.0, category: "core" },
      { id: "react", name: "React", required: 80, weight: 8.0, category: "core" },
      { id: "node-js", name: "Node.js", required: 80, weight: 8.0, category: "core" },
      { id: "python", name: "Python", required: 75, weight: 7.5, category: "core" },
      { id: "sql", name: "SQL", required: 80, weight: 8.0, category: "core" },
      { id: "git", name: "Git", required: 75, weight: 6.5, category: "core" },
      { id: "rest-apis", name: "REST APIs", required: 85, weight: 9.0, category: "critical" },
      { id: "system-design", name: "System Design", required: 75, weight: 8.0, category: "core" },
    ],
  },
  {
    role_id: "devops-engineer",
    slug: "devops-engineer",
    title: "DevOps Engineer",
    domain: "Cloud & DevOps",
    industry_demand: 9.4,
    primary_focus: "Infrastructure automation, container orchestration, and continuous delivery.",
    skills: [
      { id: "docker", name: "Docker", required: 85, weight: 9.0, category: "critical" },
      { id: "kubernetes", name: "Kubernetes", required: 80, weight: 9.0, category: "critical" },
      { id: "linux", name: "Linux", required: 85, weight: 9.0, category: "critical" },
      { id: "git", name: "Git", required: 80, weight: 7.0, category: "core" },
      { id: "python", name: "Python", required: 75, weight: 7.0, category: "core" },
      { id: "bash", name: "Bash", required: 80, weight: 7.5, category: "core" },
      { id: "aws", name: "AWS", required: 80, weight: 8.5, category: "core" },
      { id: "ci-cd", name: "CI/CD", required: 85, weight: 9.0, category: "critical" },
    ],
  },
  {
    role_id: "cloud-architect",
    slug: "cloud-solutions-architect",
    title: "Cloud Solutions Architect",
    domain: "Cloud Infrastructure",
    industry_demand: 9.6,
    primary_focus: "Enterprise cloud architecture, resilient multi-region infrastructure, and governance.",
    skills: [
      { id: "aws", name: "AWS", required: 85, weight: 9.5, category: "critical" },
      { id: "system-design", name: "System Design", required: 90, weight: 10.0, category: "critical" },
      { id: "docker", name: "Docker", required: 80, weight: 8.0, category: "core" },
      { id: "kubernetes", name: "Kubernetes", required: 80, weight: 8.5, category: "core" },
      { id: "networking", name: "Networking", required: 80, weight: 8.0, category: "core" },
      { id: "security", name: "Security", required: 85, weight: 9.0, category: "critical" },
      { id: "python", name: "Python", required: 70, weight: 6.5, category: "supporting" },
    ],
  },
  {
    role_id: "cybersecurity-analyst",
    slug: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    domain: "Cybersecurity",
    industry_demand: 9.3,
    primary_focus: "Threat intelligence, network penetration defense, and incident response.",
    skills: [
      { id: "security", name: "Security", required: 85, weight: 10.0, category: "critical" },
      { id: "networking", name: "Networking", required: 85, weight: 9.5, category: "critical" },
      { id: "linux", name: "Linux", required: 80, weight: 8.0, category: "core" },
      { id: "python", name: "Python", required: 75, weight: 7.5, category: "core" },
      { id: "penetration-testing", name: "Penetration Testing", required: 75, weight: 8.0, category: "core" },
      { id: "cryptography", name: "Cryptography", required: 70, weight: 7.0, category: "supporting" },
      { id: "siem", name: "SIEM", required: 80, weight: 8.0, category: "core" },
    ],
  },
  {
    role_id: "data-engineer",
    slug: "data-engineer",
    title: "Data Engineer",
    domain: "Data Engineering",
    industry_demand: 9.5,
    primary_focus: "Data pipelines, distributed stream ingestion, and modern analytical lakehouses.",
    skills: [
      { id: "python", name: "Python", required: 85, weight: 9.0, category: "critical" },
      { id: "sql", name: "SQL", required: 90, weight: 10.0, category: "critical" },
      { id: "spark", name: "Spark", required: 80, weight: 8.5, category: "core" },
      { id: "hadoop", name: "Hadoop", required: 75, weight: 7.5, category: "core" },
      { id: "kafka", name: "Kafka", required: 75, weight: 8.0, category: "core" },
      { id: "databases", name: "Databases", required: 85, weight: 9.0, category: "critical" },
      { id: "git", name: "Git", required: 70, weight: 6.0, category: "supporting" },
    ],
  },
  {
    role_id: "data-scientist",
    slug: "data-scientist",
    title: "Data Scientist",
    domain: "Data Science",
    industry_demand: 9.2,
    primary_focus: "Hypothesis testing, predictive statistical modeling, and experimental inference.",
    skills: [
      { id: "python", name: "Python", required: 85, weight: 9.0, category: "critical" },
      { id: "r", name: "R", required: 75, weight: 7.0, category: "core" },
      { id: "statistics", name: "Statistics", required: 85, weight: 9.5, category: "critical" },
      { id: "machine-learning", name: "Machine Learning", required: 85, weight: 9.5, category: "critical" },
      { id: "pandas", name: "Pandas", required: 85, weight: 8.5, category: "critical" },
      { id: "numpy", name: "NumPy", required: 80, weight: 7.5, category: "core" },
      { id: "sql", name: "SQL", required: 80, weight: 8.0, category: "core" },
      { id: "data-visualization", name: "Data Visualization", required: 80, weight: 7.5, category: "core" },
    ],
  },
];

// Resolves degree discipline multiplier exactly matching backend constants.py
function getDegreeMultiplier(degreeField: string): number {
  const d = (degreeField || "").toLowerCase().trim();
  if (d.includes("computer science")) return 1.0;
  if (d.includes("information technology")) return 0.95;
  if (d.includes("data science") || d.includes("artificial intelligence")) return 1.0;
  if (d.includes("electronics") || d.includes("communication")) return 0.9;
  if (d.includes("electrical") || d.includes("mechanical") || d.includes("civil") || d.includes("stem")) return 0.85;
  return 0.8;
}

// Resolves 4-tier category weight
function getTierMultiplier(cat: string): number {
  const c = (cat || "").toLowerCase().trim();
  if (c === "critical") return 1.0;
  if (c === "core") return 0.75;
  if (c === "supporting") return 0.45;
  return 0.2;
}

// Pure client-side deterministic evaluation reproducing Pravah mathematical engine exactly
export function evaluateStudentLocally(
  roleDef: typeof ANCHOR_ROLES_DATA[0],
  studentRatings: Record<string, number>,
  degreeField: string
) {
  const normRatings: Record<string, number> = {};
  for (const [k, v] of Object.entries(studentRatings)) {
    normRatings[k.toLowerCase().trim()] = Number(v) || 0;
  }

  let totalCappedWeighted = 0;
  let totalRequiredWeighted = 0;
  let criticalTotal = 0;
  let criticalMet = 0;

  for (const s of roleDef.skills) {
    const sId = s.id.toLowerCase();
    const sName = s.name.toLowerCase();
    const studentLvl = normRatings[sId] ?? normRatings[sName] ?? 0;
    const requiredLvl = s.required;
    const capped = Math.min(studentLvl, requiredLvl);
    const mu = getTierMultiplier(s.category);

    totalCappedWeighted += capped * s.weight * mu;
    totalRequiredWeighted += requiredLvl * s.weight * mu;

    if (s.category === "critical") {
      criticalTotal++;
      if (studentLvl >= requiredLvl) {
        criticalMet++;
      }
    }
  }

  const rawScore = totalRequiredWeighted > 0 ? (totalCappedWeighted / totalRequiredWeighted) * 100 : 0;
  const criticalPenalty = criticalTotal > 0 ? 0.75 + 0.25 * (criticalMet / criticalTotal) : 1.0;
  const degreeMultiplier = getDegreeMultiplier(degreeField);
  const finalScore = Math.min(100, Math.max(0, rawScore * criticalPenalty * degreeMultiplier));

  return {
    rawScore: Number(rawScore.toFixed(2)),
    criticalPenalty: Number(criticalPenalty.toFixed(4)),
    degreeMultiplier: Number(degreeMultiplier.toFixed(2)),
    finalScore: Number(finalScore.toFixed(2)),
    totalCappedWeighted: Number(totalCappedWeighted.toFixed(2)),
    totalRequiredWeighted: Number(totalRequiredWeighted.toFixed(2)),
    criticalMet,
    criticalTotal,
  };
}

// Helper handling fetch with fallback to 127.0.0.1 and client calculation
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch {
    // If relative fails, attempt direct 127.0.0.1
    if (url.startsWith("/api")) {
      const fallbackUrl = `http://127.0.0.1:8000${url}`;
      const res2 = await fetch(fallbackUrl, {
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
        ...options,
      });
      if (res2.ok) return (await res2.json()) as T;
    }
  }
  throw new Error("Network request failed");
}

// Calls /matching/calculate-match or evaluates deterministically
export async function calculateMatch(
  roleId: string,
  studentRatings: Record<string, number>,
  degreeDiscipline: string = "Computer Science"
): Promise<MatchCalculationResult> {
  try {
    return await fetchJson<MatchCalculationResult>(`${API_BASE}/matching/calculate-match`, {
      method: "POST",
      body: JSON.stringify({
        role_id: roleId,
        student_ratings: studentRatings,
        degree_discipline: degreeDiscipline,
      }),
    });
  } catch {
    // Deterministic fallback matching backend equations
    const role = ANCHOR_ROLES_DATA.find((r) => r.slug === roleId || r.role_id === roleId) || ANCHOR_ROLES_DATA[0];
    const calc = evaluateStudentLocally(role, studentRatings, degreeDiscipline);
    return {
      role_id: role.role_id,
      role_title: role.title,
      raw_match_score: calc.rawScore,
      critical_penalty: calc.criticalPenalty,
      education_factor: calc.degreeMultiplier,
      final_readiness_score: calc.finalScore,
      inspect_math: {
        formula: "Readiness = Raw Match (capped_weighted / req_weighted) x Critical Penalty (0.75 + 0.25 x met/total) x Degree Multiplier",
        capped_sum: calc.totalCappedWeighted,
        required_sum: calc.totalRequiredWeighted,
        critical_skills_met: calc.criticalMet,
        critical_skills_total: calc.criticalTotal,
        critical_penalty_factor: calc.criticalPenalty,
        degree_multiplier: calc.degreeMultiplier,
      },
    };
  }
}

// Calls /matching/calculate-gaps or generates 4-tier matrix deterministically
export async function calculateGaps(
  roleId: string,
  studentRatings: Record<string, number>,
  _degreeDiscipline: string = "Computer Science"
): Promise<GapAnalysisResult> {
  try {
    return await fetchJson<GapAnalysisResult>(`${API_BASE}/matching/calculate-gaps`, {
      method: "POST",
      body: JSON.stringify({
        role_id: roleId,
        student_ratings: studentRatings,
        degree_discipline: _degreeDiscipline,
      }),
    });
  } catch {
    const role = ANCHOR_ROLES_DATA.find((r) => r.slug === roleId || r.role_id === roleId) || ANCHOR_ROLES_DATA[0];
    const normRatings: Record<string, number> = {};
    for (const [k, v] of Object.entries(studentRatings)) normRatings[k.toLowerCase().trim()] = Number(v) || 0;

    const critical_gaps: SkillGapItem[] = [];
    const core_gaps: SkillGapItem[] = [];
    const supporting_gaps: SkillGapItem[] = [];
    const strengths: SkillGapItem[] = [];

    for (const s of role.skills) {
      const studentLvl = normRatings[s.id.toLowerCase()] ?? normRatings[s.name.toLowerCase()] ?? 0;
      const gap = Math.max(0, s.required - studentLvl);
      const tier: "critical" | "core" | "supporting" | "strengths" =
        gap === 0 ? "strengths" : s.category === "critical" ? "critical" : s.category === "core" ? "core" : "supporting";
      const item: SkillGapItem = {
        skill_id: s.id,
        skill_name: s.name,
        category: "Technical",
        requirement_category: s.category,
        tier_category: tier,
        required_level: s.required,
        student_level: studentLvl,
        gap,
        severity: Number(((gap / 100) * s.weight).toFixed(2)),
        tier_weight: getTierMultiplier(s.category),
        role_importance: s.weight,
      };


      if (gap === 0) {
        strengths.push(item);
      } else if (s.category === "critical") {
        critical_gaps.push(item);
      } else if (s.category === "core") {
        core_gaps.push(item);
      } else {
        supporting_gaps.push(item);
      }
    }

    return {
      role_id: role.role_id,
      role_title: role.title,
      critical_gaps,
      core_gaps,
      supporting_gaps,
      strengths,
      total_gaps_count: critical_gaps.length + core_gaps.length + supporting_gaps.length,
    };
  }
}

// Calls /matching/what-if-simulate or executes live simulation projection
export async function whatIfSimulate(
  roleId: string,
  baselineRatings: Record<string, number>,
  targetSkill: string,
  simulatedRating: number,
  degreeDiscipline: string = "Computer Science"
): Promise<WhatIfSimulateResult> {
  try {
    return await fetchJson<WhatIfSimulateResult>(`${API_BASE}/matching/what-if-simulate`, {
      method: "POST",
      body: JSON.stringify({
        role_id: roleId,
        baseline_ratings: baselineRatings,
        target_skill: targetSkill,
        simulated_rating: simulatedRating,
        degree_discipline: degreeDiscipline,
      }),
    });
  } catch {
    const role = ANCHOR_ROLES_DATA.find((r) => r.slug === roleId || r.role_id === roleId) || ANCHOR_ROLES_DATA[0];
    const baseCalc = evaluateStudentLocally(role, baselineRatings, degreeDiscipline);
    const bumpedRatings = { ...baselineRatings, [targetSkill]: simulatedRating };
    const bumpedCalc = evaluateStudentLocally(role, bumpedRatings, degreeDiscipline);
    const gain = Number((bumpedCalc.finalScore - baseCalc.finalScore).toFixed(2));
    const isCrit = role.skills.some((s) => s.name.toLowerCase() === targetSkill.toLowerCase() && s.category === "critical");

    return {
      role_id: role.role_id,
      target_skill: targetSkill,
      baseline_score: baseCalc.finalScore,
      simulated_score: bumpedCalc.finalScore,
      projected_gain: gain,
      is_critical_skill: isCrit,
    };
  }
}

// Calls /matching/top-roles or evaluates all 10 anchor market roles
export async function getTopRoles(
  studentRatings: Record<string, number>,
  degreeDiscipline: string = "Computer Science"
): Promise<RoleMatchSummary[]> {
  try {
    const res = await fetchJson<{ roles: RoleMatchSummary[] }>(`${API_BASE}/matching/top-roles`, {
      method: "POST",
      body: JSON.stringify({
        role_id: "any",
        student_ratings: studentRatings,
        degree_discipline: degreeDiscipline,
      }),
    });
    if (res.roles && res.roles.length > 0) return res.roles;
  } catch {
    // Offline deterministic computation
  }

  const normRatings: Record<string, number> = {};
  for (const [k, v] of Object.entries(studentRatings)) normRatings[k.toLowerCase().trim()] = Number(v) || 0;

  const results: RoleMatchSummary[] = ANCHOR_ROLES_DATA.map((role) => {
    const calc = evaluateStudentLocally(role, studentRatings, degreeDiscipline);
    const matched = role.skills
      .filter((s) => (normRatings[s.id.toLowerCase()] ?? normRatings[s.name.toLowerCase()] ?? 0) >= s.required * 0.7)
      .map((s) => s.name);

    const rationale =
      matched.length > 0
        ? `Strong alignment with ${matched.length} requirements (${matched.slice(0, 3).join(", ")}).`
        : `Entry-level match; high market demand (${role.industry_demand}/10).`;

    return {
      role_id: role.role_id,
      slug: role.slug,
      title: role.title,
      domain: role.domain,
      match_percentage: calc.finalScore,
      industry_demand: role.industry_demand,
      primary_focus: role.primary_focus,
      why_match_rationale: rationale,
    };
  });

  results.sort((a, b) => b.match_percentage - a.match_percentage || b.industry_demand - a.industry_demand);
  return results;
}

// Calls /matching/roadmap or computes milestones with pedagogical study hours
export async function getRoadmap(
  roleId: string,
  studentRatings: Record<string, number>,
  _degreeDiscipline: string = "Computer Science"
): Promise<RoadmapResult> {
  try {
    return await fetchJson<RoadmapResult>(`${API_BASE}/matching/roadmap`, {
      method: "POST",
      body: JSON.stringify({
        role_id: roleId,
        student_ratings: studentRatings,
        degree_discipline: _degreeDiscipline,
      }),
    });
  } catch {
    const role = ANCHOR_ROLES_DATA.find((r) => r.slug === roleId || r.role_id === roleId) || ANCHOR_ROLES_DATA[0];
    const normRatings: Record<string, number> = {};
    for (const [k, v] of Object.entries(studentRatings)) normRatings[k.toLowerCase().trim()] = Number(v) || 0;

    const milestones: RoadmapMilestone[] = [];
    let totalHours = 0;

    for (const s of role.skills) {
      const studentLvl = normRatings[s.id.toLowerCase()] ?? normRatings[s.name.toLowerCase()] ?? 0;
      const gap = Math.max(0, s.required - studentLvl);
      if (gap > 0) {
        const hours = Math.round(gap * 1.5 * (s.weight / 7.0));
        totalHours += hours;
        milestones.push({
          skill_id: s.id,
          skill_name: s.name,
          category: s.category,
          requirement_category: s.category,
          gap,
          priority_score: Number(((gap / 100) * s.weight).toFixed(2)),
          estimated_study_hours: hours,
          pedagogical_formula: `round(Gap: ${gap} x 1.5 x Weight: ${s.weight.toFixed(2)}) = ${hours}h`,
          action_verb: s.category === "critical" ? "Master Core Foundation:" : "Architect Production Competency:",
          recommended_topics: [
            `Core principles and paradigms of ${s.name}`,
            `Hands-on production implementations with ${s.name}`,
            `Failure mode debugging & optimization in ${s.name}`,
          ],
        });
      }
    }

    milestones.sort((a, b) => b.priority_score - a.priority_score);

    const capstone: CapstoneBrief = {
      title: `${role.title} Production Architecture Portfolio`,
      scenario: `Engineer an end-to-end production solution incorporating the top critical and core competencies required for ${role.title}.`,
      deliverables: "Modular repository, automated test coverage (>80%), containerized deployment, comprehensive architectural README.",
      estimated_weeks: "3 Weeks (Part-time)",
    };

    return {
      role_id: role.role_id,
      role_title: role.title,
      total_estimated_hours: totalHours || 120,
      milestones,
      capstone_project: capstone,
    };
  }
}

// Saves student profile to backend or persists locally
export async function saveStudentProfile(profile: StudentProfileData): Promise<{ message: string; profile_id?: string }> {
  try {
    return await fetchJson<{ message: string; profile_id?: string }>(`${API_BASE}/student/profile`, {
      method: "POST",
      body: JSON.stringify(profile),
    });
  } catch {
    localStorage.setItem("pravah_student_profile", JSON.stringify(profile));
    return { message: "Profile saved locally." };
  }
}

// =============================================================================
// PHASE 6: ACADEMIC GOVERNANCE / COLLEGE PORTAL API
// =============================================================================

export interface InstitutionItem {
  id: string;
  name: string;
  district_id: string;
  state: string;
  type: string;
}

export interface InstitutionOverviewData {
  institution_id: string;
  name: string;
  aishe_code?: string;
  district_id: string;
  state: string;
  type: string;
  enrolled_students_count: number;
  is_blended: boolean;
  blend_label: string;
  privacy_threshold: number;
  placement_eligibility_rate: number;
  average_readiness_score: number;
  curriculum_health_index: number;
  deficient_courses_count: number;
  departments: string[];
}

export interface DepartmentHeatmapSkill {
  skill_name: string;
  category: string;
  benchmark_level: number;
  cohort_average: number;
  curriculum_gap: number;
  alignment_status: "ALIGNED" | "AT RISK" | "DEFICIENT";
  formula_breakdown: string;
  student_count_evaluated: number;
}

export interface DepartmentHeatmapData {
  institution_id: string;
  department: string;
  target_role: string;
  total_skills_audited: number;
  aligned_count: number;
  at_risk_count: number;
  deficient_count: number;
  is_blended: boolean;
  blend_label: string;
  skills: DepartmentHeatmapSkill[];
}

export interface CourseAuditData {
  id: string;
  institution_id: string;
  department: string;
  course_code: string;
  course_name: string;
  mapped_skills: string[];
  status: "ALIGNED" | "AT RISK" | "OBSOLETE";
  recommended_action: string;
  syllabus_modernization_priority: string;
  alignment_score: number;
}

export interface CourseAuditsData {
  institution_id: string;
  department: string;
  total_courses_audited: number;
  aligned_courses_count: number;
  at_risk_courses_count: number;
  obsolete_courses_count: number;
  courses: CourseAuditData[];
}

export interface PlacementTierItem {
  tier_name: string;
  tier_label: string;
  candidate_count: number;
  percentage: number;
  expected_ctc_band: string;
  primary_recruiters: string;
}

export interface PlacementEligibilityData {
  institution_id: string;
  department: string;
  total_evaluated: number;
  overall_eligibility_rate: number;
  average_readiness: number;
  median_readiness: number;
  is_blended: boolean;
  tier_distribution: PlacementTierItem[];
  top_placement_roles: Array<{ role: string; readiness: string; demand: string }>;
}

// Retrieves list of demo higher education institutions
export async function getInstitutions(): Promise<InstitutionItem[]> {
  try {
    return await fetchJson<InstitutionItem[]>(`${API_BASE}/institution/list`);
  } catch {
    return [
      { id: "ggv-bilaspur", name: "Guru Ghasidas Vishwavidyalaya", district_id: "bilaspur", state: "Chhattisgarh", type: "Central University" },
      { id: "nit-raipur", name: "National Institute of Technology Raipur", district_id: "raipur", state: "Chhattisgarh", type: "Institute of National Importance" },
      { id: "iiit-bangalore", name: "IIIT Bangalore", district_id: "bangalore", state: "Karnataka", type: "State University" },
      { id: "coep-pune", name: "COEP Technological University", district_id: "pune", state: "Maharashtra", type: "State University" },
      { id: "iiit-hyderabad", name: "IIIT Hyderabad", district_id: "hyderabad", state: "Telangana", type: "Autonomous University" },
    ];
  }
}

// Retrieves executive overview metrics with under-20 privacy blending
export async function getInstitutionOverview(
  institutionId: string,
  simulatedCohortSize?: number
): Promise<InstitutionOverviewData> {
  const query = simulatedCohortSize !== undefined ? `?simulated_cohort_size=${simulatedCohortSize}` : "";
  try {
    return await fetchJson<InstitutionOverviewData>(`${API_BASE}/institution/${institutionId}/overview${query}`);
  } catch {
    const isBlended = (simulatedCohortSize ?? 48) < 20;
    return {
      institution_id: institutionId,
      name: "Guru Ghasidas Vishwavidyalaya",
      aishe_code: "C-49321",
      district_id: "bilaspur",
      state: "Chhattisgarh",
      type: "Central University",
      enrolled_students_count: simulatedCohortSize ?? 48,
      is_blended: isBlended,
      blend_label: isBlended ? `Blended Regional Cohort (Privacy Floor Protected, N = ${simulatedCohortSize ?? 19})` : `Live Institutional Cohort (N = ${simulatedCohortSize ?? 48})`,
      privacy_threshold: 20,
      placement_eligibility_rate: isBlended ? 61.5 : 68.4,
      average_readiness_score: 64.2,
      curriculum_health_index: 77.5,
      deficient_courses_count: 2,
      departments: ["Computer Science & Engineering", "Information Technology", "Electronics & Communication", "AI & Data Science"],
    };
  }
}

// Retrieves departmental competency heatmap comparing student proficiencies vs. industry benchmarks
export async function getDepartmentHeatmap(
  institutionId: string,
  department: string = "Computer Science & Engineering",
  targetRole: string = "fullstack-developer",
  simulatedCohortSize?: number
): Promise<DepartmentHeatmapData> {
  const params = new URLSearchParams({ department, target_role: targetRole });
  if (simulatedCohortSize !== undefined) params.append("simulated_cohort_size", String(simulatedCohortSize));
  try {
    return await fetchJson<DepartmentHeatmapData>(`${API_BASE}/institution/${institutionId}/heatmap?${params.toString()}`);
  } catch {
    const isBlended = (simulatedCohortSize ?? 48) < 20;
    return {
      institution_id: institutionId,
      department,
      target_role: "Full Stack Developer",
      total_skills_audited: 8,
      aligned_count: 3,
      at_risk_count: 3,
      deficient_count: 2,
      is_blended: isBlended,
      blend_label: isBlended ? "Blended Regional Data (Privacy Floor Protected)" : "Live Institutional Data",
      skills: [
        { skill_name: "Docker", category: "DevOps", benchmark_level: 70, cohort_average: 28, curriculum_gap: 42, alignment_status: "DEFICIENT", formula_breakdown: "Benchmark: 70% - Cohort: 28% = Gap: 42%", student_count_evaluated: simulatedCohortSize ?? 48 },
        { skill_name: "AWS Cloud", category: "Cloud", benchmark_level: 65, cohort_average: 31, curriculum_gap: 34, alignment_status: "DEFICIENT", formula_breakdown: "Benchmark: 65% - Cohort: 31% = Gap: 34%", student_count_evaluated: simulatedCohortSize ?? 48 },
        { skill_name: "React", category: "Frontend", benchmark_level: 65, cohort_average: 44, curriculum_gap: 21, alignment_status: "AT RISK", formula_breakdown: "Benchmark: 65% - Cohort: 44% = Gap: 21%", student_count_evaluated: simulatedCohortSize ?? 48 },
        { skill_name: "Machine Learning", category: "AI", benchmark_level: 55, cohort_average: 36, curriculum_gap: 19, alignment_status: "AT RISK", formula_breakdown: "Benchmark: 55% - Cohort: 36% = Gap: 19%", student_count_evaluated: simulatedCohortSize ?? 48 },
        { skill_name: "Linux Shell & Scripting", category: "DevOps", benchmark_level: 65, cohort_average: 54, curriculum_gap: 11, alignment_status: "AT RISK", formula_breakdown: "Benchmark: 65% - Cohort: 54% = Gap: 11%", student_count_evaluated: simulatedCohortSize ?? 48 },
        { skill_name: "Python", category: "Backend", benchmark_level: 65, cohort_average: 62.5, curriculum_gap: 2.5, alignment_status: "ALIGNED", formula_breakdown: "Benchmark: 65% - Cohort: 62.5% = Gap: 2.5%", student_count_evaluated: simulatedCohortSize ?? 48 },
        { skill_name: "SQL & Databases", category: "Database", benchmark_level: 60, cohort_average: 58, curriculum_gap: 2, alignment_status: "ALIGNED", formula_breakdown: "Benchmark: 60% - Cohort: 58% = Gap: 2%", student_count_evaluated: simulatedCohortSize ?? 48 },
        { skill_name: "Git & Version Control", category: "DevOps", benchmark_level: 60, cohort_average: 62, curriculum_gap: 0, alignment_status: "ALIGNED", formula_breakdown: "Benchmark: 60% - Cohort: 62% = Gap: 0%", student_count_evaluated: simulatedCohortSize ?? 48 },
      ],
    };
  }
}

// Retrieves audited course catalog categorized as ALIGNED, AT RISK, or OBSOLETE
export async function getCourseAudits(
  institutionId: string,
  department: string = "Computer Science & Engineering"
): Promise<CourseAuditsData> {
  try {
    return await fetchJson<CourseAuditsData>(`${API_BASE}/institution/${institutionId}/course-audits?department=${encodeURIComponent(department)}`);
  } catch {
    return {
      institution_id: institutionId,
      department,
      total_courses_audited: 6,
      aligned_courses_count: 3,
      at_risk_courses_count: 2,
      obsolete_courses_count: 1,
      courses: [
        {
          id: "cs104",
          institution_id: institutionId,
          department,
          course_code: "CS405",
          course_name: "Microprocessor Architecture & 8085 Assembly",
          mapped_skills: ["Assembly", "Microprocessors"],
          status: "OBSOLETE",
          recommended_action: "Replace legacy 8085 assembly with ARM Cortex, RISC-V, or Embedded C.",
          syllabus_modernization_priority: "High",
          alignment_score: 32.0,
        },
        {
          id: "cs105",
          institution_id: institutionId,
          department,
          course_code: "CS502",
          course_name: "Server Administration & Linux Shell",
          mapped_skills: ["Linux Shell & Scripting", "Git & Version Control"],
          status: "AT RISK",
          recommended_action: "Expand basic bash scripting to containerization with Docker and CI/CD fundamentals.",
          syllabus_modernization_priority: "Medium",
          alignment_score: 62.0,
        },
        {
          id: "cs106",
          institution_id: institutionId,
          department,
          course_code: "CS504",
          course_name: "Introduction to Artificial Intelligence",
          mapped_skills: ["Machine Learning", "Python"],
          status: "AT RISK",
          recommended_action: "Modernize syllabus with PyTorch, neural networks, and prompt engineering foundations.",
          syllabus_modernization_priority: "Medium",
          alignment_score: 65.0,
        },
        {
          id: "cs101",
          institution_id: institutionId,
          department,
          course_code: "CS301",
          course_name: "Object-Oriented Programming (Java/Python)",
          mapped_skills: ["Python", "Java"],
          status: "ALIGNED",
          recommended_action: "Modernize with design patterns and asynchronous programming.",
          syllabus_modernization_priority: "Low",
          alignment_score: 88.0,
        },
        {
          id: "cs102",
          institution_id: institutionId,
          department,
          course_code: "CS302",
          course_name: "Database Management Systems",
          mapped_skills: ["SQL & Databases", "PostgreSQL"],
          status: "ALIGNED",
          recommended_action: "Incorporate NoSQL databases and query indexing strategies.",
          syllabus_modernization_priority: "Low",
          alignment_score: 90.0,
        },
        {
          id: "cs103",
          institution_id: institutionId,
          department,
          course_code: "CS401",
          course_name: "Web Technologies & Application Design",
          mapped_skills: ["HTML", "CSS", "JavaScript", "React"],
          status: "ALIGNED",
          recommended_action: "Upgrade from jQuery to React/TypeScript and REST APIs.",
          syllabus_modernization_priority: "Low",
          alignment_score: 92.0,
        },
      ],
    };
  }
}

// Updates mapped skills for a course, dynamically flipping alignment status
export async function updateCourseSkills(
  institutionId: string,
  courseId: string,
  mappedSkills: string[]
): Promise<CourseAuditData> {
  return await fetchJson<CourseAuditData>(`${API_BASE}/institution/${institutionId}/course-audits/${courseId}/update-skills`, {
    method: "POST",
    body: JSON.stringify({ mapped_skills: mappedSkills }),
  });
}

// Retrieves placement eligibility breakdown across 4 tiers
export async function getPlacementEligibility(
  institutionId: string,
  department: string = "Computer Science & Engineering",
  simulatedCohortSize?: number
): Promise<PlacementEligibilityData> {
  const query = simulatedCohortSize !== undefined ? `?simulated_cohort_size=${simulatedCohortSize}` : "";
  try {
    return await fetchJson<PlacementEligibilityData>(`${API_BASE}/institution/${institutionId}/placement-eligibility${query}`);
  } catch {
    const isBlended = (simulatedCohortSize ?? 48) < 20;
    const n = simulatedCohortSize ?? 48;
    return {
      institution_id: institutionId,
      department,
      total_evaluated: n,
      overall_eligibility_rate: 68.4,
      average_readiness: 68.5,
      median_readiness: 70.0,
      is_blended: isBlended,
      tier_distribution: [
        { tier_name: "Tier 1", tier_label: "National Elite & Global R&D", candidate_count: Math.round(n * 0.12), percentage: 12.5, expected_ctc_band: "₹18 - ₹35 LPA", primary_recruiters: "Google, Microsoft, Amazon, Adobe" },
        { tier_name: "Tier 2", tier_label: "Specialist Tech & Unicorns", candidate_count: Math.round(n * 0.38), percentage: 37.5, expected_ctc_band: "₹10 - ₹18 LPA", primary_recruiters: "Swiggy, Zomato, Razorpay, CRED" },
        { tier_name: "Tier 3", tier_label: "Enterprise IT & Consulting", candidate_count: Math.round(n * 0.35), percentage: 35.0, expected_ctc_band: "₹5 - ₹10 LPA", primary_recruiters: "TCS Digital, Infosys Power, Accenture" },
        { tier_name: "Tier 4", tier_label: "Remedial / Active Upskilling", candidate_count: Math.round(n * 0.15), percentage: 15.0, expected_ctc_band: "₹3.5 - ₹5 LPA", primary_recruiters: "Requires Roadmap Remediation" },
      ],
      top_placement_roles: [
        { role: "Full Stack Developer", readiness: "74.2%", demand: "High" },
        { role: "Cloud DevOps Engineer", readiness: "66.8%", demand: "Surging" },
        { role: "AI / ML Applications Engineer", readiness: "62.4%", demand: "Very High" },
        { role: "Backend Systems Engineer", readiness: "71.0%", demand: "High" },
      ],
    };
  }
}

// =============================================================================
// PHASE 7 TYPES & API METHODS: DISTRICT PLANNING & EMPLOYER HIRING
// =============================================================================

export interface DistrictItem {
  id: string;
  name: string;
  state: string;
  tier: number;
  economic_focus: string;
}

export interface SectorDeficitItem {
  sector_id: string;
  sector_name: string;
  demand_volume: number;
  supply_volume: number;
  net_balance: number;
  urgency_status: "HIGH DEFICIT" | "MODERATE DEFICIT" | "BALANCED";
  yoy_growth: string;
  critical_bottleneck_skills: string[];
  top_employers: string[];
}

export interface DistrictDeficitMatrixData {
  district_id: string;
  district_name: string;
  state: string;
  tier: number;
  economic_focus: string;
  total_demand: number;
  total_supply: number;
  net_regional_deficit: number;
  critical_sectors_count: number;
  sectors: SectorDeficitItem[];
}

export interface SubsidyRecommendationItem {
  id: string;
  sector_name: string;
  target_program: string;
  partner_institutions: string[];
  recommended_subsidy_amount: string;
  projected_trainees: number;
  priority_score: number;
  projected_roi: string;
}

export interface DistrictSubsidyData {
  district_id: string;
  total_budget_recommended: string;
  recommendations: SubsidyRecommendationItem[];
}

export interface ExtractedSkillItem {
  skill_name: string;
  category: string;
  tier: "critical" | "core" | "supporting" | "peripheral";
  required_level: number;
  weight: number;
}

export interface JDExtractData {
  job_title: string;
  detected_domain: string;
  experience_band: string;
  total_skills_extracted: number;
  extracted_skills: ExtractedSkillItem[];
  model_used: string;
  summary: string;
}

export interface TalentCandidateItem {
  candidate_id: string;
  degree_field: string;
  institution_name: string;
  graduation_year: number;
  target_role: string;
  match_score: number;
  national_percentile: number;
  tier_classification: string;
  top_verified_skills: Record<string, number>;
  mobility: string;
  is_verified: boolean;
}

export interface TalentSearchData {
  total_matching_candidates: number;
  role_filter?: string;
  min_score_filter: number;
  candidates: TalentCandidateItem[];
}

// Retrieves list of administrative districts
export async function getDistricts(): Promise<DistrictItem[]> {
  try {
    return await fetchJson<DistrictItem[]>(`${API_BASE}/district/list`);
  } catch {
    return [
      { id: "bilaspur", name: "Bilaspur", state: "Chhattisgarh", tier: 3, economic_focus: "Industrial & Education Hub" },
      { id: "raipur", name: "Raipur", state: "Chhattisgarh", tier: 2, economic_focus: "Capital & Technology Center" },
      { id: "bangalore", name: "Bangalore Urban", state: "Karnataka", tier: 1, economic_focus: "Tier 1 Global Tech Capital" },
      { id: "pune", name: "Pune", state: "Maharashtra", tier: 1, economic_focus: "Automotive & Enterprise Software" },
      { id: "hyderabad", name: "Hyderabad", state: "Telangana", tier: 1, economic_focus: "AI, Cloud & Biotechnology Hub" },
    ];
  }
}

// Retrieves 5-sector supply vs demand deficit matrix for a district
export async function getDistrictDeficitMatrix(districtId: string): Promise<DistrictDeficitMatrixData> {
  try {
    return await fetchJson<DistrictDeficitMatrixData>(`${API_BASE}/district/${districtId}/deficit-matrix`);
  } catch {
    return {
      district_id: districtId,
      district_name: districtId.charAt(0).toUpperCase() + districtId.slice(1),
      state: "Demo State",
      tier: 2,
      economic_focus: "Industrial & Regional Tech Hub",
      total_demand: 2540,
      total_supply: 1770,
      net_regional_deficit: 770,
      critical_sectors_count: 2,
      sectors: [
        { sector_id: "it-software", sector_name: "Information Technology, Cloud & AI", demand_volume: 680, supply_volume: 410, net_balance: 270, urgency_status: "HIGH DEFICIT", yoy_growth: "+22%", critical_bottleneck_skills: ["Docker", "AWS Cloud", "React", "Python"], top_employers: ["TCS", "Wipro", "SECL IT"] },
        { sector_id: "manufacturing", sector_name: "Advanced Manufacturing & Heavy Industries", demand_volume: 820, supply_volume: 580, net_balance: 240, urgency_status: "HIGH DEFICIT", yoy_growth: "+16%", critical_bottleneck_skills: ["PLC Automation", "AutoCAD", "CNC Operations"], top_employers: ["Jindal Steel", "SECL Bilaspur"] },
        { sector_id: "green-energy", sector_name: "Solar, Green Energy & EV Mobility", demand_volume: 290, supply_volume: 140, net_balance: 150, urgency_status: "MODERATE DEFICIT", yoy_growth: "+45%", critical_bottleneck_skills: ["Solar PV Grid", "Battery Management"], top_employers: ["CREDA", "Tata Power Solar"] },
        { sector_id: "healthcare", sector_name: "Healthcare Diagnostics & Biomedical Informatics", demand_volume: 340, supply_volume: 260, net_balance: 80, urgency_status: "MODERATE DEFICIT", yoy_growth: "+28%", critical_bottleneck_skills: ["Clinical Data Analysis", "Medical Imaging"], top_employers: ["Apollo", "CIMS"] },
        { sector_id: "bfsi", sector_name: "BFSI, FinTech & Digital Accounting", demand_volume: 410, supply_volume: 380, net_balance: 30, urgency_status: "BALANCED", yoy_growth: "+12%", critical_bottleneck_skills: ["SQL Reporting", "Financial Modeling"], top_employers: ["SBI", "HDFC Bank"] },
      ],
    };
  }
}

// Retrieves state training subsidy recommendations for a district
export async function getDistrictSubsidyRecommendations(districtId: string): Promise<DistrictSubsidyData> {
  try {
    return await fetchJson<DistrictSubsidyData>(`${API_BASE}/district/${districtId}/subsidy-recommendations`);
  } catch {
    return {
      district_id: districtId,
      total_budget_recommended: "₹1.45 Crores",
      recommendations: [
        { id: "sub-01", sector_name: "Information Technology, Cloud & AI", target_program: "Cloud DevOps & Microservices Vocational Bridge", partner_institutions: ["Government ITI", "Central University"], recommended_subsidy_amount: "₹45 Lakhs", projected_trainees: 180, priority_score: 94.5, projected_roi: "85% Deficit Closed in 6 Months" },
        { id: "sub-02", sector_name: "Solar, Green Energy & EV Mobility", target_program: "Solar PV Grid Integration & Battery Diagnostics Lab", partner_institutions: ["Government Polytechnic"], recommended_subsidy_amount: "₹35 Lakhs", projected_trainees: 120, priority_score: 89.2, projected_roi: "80% Deficit Closed in 6 Months" },
        { id: "sub-03", sector_name: "Advanced Manufacturing & Heavy Industries", target_program: "Industrial PLC & CNC Precision Machining Apprenticeship", partner_institutions: ["Technical Training Institute"], recommended_subsidy_amount: "₹40 Lakhs", projected_trainees: 160, priority_score: 84.0, projected_roi: "75% Deficit Closed in 9 Months" },
      ],
    };
  }
}

// Parses raw job description into structured 4-tier benchmark profile via Gemini AI or deterministic engine
export async function extractJobDescription(rawText: string): Promise<JDExtractData> {
  return await fetchJson<JDExtractData>(`${API_BASE}/employer/extract-jd`, {
    method: "POST",
    body: JSON.stringify({ raw_text: rawText }),
  });
}

// Searches vetted blind candidate cohort profiles
export async function searchTalentCohort(params: {
  role?: string;
  min_score?: number;
  batch?: number;
  region?: string;
}): Promise<TalentSearchData> {
  const query = new URLSearchParams();
  if (params.role) query.append("role", params.role);
  if (params.min_score !== undefined) query.append("min_score", String(params.min_score));
  if (params.batch) query.append("batch", String(params.batch));
  if (params.region) query.append("region", params.region);

  try {
    return await fetchJson<TalentSearchData>(`${API_BASE}/employer/talent-search?${query.toString()}`);
  } catch {
    return {
      total_matching_candidates: 4,
      role_filter: params.role,
      min_score_filter: params.min_score ?? 60,
      candidates: [
        {
          candidate_id: "CAND-8942",
          degree_field: "Computer Science & Engineering",
          institution_name: "National Institute of Technology, Raipur",
          graduation_year: 2026,
          target_role: "Full Stack Developer",
          match_score: 88.5,
          national_percentile: 96.4,
          tier_classification: "Tier 1: National Elite",
          top_verified_skills: { Python: 85, React: 88, "SQL & Databases": 80, Docker: 75 },
          mobility: "Pan-India / Remote",
          is_verified: true,
        },
        {
          candidate_id: "CAND-9104",
          degree_field: "Computer Science & Engineering",
          institution_name: "IIIT Bangalore",
          graduation_year: 2025,
          target_role: "Cloud DevOps Engineer",
          match_score: 94.2,
          national_percentile: 99.1,
          tier_classification: "Tier 1: National Elite",
          top_verified_skills: { Docker: 92, Kubernetes: 88, "AWS Cloud": 90, "Linux Shell": 95 },
          mobility: "Bangalore / Hybrid",
          is_verified: true,
        },
      ],
    };
  }
}


