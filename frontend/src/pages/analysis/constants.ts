// FILE: src/pages/analysis/constants.ts
// PURPOSE: Constants, job presets, types, and mathematical distribution helpers for Student Analysis.
// PHASE: 8 | DEPENDS ON: None | LAST TOUCHED: Phase 8

export interface JobPreset {
  id: string;
  title: string;
  company: string;
  type: string;
  skills: { name: string; required: boolean; weight: number }[];
  description: string;
}

export const JOB_PRESETS: JobPreset[] = [
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

export function gaussianCDF(z: number): number {
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014337 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1.0 - p;
  return p;
}

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
