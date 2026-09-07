# FILE: backend/app/api/v1/endpoints/employer.py
# PURPOSE: Talent acquisition and recruiter endpoints for Gemini unstructured JD parsing and vetted blind candidate cohort search.
# PHASE: 7 | DEPENDS ON: schemas.py, dataset.py, config.py | LAST TOUCHED: Phase 7

import json
import os
import re
from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings
from app.models.schemas import (
    ExtractedSkillItem,
    JDExtractRequest,
    JDExtractResponse,
    TalentCandidateItem,
    TalentSearchResponse,
)

router = APIRouter()

# Calibrated candidate repository for demo talent search (Anonymized per DPDP privacy rules)
VETTED_CANDIDATE_REPOSITORY: List[dict] = [
    {
        "candidate_id": "CAND-8942",
        "degree_field": "Computer Science & Engineering",
        "institution_name": "National Institute of Technology, Raipur",
        "graduation_year": 2026,
        "target_role": "Full Stack Developer",
        "match_score": 88.5,
        "national_percentile": 96.4,
        "tier_classification": "Tier 1: National Elite",
        "top_verified_skills": {"Python": 85, "React": 88, "SQL & Databases": 80, "Docker": 75, "Git": 90},
        "mobility": "Pan-India / Remote",
        "is_verified": True,
    },
    {
        "candidate_id": "CAND-7215",
        "degree_field": "Information Technology",
        "institution_name": "Guru Ghasidas Vishwavidyalaya, Bilaspur",
        "graduation_year": 2026,
        "target_role": "Full Stack Developer",
        "match_score": 78.4,
        "national_percentile": 84.2,
        "tier_classification": "Tier 2: Specialist Tech",
        "top_verified_skills": {"JavaScript": 82, "React": 76, "Python": 72, "SQL & Databases": 75, "HTML/CSS": 85},
        "mobility": "Pan-India",
        "is_verified": True,
    },
    {
        "candidate_id": "CAND-9104",
        "degree_field": "Computer Science & Engineering",
        "institution_name": "IIIT Bangalore",
        "graduation_year": 2025,
        "target_role": "Cloud DevOps Engineer",
        "match_score": 94.2,
        "national_percentile": 99.1,
        "tier_classification": "Tier 1: National Elite",
        "top_verified_skills": {"Docker": 92, "Kubernetes": 88, "AWS Cloud": 90, "Linux Shell & Scripting": 95, "CI/CD": 86},
        "mobility": "Bangalore / Hybrid",
        "is_verified": True,
    },
    {
        "candidate_id": "CAND-6381",
        "degree_field": "Electronics & Communication",
        "institution_name": "COEP Technological University, Pune",
        "graduation_year": 2026,
        "target_role": "Cloud DevOps Engineer",
        "match_score": 82.0,
        "national_percentile": 88.5,
        "tier_classification": "Tier 2: Specialist Tech",
        "top_verified_skills": {"Linux Shell & Scripting": 85, "Docker": 78, "AWS Cloud": 75, "Python": 80, "Git": 84},
        "mobility": "Western Region / Pan-India",
        "is_verified": True,
    },
    {
        "candidate_id": "CAND-5529",
        "degree_field": "AI & Data Science",
        "institution_name": "IIIT Hyderabad",
        "graduation_year": 2025,
        "target_role": "AI / ML Applications Engineer",
        "match_score": 96.0,
        "national_percentile": 99.6,
        "tier_classification": "Tier 1: National Elite",
        "top_verified_skills": {"PyTorch": 94, "Machine Learning": 95, "Python": 96, "Deep Learning": 90, "Transformers & LLMs": 88},
        "mobility": "Pan-India / Global",
        "is_verified": True,
    },
    {
        "candidate_id": "CAND-4410",
        "degree_field": "Computer Science & Engineering",
        "institution_name": "Guru Ghasidas Vishwavidyalaya, Bilaspur",
        "graduation_year": 2026,
        "target_role": "AI / ML Applications Engineer",
        "match_score": 72.8,
        "national_percentile": 76.5,
        "tier_classification": "Tier 2: Specialist Tech",
        "top_verified_skills": {"Python": 80, "Machine Learning": 70, "Statistics": 75, "SQL & Databases": 72},
        "mobility": "Central Region / Pan-India",
        "is_verified": True,
    },
    {
        "candidate_id": "CAND-3891",
        "degree_field": "Computer Science & Engineering",
        "institution_name": "National Institute of Technology, Raipur",
        "graduation_year": 2026,
        "target_role": "Backend Systems Engineer",
        "match_score": 89.2,
        "national_percentile": 96.8,
        "tier_classification": "Tier 1: National Elite",
        "top_verified_skills": {"FastAPI": 88, "Python": 90, "PostgreSQL": 86, "Redis Caching": 82, "Docker": 80},
        "mobility": "Pan-India",
        "is_verified": True,
    },
    {
        "candidate_id": "CAND-2104",
        "degree_field": "Computer Science & Engineering",
        "institution_name": "Guru Ghasidas Vishwavidyalaya, Bilaspur",
        "graduation_year": 2026,
        "target_role": "Backend Systems Engineer",
        "match_score": 68.5,
        "national_percentile": 71.0,
        "tier_classification": "Tier 3: Enterprise IT",
        "top_verified_skills": {"Python": 72, "SQL & Databases": 70, "Git": 75, "REST APIs": 68},
        "mobility": "Pan-India",
        "is_verified": True,
    },
    {
        "candidate_id": "CAND-1823",
        "degree_field": "Data Science & Statistics",
        "institution_name": "IIIT Bangalore",
        "graduation_year": 2025,
        "target_role": "Data Scientist",
        "match_score": 93.0,
        "national_percentile": 98.4,
        "tier_classification": "Tier 1: National Elite",
        "top_verified_skills": {"Python": 92, "Statistics": 94, "Machine Learning": 90, "Pandas": 92, "SQL": 88},
        "mobility": "Pan-India / Remote",
        "is_verified": True,
    },
    {
        "candidate_id": "CAND-1092",
        "degree_field": "Information Technology",
        "institution_name": "COEP Technological University, Pune",
        "graduation_year": 2026,
        "target_role": "Data Scientist",
        "match_score": 79.5,
        "national_percentile": 85.0,
        "tier_classification": "Tier 2: Specialist Tech",
        "top_verified_skills": {"Python": 82, "Machine Learning": 76, "SQL": 80, "Statistics": 78},
        "mobility": "Western Region / Hybrid",
        "is_verified": True,
    },
]


# Deterministic NLP parser for extracting technical competencies from raw job descriptions.
def _extract_jd_deterministically(raw_text: str) -> JDExtractResponse:
    text = raw_text.lower()

    # Detect Role Title
    if "devops" in text or "cloud engineer" in text or "sre" in text or "site reliability" in text:
        title = "Cloud DevOps & Platform Engineer"
        domain = "DevOps & Cloud Infrastructure"
    elif "data scientist" in text or "data science" in text or "machine learning engineer" in text or "ai engineer" in text:
        title = "AI / ML Applications Engineer"
        domain = "Artificial Intelligence & Data Science"
    elif "frontend" in text or "ui developer" in text or "react developer" in text:
        title = "Frontend Applications Engineer"
        domain = "Frontend & User Experience"
    elif "backend" in text or "api developer" in text or "systems engineer" in text:
        title = "Backend Systems Engineer"
        domain = "Backend & Distributed Systems"
    else:
        title = "Full Stack Software Engineer"
        domain = "Software Development"

    # Experience band detection
    if "5+" in text or "senior" in text or "lead" in text or "architect" in text:
        exp_band = "Senior Level (3 - 6 Years Experience)"
    elif "junior" in text or "fresher" in text or "entry" in text or "graduate" in text or "intern" in text:
        exp_band = "Early Career / Campus Hire (0 - 1 Years Experience)"
    else:
        exp_band = "Mid-Level Professional (1 - 3 Years Experience)"

    # Known skill keyword dictionary with categories and default tiers
    SKILL_RULES = [
        {"name": "Docker", "cat": "DevOps", "tier": "critical", "level": 85, "weight": 1.0, "keywords": ["docker", "container", "containers"]},
        {"name": "Kubernetes", "cat": "DevOps", "tier": "critical", "level": 80, "weight": 1.0, "keywords": ["kubernetes", "k8s", "container orchestration"]},
        {"name": "AWS Cloud", "cat": "Cloud", "tier": "critical", "level": 85, "weight": 1.0, "keywords": ["aws", "amazon web services", "cloud infrastructure", "ec2", "s3"]},
        {"name": "Python", "cat": "Backend", "tier": "critical", "level": 85, "weight": 1.0, "keywords": ["python", "django", "fastapi", "flask"]},
        {"name": "React", "cat": "Frontend", "tier": "critical", "level": 85, "weight": 1.0, "keywords": ["react", "react.js", "reactjs", "next.js"]},
        {"name": "JavaScript", "cat": "Frontend", "tier": "core", "level": 80, "weight": 0.75, "keywords": ["javascript", "typescript", "es6", "node.js"]},
        {"name": "SQL & Databases", "cat": "Database", "tier": "core", "level": 80, "weight": 0.75, "keywords": ["sql", "database", "postgresql", "mysql", "databases"]},
        {"name": "CI/CD Pipelines", "cat": "DevOps", "tier": "core", "level": 75, "weight": 0.75, "keywords": ["ci/cd", "github actions", "gitlab ci", "jenkins", "pipeline"]},
        {"name": "Machine Learning", "cat": "AI", "tier": "critical", "level": 85, "weight": 1.0, "keywords": ["machine learning", "ml", "neural networks", "model"]},
        {"name": "PyTorch", "cat": "AI", "tier": "critical", "level": 80, "weight": 1.0, "keywords": ["pytorch", "tensorflow", "keras", "deep learning"]},
        {"name": "Linux Shell & Scripting", "cat": "DevOps", "tier": "core", "level": 75, "weight": 0.75, "keywords": ["linux", "bash", "shell scripting", "unix"]},
        {"name": "Git & Version Control", "cat": "DevOps", "tier": "supporting", "level": 70, "weight": 0.45, "keywords": ["git", "github", "version control"]},
        {"name": "REST APIs", "cat": "Backend", "tier": "core", "level": 80, "weight": 0.75, "keywords": ["rest", "api", "apis", "graphql", "microservices"]},
        {"name": "Terraform", "cat": "Cloud", "tier": "core", "level": 75, "weight": 0.75, "keywords": ["terraform", "iac", "infrastructure as code"]},
        {"name": "Statistics", "cat": "AI", "tier": "supporting", "level": 75, "weight": 0.45, "keywords": ["statistics", "probability", "statistical"]},
        {"name": "Monitoring & Logging", "cat": "DevOps", "tier": "peripheral", "level": 60, "weight": 0.2, "keywords": ["prometheus", "grafana", "datadog", "cloudwatch", "logging"]},
    ]

    extracted: List[ExtractedSkillItem] = []
    seen = set()

    for rule in SKILL_RULES:
        if any(re.search(rf"\b{re.escape(kw)}\b", text) for kw in rule["keywords"]):
            if rule["name"] not in seen:
                seen.add(rule["name"])
                extracted.append(
                    ExtractedSkillItem(
                        skill_name=rule["name"],
                        category=rule["cat"],
                        tier=rule["tier"],
                        required_level=rule["level"],
                        weight=rule["weight"],
                    )
                )

    # If few skills matched, provide default core set for the detected title
    if len(extracted) < 3:
        default_skills = [
            ExtractedSkillItem(skill_name="Python", category="Backend", tier="critical", required_level=80, weight=1.0),
            ExtractedSkillItem(skill_name="SQL & Databases", category="Database", tier="critical", required_level=75, weight=1.0),
            ExtractedSkillItem(skill_name="Git & Version Control", category="DevOps", tier="supporting", required_level=70, weight=0.45),
            ExtractedSkillItem(skill_name="REST APIs", category="Backend", tier="core", required_level=75, weight=0.75),
        ]
        for ds in default_skills:
            if ds.skill_name not in seen:
                extracted.append(ds)

    # Sort: critical first, then core, supporting, peripheral
    tier_order = {"critical": 0, "core": 1, "supporting": 2, "peripheral": 3}
    extracted.sort(key=lambda s: (tier_order.get(s.tier, 4), -s.required_level))

    return JDExtractResponse(
        job_title=title,
        detected_domain=domain,
        experience_band=exp_band,
        total_skills_extracted=len(extracted),
        extracted_skills=extracted,
        model_used="Pravah Deterministic NOS NLP Engine",
        summary=f"Parsed job description for {title}. Extracted {len(extracted)} structured competencies categorized into 4 tiers with calibrated industry weights.",
    )


# -----------------------------------------------------------------------------
# ENDPOINT 1: EXTRACT UNSTRUCTURED JOB DESCRIPTION
# -----------------------------------------------------------------------------
@router.post("/extract-jd", response_model=JDExtractResponse)
def extract_job_description(request: JDExtractRequest) -> JDExtractResponse:
    """Parses raw text job descriptions into structured 4-tier skill benchmarks using Gemini API or rule-based fallback."""
    raw_text = request.raw_text.strip()
    if len(raw_text) < 10:
        raise HTTPException(status_code=400, detail="Job description text is too short to parse.")

    api_key = os.environ.get("GEMINI_API_KEY", "")

    # If GEMINI_API_KEY is configured, try calling Gemini Flash API
    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"""
            Analyze this Job Description and extract structured technical competencies into JSON:
            Job Description: {raw_text}

            Respond strictly in valid JSON with this exact schema:
            {{
              "job_title": "string",
              "detected_domain": "string",
              "experience_band": "string",
              "extracted_skills": [
                {{
                  "skill_name": "string",
                  "category": "string",
                  "tier": "critical" | "core" | "supporting" | "peripheral",
                  "required_level": 0-100,
                  "weight": 0.2 - 1.0
                }}
              ],
              "summary": "string"
            }}
            """
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
            )
            # Parse JSON from response text
            res_text = response.text.strip()
            # Remove markdown code fences if present
            res_text = re.sub(r"^```json\s*", "", res_text)
            res_text = re.sub(r"\s*```$", "", res_text)
            data = json.loads(res_text)

            skills = [ExtractedSkillItem(**s) for s in data.get("extracted_skills", [])]
            return JDExtractResponse(
                job_title=data.get("job_title", "Technical Role"),
                detected_domain=data.get("detected_domain", "Engineering"),
                experience_band=data.get("experience_band", "Mid-Level"),
                total_skills_extracted=len(skills),
                extracted_skills=skills,
                model_used="Gemini 2.0 Flash AI",
                summary=data.get("summary", "Successfully parsed job description using Gemini AI."),
            )
        except Exception:
            # Fall back smoothly to deterministic engine on any API error/timeout
            pass

    return _extract_jd_deterministically(raw_text)


# -----------------------------------------------------------------------------
# ENDPOINT 2: VETTED TALENT COHORT SEARCH
# -----------------------------------------------------------------------------
@router.get("/talent-search", response_model=TalentSearchResponse)
def search_talent_cohort(
    role: Optional[str] = Query(None, description="Target role filter, e.g. 'Cloud DevOps Engineer'"),
    min_score: float = Query(60.0, ge=0.0, le=100.0, description="Minimum Pravah technical readiness score"),
    batch: Optional[int] = Query(None, description="Graduation year filter, e.g. 2026"),
    region: Optional[str] = Query(None, description="Regional or mobility filter"),
) -> TalentSearchResponse:
    """Searches vetted blind candidate profiles satisfying recruiter filters with privacy preservation."""
    candidates = list(VETTED_CANDIDATE_REPOSITORY)

    # Filter by minimum score
    candidates = [c for c in candidates if c["match_score"] >= min_score]

    # Filter by role
    if role:
        role_lower = role.strip().lower()
        candidates = [c for c in candidates if role_lower in c["target_role"].lower()]

    # Filter by graduation batch
    if batch:
        candidates = [c for c in candidates if c["graduation_year"] == batch]

    # Filter by region
    if region:
        reg_lower = region.strip().lower()
        candidates = [c for c in candidates if reg_lower in c["mobility"].lower() or reg_lower in c["institution_name"].lower()]

    # Sort candidates by match score descending
    candidates.sort(key=lambda c: -c["match_score"])

    return TalentSearchResponse(
        total_matching_candidates=len(candidates),
        role_filter=role,
        min_score_filter=min_score,
        candidates=[TalentCandidateItem(**c) for c in candidates],
    )
