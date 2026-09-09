// FILE: src/pages/college/constants.ts
// PURPOSE: Modern skill suggestions, tab configurations, and constants for College Portal.
// PHASE: 8 | DEPENDS ON: lucide-react | LAST TOUCHED: Phase 8

import { BarChart3, Layers, BookOpen, GraduationCap } from "lucide-react";
import type { PortalTab } from "./types";

export const MODERN_SKILL_SUGGESTIONS: Record<string, string[]> = {
  CS405: ["ARM Cortex", "RISC-V Architecture", "Embedded C", "RTOS Fundamentals"],
  CS502: ["Docker", "Kubernetes", "CI/CD Pipelines", "AWS Cloud Infrastructure"],
  CS504: ["PyTorch", "Deep Learning", "Transformers & LLMs", "MLOps"],
  CS301: ["Design Patterns", "Asynchronous Programming", "Microservices Architecture"],
  CS302: ["MongoDB / NoSQL", "Query Indexing & Optimization", "Redis Caching"],
  CS401: ["Next.js & TypeScript", "GraphQL APIs", "Tailwind CSS"],
};

export const PORTAL_TABS = [
  { id: "overview" as PortalTab, label: "Executive KPIs", icon: BarChart3 },
  { id: "heatmap" as PortalTab, label: "Departmental Competency Heatmap", icon: Layers },
  { id: "syllabus" as PortalTab, label: "Syllabus Modernization Audit", icon: BookOpen },
  { id: "placement" as PortalTab, label: "Placement & Tier Breakdown", icon: GraduationCap },
];
