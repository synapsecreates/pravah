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
