// FILE: src/pages/onboarding/constants.ts
// PURPOSE: Taxonomy constants, degree options, 6 domain skill groups, archetype decks, and skill synergies for candidate onboarding.
// PHASE: 8 | DEPENDS ON: lucide-react, types/student.ts | LAST TOUCHED: Phase 8

import { Globe, Database, Cloud, Cpu, BarChart3, Shield } from "lucide-react";
import type { RoleMatchSummary } from "../../types/student";

export const DEGREE_OPTIONS = [
  "Computer Science", "Information Technology", "Data Science", "Artificial Intelligence",
  "Electronics and Communication", "Electrical Engineering", "Mechanical Engineering",
  "Civil Engineering", "Other STEM", "Non-STEM",
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
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Responsive Design", "UI/UX", "Figma", "Web Vitals"],
  },
  {
    domain: "Backend & Systems",
    shortLabel: "Backend",
    icon: Database,
    color: "#34d399",
    skills: ["Python", "Java", "Node.js", "Go", "C++", "SQL", "PostgreSQL", "MongoDB", "Redis", "REST APIs", "Microservices", "System Design"],
  },
  {
    domain: "Cloud & DevOps",
    shortLabel: "Cloud/DevOps",
    icon: Cloud,
    color: "#fbbf24",
    skills: ["Docker", "Kubernetes", "Linux", "CI/CD", "AWS", "Azure", "GCP", "Terraform", "Bash", "Git", "Networking", "Prometheus"],
  },
  {
    domain: "AI & Cognitive Intelligence",
    shortLabel: "AI & ML",
    icon: Cpu,
    color: "#a78bfa",
    skills: ["Machine Learning", "Deep Learning", "Statistics", "Linear Algebra", "Probability", "PyTorch", "TensorFlow", "NLP", "Computer Vision", "LLMs", "LangChain"],
  },
  {
    domain: "Data & Quantitative Analytics",
    shortLabel: "Data & BI",
    icon: BarChart3,
    color: "#f472b6",
    skills: ["SQL", "Pandas", "NumPy", "Data Analysis", "Data Visualization", "Power BI", "Tableau", "Apache Spark", "Kafka", "ETL", "Data Warehousing"],
  },
  {
    domain: "Cyber Resilience & Security",
    shortLabel: "Security",
    icon: Shield,
    color: "#f87171",
    skills: ["Security", "Network Security", "Penetration Testing", "Cryptography", "Linux", "Wireshark", "C", "C++", "SIEM", "Web Security"],
  },
];

// Standardized Career Preset Decks
export const ARCHETYPE_DECKS = [
  {
    id: "fullstack",
    name: "Full-Stack Development",
    tagline: "Modern web applications, APIs, and databases",
    color: "var(--brand-600)",
    skills: [
      { name: "React", level: 80 }, { name: "TypeScript", level: 75 }, { name: "Node.js", level: 75 },
      { name: "PostgreSQL", level: 70 }, { name: "REST APIs", level: 75 }, { name: "Git", level: 70 },
    ],
  },
  {
    id: "aiml",
    name: "AI & Machine Learning",
    tagline: "Neural networks, modeling, and scientific Python",
    color: "var(--violet-accent)",
    skills: [
      { name: "Python", level: 85 }, { name: "Machine Learning", level: 75 }, { name: "PyTorch", level: 70 },
      { name: "Statistics", level: 75 }, { name: "Linear Algebra", level: 70 }, { name: "Pandas", level: 80 },
    ],
  },
  {
    id: "devops",
    name: "Cloud & DevOps",
    tagline: "Containerization, infrastructure, and CI/CD",
    color: "#38bdf8",
    skills: [
      { name: "Docker", level: 80 }, { name: "Kubernetes", level: 70 }, { name: "Linux", level: 85 },
      { name: "AWS", level: 65 }, { name: "CI/CD", level: 75 }, { name: "Git", level: 80 },
    ],
  },
  {
    id: "data",
    name: "Data Intelligence",
    tagline: "Relational pipelines, SQL transforms, and business metrics",
    color: "#34d399",
    skills: [
      { name: "SQL", level: 85 }, { name: "Python", level: 75 }, { name: "Pandas", level: 80 },
      { name: "Power BI", level: 75 }, { name: "ETL", level: 70 }, { name: "Statistics", level: 70 },
    ],
  },
  {
    id: "security",
    name: "Cyber Defense",
    tagline: "Network security, cryptography, and systems hardening",
    color: "#f87171",
    skills: [
      { name: "Linux", level: 85 }, { name: "Network Security", level: 75 }, { name: "Cryptography", level: 70 },
      { name: "Penetration Testing", level: 65 }, { name: "Wireshark", level: 65 }, { name: "Python", level: 70 },
    ],
  },
];

// Smart Skill Synergies map
export const SKILL_SYNERGIES: Record<string, { name: string; gain: string }[]> = {
  React: [
    { name: "TypeScript", gain: "Complementary" },
    { name: "Next.js", gain: "Complementary" },
    { name: "Tailwind CSS", gain: "Complementary" },
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

export const DEFAULT_FALLBACK_ROLE: RoleMatchSummary = {
  role_id: "ai-ml-engineer",
  slug: "ai-ml-engineer",
  title: "AI & Machine Learning Engineer",
  domain: "AI & Cognitive Intelligence",
  match_percentage: 78.5,
  industry_demand: 9.5,
  primary_focus: "Neural Networks & Predictive Analytics",
  why_match_rationale: "Strong mathematical core and programming proficiency across models.",
};
