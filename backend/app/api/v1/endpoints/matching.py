# FILE: backend/app/api/v1/endpoints/matching.py
# PURPOSE: REST endpoints for deterministic role readiness scoring, 4-tier gap matrices, what-if simulations, and learning roadmaps.
# PHASE: 5 | DEPENDS ON: engines (role_matcher, gap_analyzer, priority_engine), dataset.py, schemas.py | LAST TOUCHED: Phase 5

from typing import Dict, List
from fastapi import APIRouter, HTTPException, status
from app.core.dataset import get_anchor_roles, get_role_by_id
from app.engines.gap_analyzer import analyze_skill_gaps
from app.engines.priority_engine import prioritize_remediation_actions
from app.engines.role_matcher import (
    calculate_final_readiness_score,
    get_degree_multiplier,
    get_tier_multiplier,
)
from app.models.schemas import (
    GapAnalysisResponse,
    InspectMathDetails,
    MatchCalculationRequest,
    MatchCalculationResponse,
    RoadmapMilestone,
    RoadmapResponse,
    RoleMatchSummary,
    SkillGapItem,
    TopRolesResponse,
    WhatIfSimulateRequest,
    WhatIfSimulateResponse,
)

router = APIRouter()


# Helper returning standard capstone project specification based on target role.
# Provides real-world scenario, core deliverables, and verification criteria.
def get_capstone_brief(role_slug: str, role_title: str) -> Dict[str, str]:
    capstones = {
        "frontend-developer": {
            "title": "Enterprise Cloud Telemetry Dashboard",
            "scenario": "Build a responsive high-throughput monitoring dashboard consuming streaming metrics with 60fps rendering and zero layout shifts.",
            "deliverables": "Component library, WebSocket state store, accessible WCAG AAA forms, interactive canvas charts.",
            "estimated_weeks": "3 Weeks (Part-time)",
        },
        "devops-engineer": {
            "title": "Multi-Region GitOps CI/CD Deployment Engine",
            "scenario": "Architect automated Kubernetes cluster provisioning with Terraform, automated canary deployments, and Prometheus alerts.",
            "deliverables": "Helm charts, sealed secrets, GitHub Actions matrix build, Grafana latency dashboard.",
            "estimated_weeks": "4 Weeks (Part-time)",
        },
        "data-scientist": {
            "title": "District Labor Market Forecasting Pipeline",
            "scenario": "Design end-to-end predictive pipeline analyzing regional skill deficits and forecasting hiring trends using calibrated time-series.",
            "deliverables": "Feature store, clean scikit-learn pipeline, model card, automated drift monitoring test suite.",
            "estimated_weeks": "3.5 Weeks (Part-time)",
        },
        "backend-developer": {
            "title": "High-Throughput Microservice API Gateway",
            "scenario": "Construct asynchronous FastAPI service with Redis token bucket rate limiting, PostgreSQL connection pooling, and JWT auth.",
            "deliverables": "Docker compose stack, OpenAPI specification, idempotency keys, pytest integration suite.",
            "estimated_weeks": "3 Weeks (Part-time)",
        },
    }
    return capstones.get(
        role_slug,
        {
            "title": f"Production {role_title} Showcase Portfolio",
            "scenario": f"Engineer an end-to-end production solution incorporating the top critical and core competencies required for {role_title}.",
            "deliverables": "Modular codebase, unit test coverage (>80%), containerized deployment, comprehensive architectural README.",
            "estimated_weeks": "3 Weeks (Part-time)",
        },
    )


# Helper mapping action verbs and recommended curriculum topics based on skill name.
# Replaces generic placeholders with concrete, pedagogy-backed study items.
def enrich_milestone_pedagogy(skill_name: str, tier: str) -> tuple[str, List[str]]:
    verb_map = {
        "critical": "Master Essential Foundation:",
        "core": "Architect Production-Grade:",
        "supporting": "Integrate Advanced Tooling:",
        "complementary": "Hone Industry Best-Practice:",
    }
    action_verb = verb_map.get(tier, "Develop Competency:")

    topics_map = {
        "Docker": ["Container lifecycle & multi-stage builds", "Docker Compose microservices", "Non-root security context"],
        "Kubernetes": ["Pods, Deployments, and Services", "ConfigMaps & Ingress controllers", "Resource limits & probes"],
        "Python": ["Asyncio concurrency & generators", "Type hints & Pydantic validation", "Pytest unit & fixture design"],
        "React": ["Custom hooks & reducer state", "Context performance optimization", "Accessible ARIA patterns"],
        "TypeScript": ["Discriminated unions & generics", "Strict nullability & utility types", "API schema contracts"],
        "SQL": ["Indexing strategies (B-Tree/GIN)", "Window functions & CTEs", "ACID transaction isolation"],
        "Git": ["Interactive rebase & cherry-pick", "Semantic versioning & tags", "Trunk-based workflow"],
        "Machine Learning": ["Cross-validation & data leakage", "Regularization & feature scaling", "ROC-AUC & precision-recall trade-offs"],
    }
    topics = topics_map.get(skill_name, [
        f"Core principles of {skill_name}",
        f"Hands-on implementation of {skill_name}",
        f"Production failure modes & debugging in {skill_name}",
    ])
    return action_verb, topics


# Computes deterministic match readiness score for a target role.
# Returns raw match, critical penalty, education factor, and transparent formula proof.
@router.post("/matching/calculate-match", response_model=MatchCalculationResponse)
def calculate_match(payload: MatchCalculationRequest) -> MatchCalculationResponse:
    role = get_role_by_id(payload.role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID '{payload.role_id}' was not found.",
        )

    role_dict = role.model_dump()
    calc = calculate_final_readiness_score(
        student_skills=payload.student_ratings,
        role=role_dict,
        degree_field=payload.degree_discipline,
    )

    inspect_math = InspectMathDetails(
        formula="Readiness = Raw Match (capped_weighted / req_weighted) x Critical Penalty (0.75 + 0.25 x met/total) x Degree Multiplier",
        capped_sum=calc["total_capped_weighted"],
        required_sum=calc["total_required_weighted"],
        critical_skills_met=calc["critical_met"],
        critical_skills_total=calc["critical_total"],
        critical_penalty_factor=calc["critical_penalty"],
        degree_multiplier=calc["education_factor"],
    )

    return MatchCalculationResponse(
        role_id=role.id,
        role_title=role.title,
        raw_match_score=calc["raw_score"],
        critical_penalty=calc["critical_penalty"],
        education_factor=calc["education_factor"],
        final_readiness_score=calc["final_score"],
        inspect_math=inspect_math,
    )


# Generates complete 4-tier gap analysis matrix against role benchmark.
# Categorizes skills into critical deficits, core gaps, supporting refinements, and strengths.
@router.post("/matching/calculate-gaps", response_model=GapAnalysisResponse)
def calculate_gaps(payload: MatchCalculationRequest) -> GapAnalysisResponse:
    role = get_role_by_id(payload.role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID '{payload.role_id}' was not found.",
        )

    role_skills = [s.model_dump() for s in role.skills]
    all_gaps = analyze_skill_gaps(payload.student_ratings, role_skills)

    critical_gaps: List[SkillGapItem] = []
    core_gaps: List[SkillGapItem] = []
    supporting_gaps: List[SkillGapItem] = []
    strengths: List[SkillGapItem] = []

    for g in all_gaps:
        tier_cat = g.get("tier", "supporting")
        req_cat = g.get("requirement_category", "core")
        item = SkillGapItem(
            skill_id=g["skill_id"],
            skill_name=g["skill_name"],
            category=g["category"],
            requirement_category=req_cat,
            tier_category=tier_cat,
            required_level=g["required_level"],
            student_level=g["student_level"],
            gap=g["gap"],
            severity=g.get("gap_severity", 0.0),
            tier_weight=get_tier_multiplier(req_cat),
            role_importance=float(g.get("role_importance", 8.0)),
        )
        if tier_cat == "critical":
            critical_gaps.append(item)
        elif tier_cat == "core":
            core_gaps.append(item)
        elif tier_cat == "supporting":
            supporting_gaps.append(item)
        else:
            strengths.append(item)

    total_gaps = len(critical_gaps) + len(core_gaps) + len(supporting_gaps)

    return GapAnalysisResponse(
        role_id=role.id,
        role_title=role.title,
        critical_gaps=critical_gaps,
        core_gaps=core_gaps,
        supporting_gaps=supporting_gaps,
        strengths=strengths,
        total_gaps_count=total_gaps,
    )


# Evaluates live what-if simulation to project immediate readiness score gains.
# Recalculates readiness score deterministically with the proposed skill proficiency.
@router.post("/matching/what-if-simulate", response_model=WhatIfSimulateResponse)
def what_if_simulate(payload: WhatIfSimulateRequest) -> WhatIfSimulateResponse:
    role = get_role_by_id(payload.role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID '{payload.role_id}' was not found.",
        )

    role_dict = role.model_dump()
    baseline_res = calculate_final_readiness_score(
        student_skills=payload.baseline_ratings,
        role=role_dict,
        degree_field=payload.degree_discipline,
    )
    baseline_score = baseline_res["final_score"]

    # Apply proposed simulated adjustment
    simulated_ratings = dict(payload.baseline_ratings)
    simulated_ratings[payload.target_skill] = payload.simulated_rating

    simulated_res = calculate_final_readiness_score(
        student_skills=simulated_ratings,
        role=role_dict,
        degree_field=payload.degree_discipline,
    )
    simulated_score = simulated_res["final_score"]
    gain = round(simulated_score - baseline_score, 2)

    is_crit = any(
        s.skill_id == payload.target_skill and s.requirement_category == "critical"
        for s in role.skills
    )

    return WhatIfSimulateResponse(
        role_id=role.id,
        target_skill=payload.target_skill,
        baseline_score=baseline_score,
        simulated_score=simulated_score,
        projected_gain=gain,
        is_critical_skill=is_crit,
    )


# Ranks student against all 10 deep anchor market roles.
# Returns top-10 roles sorted by match percentage with why-match rationale.
@router.post("/matching/top-roles", response_model=TopRolesResponse)
def list_top_roles(payload: MatchCalculationRequest) -> TopRolesResponse:
    anchor_roles = get_anchor_roles()
    results: List[RoleMatchSummary] = []

    for role in anchor_roles:
        role_dict = role.model_dump()
        calc = calculate_final_readiness_score(
            student_skills=payload.student_ratings,
            role=role_dict,
            degree_field=payload.degree_discipline,
        )
        score = calc["final_score"]

        # Build clean why-match rationale with normalized case-insensitive keys
        norm_ratings = {k.strip().lower(): float(v) for k, v in payload.student_ratings.items()}
        matched_skills = [
            s.name
            for s in role.skills
            if norm_ratings.get(s.skill_id.lower(), norm_ratings.get(s.name.lower(), 0.0)) >= (s.required_level * 0.7)
        ]
        if matched_skills:
            rationale = f"Strong alignment with {len(matched_skills)} skills ({', '.join(matched_skills[:3])})."
        else:
            rationale = f"Entry-level match; high industry demand ({role.industry_demand}/10)."

        results.append(
            RoleMatchSummary(
                role_id=role.id,
                slug=role.slug,
                title=role.title,
                domain=role.domain,
                match_percentage=score,
                industry_demand=role.industry_demand,
                primary_focus=role.primary_focus,
                why_match_rationale=rationale,
            )
        )

    # Sort descending by match score, tie-break by industry demand
    results.sort(key=lambda r: (-r.match_percentage, -r.industry_demand))
    return TopRolesResponse(roles=results)


# Generates prioritized step-by-step remediation roadmap with pedagogical study hours.
# Produces milestone sequencing and authentic portfolio capstone project briefs.
@router.post("/matching/roadmap", response_model=RoadmapResponse)
def generate_roadmap(payload: MatchCalculationRequest) -> RoadmapResponse:
    role = get_role_by_id(payload.role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with ID '{payload.role_id}' was not found.",
        )

    role_skills = [s.model_dump() for s in role.skills]
    gaps = analyze_skill_gaps(payload.student_ratings, role_skills)
    actions = prioritize_remediation_actions(gaps, role.industry_demand)

    milestones: List[RoadmapMilestone] = []
    total_hours = 0

    for act in actions:
        action_verb, topics = enrich_milestone_pedagogy(act["skill_name"], act["requirement_category"])
        hours = act["estimated_study_hours"]
        total_hours += hours

        milestones.append(
            RoadmapMilestone(
                skill_id=act["skill_id"],
                skill_name=act["skill_name"],
                category=act["category"],
                requirement_category=act["requirement_category"],
                gap=act["gap"],
                priority_score=act["priority_score"],
                estimated_study_hours=hours,
                pedagogical_formula=act["pedagogical_formula"],
                action_verb=action_verb,
                recommended_topics=topics,
            )
        )

    capstone = get_capstone_brief(role.slug, role.title)

    return RoadmapResponse(
        role_id=role.id,
        role_title=role.title,
        total_estimated_hours=total_hours,
        milestones=milestones,
        capstone_project=capstone,
    )
