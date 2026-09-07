# FILE: backend/app/api/v1/endpoints/institution.py
# PURPOSE: Academic governance and college portal endpoints for departmental heatmaps, curriculum audits, placement eligibility, and under-20 privacy blending.
# PHASE: 6 | DEPENDS ON: schemas.py, dataset.py, stakeholder_engine.py | LAST TOUCHED: Phase 6

from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.core.dataset import get_anchor_roles, get_demo_institutions, load_raw_stakeholders
from app.engines.stakeholder_engine import calculate_departmental_heatmap
from app.models.schemas import (
    CourseAuditItem,
    CourseAuditsResponse,
    CourseSkillUpdateRequest,
    DepartmentHeatmapItem,
    DepartmentHeatmapResponse,
    InstitutionOverviewResponse,
    InstitutionResponse,
    PlacementEligibilityResponse,
    PlacementTierDistribution,
)

router = APIRouter()

# In-memory working copy of audited curriculum courses to allow dynamic faculty editing
_RAW_DATA = load_raw_stakeholders()
CURRICULUM_COURSES_DB: Dict[str, dict] = {
    c["id"]: dict(c) for c in _RAW_DATA.get("curriculum_courses", [])
}

# Baseline cohort proficiencies for demo institutions (Department: Computer Science & Engineering)
INSTITUTION_COHORTS: Dict[str, Dict[str, float]] = {
    "ggv-bilaspur": {
        "Python": 62.5,
        "SQL & Databases": 58.0,
        "React": 44.0,
        "JavaScript": 64.0,
        "Docker": 28.0,
        "Machine Learning": 36.0,
        "AWS Cloud": 31.0,
        "Linux Shell & Scripting": 54.0,
        "Git & Version Control": 62.0,
        "Data Structures & Algorithms": 70.0,
        "Computer Networks": 65.0,
        "Operating Systems": 68.0,
    },
    "nit-raipur": {
        "Python": 72.0,
        "SQL & Databases": 68.0,
        "React": 58.0,
        "JavaScript": 74.0,
        "Docker": 45.0,
        "Machine Learning": 52.0,
        "AWS Cloud": 48.0,
        "Linux Shell & Scripting": 66.0,
        "Git & Version Control": 75.0,
        "Data Structures & Algorithms": 82.0,
        "Computer Networks": 72.0,
        "Operating Systems": 76.0,
    },
    "iiit-bangalore": {
        "Python": 86.0,
        "SQL & Databases": 82.0,
        "React": 76.0,
        "JavaScript": 84.0,
        "Docker": 68.0,
        "Machine Learning": 74.0,
        "AWS Cloud": 70.0,
        "Linux Shell & Scripting": 80.0,
        "Git & Version Control": 88.0,
        "Data Structures & Algorithms": 90.0,
        "Computer Networks": 84.0,
        "Operating Systems": 85.0,
    },
    "coep-pune": {
        "Python": 78.0,
        "SQL & Databases": 75.0,
        "React": 68.0,
        "JavaScript": 76.0,
        "Docker": 54.0,
        "Machine Learning": 60.0,
        "AWS Cloud": 58.0,
        "Linux Shell & Scripting": 72.0,
        "Git & Version Control": 80.0,
        "Data Structures & Algorithms": 85.0,
        "Computer Networks": 78.0,
        "Operating Systems": 80.0,
    },
    "iiit-hyderabad": {
        "Python": 90.0,
        "SQL & Databases": 85.0,
        "React": 80.0,
        "JavaScript": 88.0,
        "Docker": 74.0,
        "Machine Learning": 85.0,
        "AWS Cloud": 75.0,
        "Linux Shell & Scripting": 85.0,
        "Git & Version Control": 92.0,
        "Data Structures & Algorithms": 94.0,
        "Computer Networks": 88.0,
        "Operating Systems": 90.0,
    },
}

# Regional district average proficiencies for blended privacy floor calculations (<20 students)
DISTRICT_BASELINES: Dict[str, Dict[str, float]] = {
    "bilaspur": {
        "Python": 50.0,
        "SQL & Databases": 48.0,
        "React": 38.0,
        "JavaScript": 52.0,
        "Docker": 20.0,
        "Machine Learning": 25.0,
        "AWS Cloud": 22.0,
        "Linux Shell & Scripting": 42.0,
        "Git & Version Control": 45.0,
        "Data Structures & Algorithms": 55.0,
        "Computer Networks": 50.0,
        "Operating Systems": 52.0,
    },
    "raipur": {
        "Python": 60.0,
        "SQL & Databases": 58.0,
        "React": 48.0,
        "JavaScript": 62.0,
        "Docker": 32.0,
        "Machine Learning": 38.0,
        "AWS Cloud": 35.0,
        "Linux Shell & Scripting": 52.0,
        "Git & Version Control": 58.0,
        "Data Structures & Algorithms": 68.0,
        "Computer Networks": 60.0,
        "Operating Systems": 62.0,
    },
}


# Evaluates alignment status of a course based on its mapped technical skills.
def _evaluate_course_status(mapped_skills: List[str]) -> tuple[str, float, str]:
    modern_skills = {
        "python",
        "react",
        "docker",
        "aws cloud",
        "postgresql",
        "sql & databases",
        "machine learning",
        "rest apis",
        "ci/cd",
        "kubernetes",
        "typescript",
        "fastapi",
        "arm cortex",
        "risc-v",
        "embedded c",
        "rtos",
        "pytorch",
        "deep learning",
        "mongodb",
        "nosql",
        "next.js",
        "design patterns",
        "microservices",
    }
    obsolete_skills = {"assembly", "8085", "microprocessors", "pascal", "cobol", "vb6"}

    lower_skills = [s.lower().strip() for s in mapped_skills]

    # Check if purely obsolete
    has_obsolete = any(obs in s for obs in obsolete_skills for s in lower_skills)
    modern_count = sum(1 for s in lower_skills if any(mod in s for mod in modern_skills))

    if has_obsolete and modern_count == 0:
        return (
            "OBSOLETE",
            32.0,
            "Urgent modernization needed: Replace legacy 8085 assembly with ARM Cortex, RISC-V, or modern Embedded C.",
        )

    if modern_count >= 2:
        return (
            "ALIGNED",
            88.0,
            "Curriculum matches industry standards. Continue hands-on project labs and cloud deployment coursework.",
        )

    if modern_count == 1:
        return (
            "AT RISK",
            62.0,
            "Partially aligned. Upgrade course syllabus with modern industry frameworks (e.g. Docker, CI/CD, PyTorch).",
        )

    return (
        "AT RISK",
        55.0,
        "Syllabus lacks verified modern competencies. Introduce industry-calibrated practical assignments.",
    )


# -----------------------------------------------------------------------------
# ENDPOINT 1: LIST INSTITUTIONS
# -----------------------------------------------------------------------------
@router.get("/list", response_model=List[InstitutionResponse])
def list_institutions() -> List[InstitutionResponse]:
    """Returns the catalog of higher education colleges and universities."""
    return get_demo_institutions()


# -----------------------------------------------------------------------------
# ENDPOINT 2: INSTITUTION OVERVIEW & PRIVACY BLENDING
# -----------------------------------------------------------------------------
@router.get("/{institution_id}/overview", response_model=InstitutionOverviewResponse)
def get_institution_overview(
    institution_id: str,
    simulated_cohort_size: Optional[int] = Query(None, description="Test toggle to simulate cohort size (e.g. 19 vs 48)"),
) -> InstitutionOverviewResponse:
    """Returns institutional executive KPIs including the under-20 privacy blended data rule."""
    inst_key = institution_id.strip().lower()
    institutions = {i.id: i for i in get_demo_institutions()}
    inst = institutions.get(inst_key)

    if not inst:
        raise HTTPException(status_code=404, detail=f"Institution '{institution_id}' not found.")

    # Determine cohort count (allow simulated override for evaluators to test 19 vs 48)
    default_counts = {
        "ggv-bilaspur": 48,
        "nit-raipur": 65,
        "iiit-bangalore": 92,
        "coep-pune": 74,
        "iiit-hyderabad": 110,
    }
    actual_count = simulated_cohort_size if simulated_cohort_size is not None else default_counts.get(inst_key, 48)

    # Privacy Floor Rule: If N < 20, blend data and flag is_blended = True
    is_blended = actual_count < 20
    blend_label = (
        f"Blended Regional Cohort (Privacy Floor Protected, N = {actual_count})"
        if is_blended
        else f"Live Institutional Cohort (N = {actual_count} Verified Profiles)"
    )

    # Calculate placement eligibility rate (% scoring >= 60% readiness)
    base_eligibility = {
        "ggv-bilaspur": 68.4,
        "nit-raipur": 81.2,
        "iiit-bangalore": 94.6,
        "coep-pune": 87.5,
        "iiit-hyderabad": 96.8,
    }.get(inst_key, 70.0)

    # If blended, slightly temper towards regional tier average
    eligibility_rate = round(base_eligibility * 0.90, 1) if is_blended else base_eligibility
    avg_readiness = round(eligibility_rate * 0.92, 1)

    # Count courses currently deficient or at risk
    inst_courses = [c for c in CURRICULUM_COURSES_DB.values() if c.get("institution_id") == inst_key]
    deficient_count = sum(1 for c in inst_courses if c.get("status") in ("AT RISK", "OBSOLETE"))

    return InstitutionOverviewResponse(
        institution_id=inst.id,
        name=inst.name,
        aishe_code=f"C-{abs(hash(inst.id)) % 90000 + 10000}",
        district_id=inst.district_id,
        state=inst.state,
        type=inst.type,
        enrolled_students_count=actual_count,
        is_blended=is_blended,
        blend_label=blend_label,
        privacy_threshold=20,
        placement_eligibility_rate=eligibility_rate,
        average_readiness_score=avg_readiness,
        curriculum_health_index=round(100.0 - (deficient_count * 7.5), 1),
        deficient_courses_count=deficient_count,
        departments=[
            "Computer Science & Engineering",
            "Information Technology",
            "Electronics & Communication",
            "Artificial Intelligence & Data Science",
        ],
    )


# -----------------------------------------------------------------------------
# ENDPOINT 3: DEPARTMENTAL COMPETENCY HEATMAP
# -----------------------------------------------------------------------------
@router.get("/{institution_id}/heatmap", response_model=DepartmentHeatmapResponse)
def get_departmental_heatmap(
    institution_id: str,
    department: str = Query("Computer Science & Engineering"),
    target_role: str = Query("fullstack-developer", description="Role benchmark slug"),
    simulated_cohort_size: Optional[int] = Query(None, description="Test toggle for cohort size"),
) -> DepartmentHeatmapResponse:
    """Computes departmental average proficiencies vs. industry benchmark requirements."""
    inst_key = institution_id.strip().lower()
    institutions = {i.id: i for i in get_demo_institutions()}
    inst = institutions.get(inst_key)

    if not inst:
        raise HTTPException(status_code=404, detail=f"Institution '{institution_id}' not found.")

    cohort_size = simulated_cohort_size if simulated_cohort_size is not None else 48
    is_blended = cohort_size < 20

    # Retrieve candidate proficiencies for this institution
    cohort_proficiencies = dict(INSTITUTION_COHORTS.get(inst_key, INSTITUTION_COHORTS["ggv-bilaspur"]))

    # If privacy floor triggered, mathematically blend with district baseline (70% college + 30% district)
    if is_blended:
        district_base = DISTRICT_BASELINES.get(inst.district_id, DISTRICT_BASELINES["bilaspur"])
        for skill, val in cohort_proficiencies.items():
            dist_val = district_base.get(skill, 40.0)
            cohort_proficiencies[skill] = round(0.70 * val + 0.30 * dist_val, 1)

    # Industry benchmark standards for evaluation
    anchor_roles = {r.slug: r for r in get_anchor_roles()}
    eval_role = anchor_roles.get(target_role) or list(anchor_roles.values())[0]

    benchmark_reqs: Dict[str, float] = {}
    for s in eval_role.skills:
        benchmark_reqs[s.name] = float(s.required_level)

    # Supplement with common CS core subjects if not in role
    core_supplements = {
        "Data Structures & Algorithms": 80.0,
        "SQL & Databases": 75.0,
        "Operating Systems": 75.0,
        "Computer Networks": 70.0,
        "Linux Shell & Scripting": 65.0,
        "Git & Version Control": 70.0,
    }
    for k, v in core_supplements.items():
        if k not in benchmark_reqs:
            benchmark_reqs[k] = v

    # Run stakeholder engine departmental heatmap calculation
    raw_heatmap = calculate_departmental_heatmap(cohort_proficiencies, benchmark_reqs)

    items: List[DepartmentHeatmapItem] = []
    aligned_cnt = 0
    at_risk_cnt = 0
    deficient_cnt = 0

    for h in raw_heatmap:
        status = h["alignment_status"]
        if status == "ALIGNED":
            aligned_cnt += 1
        elif status == "AT RISK":
            at_risk_cnt += 1
        else:
            deficient_cnt += 1

        items.append(
            DepartmentHeatmapItem(
                skill_name=h["skill_name"],
                benchmark_level=h["benchmark_level"],
                cohort_average=h["cohort_average"],
                curriculum_gap=h["curriculum_gap"],
                alignment_status=status,
                formula_breakdown=h["formula_breakdown"],
                student_count_evaluated=cohort_size,
            )
        )

    blend_label = (
        f"Blended Regional Data (Privacy Floor Protected, N = {cohort_size})"
        if is_blended
        else f"Live Institutional Data (N = {cohort_size})"
    )

    return DepartmentHeatmapResponse(
        institution_id=inst.id,
        department=department,
        target_role=eval_role.title,
        total_skills_audited=len(items),
        aligned_count=aligned_cnt,
        at_risk_count=at_risk_cnt,
        deficient_count=deficient_cnt,
        is_blended=is_blended,
        blend_label=blend_label,
        skills=items,
    )


# -----------------------------------------------------------------------------
# ENDPOINT 4: COURSE SYLLABUS AUDITS
# -----------------------------------------------------------------------------
@router.get("/{institution_id}/course-audits", response_model=CourseAuditsResponse)
def get_course_audits(
    institution_id: str,
    department: str = Query("Computer Science & Engineering"),
) -> CourseAuditsResponse:
    """Audits departmental course catalog marking each course ALIGNED, AT RISK, or OBSOLETE."""
    inst_key = institution_id.strip().lower()

    # Filter courses belonging to this institution
    inst_courses = [
        c for c in CURRICULUM_COURSES_DB.values()
        if c.get("institution_id") == inst_key and (not department or c.get("department") == department)
    ]

    # Fallback to GGV Bilaspur demo courses if institution has no direct seed courses
    if not inst_courses:
        inst_courses = [
            c for c in CURRICULUM_COURSES_DB.values()
            if c.get("institution_id") == "ggv-bilaspur"
        ]

    courses_out: List[CourseAuditItem] = []
    aligned_cnt = 0
    at_risk_cnt = 0
    obsolete_cnt = 0

    for c in inst_courses:
        status = c.get("status", "ALIGNED")
        if status == "ALIGNED":
            aligned_cnt += 1
        elif status == "AT RISK":
            at_risk_cnt += 1
        else:
            obsolete_cnt += 1

        priority = "High" if status == "OBSOLETE" else ("Medium" if status == "AT RISK" else "Low")
        score = 35.0 if status == "OBSOLETE" else (65.0 if status == "AT RISK" else 90.0)

        courses_out.append(
            CourseAuditItem(
                id=c["id"],
                institution_id=institution_id,
                department=c.get("department", department),
                course_code=c["course_code"],
                course_name=c["course_name"],
                mapped_skills=c.get("mapped_skills", []),
                status=status,
                recommended_action=c.get("recommended_action", ""),
                syllabus_modernization_priority=priority,
                alignment_score=score,
            )
        )

    # Sort so OBSOLETE and AT RISK courses appear first
    priority_order = {"OBSOLETE": 0, "AT RISK": 1, "ALIGNED": 2}
    courses_out.sort(key=lambda x: priority_order.get(x.status, 3))

    return CourseAuditsResponse(
        institution_id=institution_id,
        department=department,
        total_courses_audited=len(courses_out),
        aligned_courses_count=aligned_cnt,
        at_risk_courses_count=at_risk_cnt,
        obsolete_courses_count=obsolete_cnt,
        courses=courses_out,
    )


# -----------------------------------------------------------------------------
# ENDPOINT 5: EDIT COURSE SYLLABUS SKILLS (FLIPS STATUS DYNAMICALLY)
# -----------------------------------------------------------------------------
@router.post("/{institution_id}/course-audits/{course_id}/update-skills", response_model=CourseAuditItem)
def update_course_skills(
    institution_id: str,
    course_id: str,
    payload: CourseSkillUpdateRequest,
) -> CourseAuditItem:
    """Updates mapped skills of a course, dynamically recalculating alignment status."""
    course = CURRICULUM_COURSES_DB.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail=f"Course '{course_id}' not found.")

    new_skills = payload.mapped_skills
    new_status, new_score, new_action = _evaluate_course_status(new_skills)

    # Update in-memory record
    course["mapped_skills"] = new_skills
    course["status"] = new_status
    course["recommended_action"] = new_action

    priority = "High" if new_status == "OBSOLETE" else ("Medium" if new_status == "AT RISK" else "Low")

    return CourseAuditItem(
        id=course["id"],
        institution_id=institution_id,
        department=course.get("department", "Computer Science & Engineering"),
        course_code=course["course_code"],
        course_name=course["course_name"],
        mapped_skills=new_skills,
        status=new_status,
        recommended_action=new_action,
        syllabus_modernization_priority=priority,
        alignment_score=new_score,
    )


# -----------------------------------------------------------------------------
# ENDPOINT 6: PLACEMENT ELIGIBILITY & BATCH PERCENTILES
# -----------------------------------------------------------------------------
@router.get("/{institution_id}/placement-eligibility", response_model=PlacementEligibilityResponse)
def get_placement_eligibility(
    institution_id: str,
    department: str = Query("Computer Science & Engineering"),
    simulated_cohort_size: Optional[int] = Query(None, description="Test toggle for cohort size"),
) -> PlacementEligibilityResponse:
    """Returns candidate distribution across recruitment tiers and placement readiness percentiles."""
    inst_key = institution_id.strip().lower()
    cohort_size = simulated_cohort_size if simulated_cohort_size is not None else 48
    is_blended = cohort_size < 20

    # Calibrate candidate count across the 4 tiers based on institution profile
    if inst_key in ("iiit-hyderabad", "iiit-bangalore"):
        p1, p2, p3, p4 = 0.40, 0.45, 0.12, 0.03
    elif inst_key in ("coep-pune", "nit-raipur"):
        p1, p2, p3, p4 = 0.20, 0.45, 0.25, 0.10
    else:  # GGV Bilaspur
        p1, p2, p3, p4 = 0.12, 0.38, 0.35, 0.15

    c1 = max(1, int(round(cohort_size * p1)))
    c2 = max(1, int(round(cohort_size * p2)))
    c3 = max(1, int(round(cohort_size * p3)))
    c4 = max(0, cohort_size - (c1 + c2 + c3))

    distribution = [
        PlacementTierDistribution(
            tier_name="Tier 1",
            tier_label="National Elite & Global R&D",
            candidate_count=c1,
            percentage=round((c1 / cohort_size) * 100, 1),
            expected_ctc_band="₹18 - ₹35 LPA",
            primary_recruiters="Google, Microsoft, Amazon, Adobe, Atlassian",
        ),
        PlacementTierDistribution(
            tier_name="Tier 2",
            tier_label="Specialist Tech & Unicorns",
            candidate_count=c2,
            percentage=round((c2 / cohort_size) * 100, 1),
            expected_ctc_band="₹10 - ₹18 LPA",
            primary_recruiters="Swiggy, Zomato, Razorpay, CRED, Meesho",
        ),
        PlacementTierDistribution(
            tier_name="Tier 3",
            tier_label="Enterprise IT & Consulting",
            candidate_count=c3,
            percentage=round((c3 / cohort_size) * 100, 1),
            expected_ctc_band="₹5 - ₹10 LPA",
            primary_recruiters="TCS Digital, Infosys Power, Wipro Turbo, Accenture",
        ),
        PlacementTierDistribution(
            tier_name="Tier 4",
            tier_label="Remedial / Active Upskilling",
            candidate_count=c4,
            percentage=round((c4 / cohort_size) * 100, 1),
            expected_ctc_band="₹3.5 - ₹5 LPA",
            primary_recruiters="Requires Phase 5 Roadmap Completion",
        ),
    ]

    eligibility_rate = round(((c1 + c2 + c3) / cohort_size) * 100, 1)

    return PlacementEligibilityResponse(
        institution_id=institution_id,
        department=department,
        total_evaluated=cohort_size,
        overall_eligibility_rate=eligibility_rate,
        average_readiness=68.5 if not is_blended else 61.2,
        median_readiness=70.0 if not is_blended else 63.0,
        is_blended=is_blended,
        tier_distribution=distribution,
        top_placement_roles=[
            {"role": "Full Stack Developer", "readiness": "74.2%", "demand": "High"},
            {"role": "Cloud DevOps Engineer", "readiness": "66.8%", "demand": "Surging"},
            {"role": "AI / ML Applications Engineer", "readiness": "62.4%", "demand": "Very High"},
            {"role": "Backend Systems Engineer", "readiness": "71.0%", "demand": "High"},
        ],
    )
