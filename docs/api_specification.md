# FILE: docs/api_specification.md
# PURPOSE: Master API specification cataloging all endpoints, schemas, and fields for Pravah v1.0.
# PHASE: 1 | DEPENDS ON: FastAPI OpenAPI, models/schemas.py | LAST TOUCHED: Phase 1

# Pravah (प्रवाह) — Master REST API Specification (v1.0 Frozen)

> **Base URL:** `http://localhost:8000/api/v1`  
> **API Protocol:** RESTful over HTTP/1.1 or HTTP/2, JSON payloads (`application/json`)  
> **Status:** Phase 1 Baseline Frozen  

---

## 1. Health & System Diagnostics (Phase 1)

### 1.1 Service Liveness Check
* **Endpoint:** `GET /health`
* **Purpose:** Basic ping check for server liveness and semantic version.
* **Request:** None
* **Response (200 OK):**
  ```json
  {
    "status": "OK",
    "version": "1.0.0"
  }
  ```

### 1.2 Dataset Integrity & Entity Counts
* **Endpoint:** `GET /health/stats`
* **Purpose:** Validates that raw data stores load with exact counts specified in Phase 1.
* **Request:** None
* **Response (200 OK):**
  ```json
  {
    "skills_count": 50,
    "anchor_roles_count": 10,
    "total_roles_count": 106,
    "districts_count": 5,
    "institutions_count": 5
  }
  ```

---

## 2. Taxonomy, Skills & Roles (Phase 1)

### 2.1 Canonical Skills List
* **Endpoint:** `GET /skills`
* **Purpose:** Retrieves all 50 standardized industry competencies across technical domains.
* **Response (200 OK):**
  ```json
  [
    {
      "id": "kubernetes",
      "name": "Kubernetes",
      "category": "DevOps",
      "aliases": ["k8s", "k8", "kube"],
      "default_importance": 8.5,
      "industry_demand": 9.1
    }
  ]
  ```

### 2.2 Skill Alias Resolver
* **Endpoint:** `GET /skills/resolve`
* **Query Parameter:** `query` (string, e.g. `k8s`, `py`, `reactjs`)
* **Purpose:** Resolves colloquial abbreviations to canonical platform display names.
* **Response (200 OK):**
  ```json
  {
    "query": "k8s",
    "canonical_name": "Kubernetes"
  }
  ```

### 2.3 Occupations Directory (All 106 Roles)
* **Endpoint:** `GET /roles`
* **Purpose:** Complete directory of 106 standardized industry occupations.
* **Response (200 OK):** Array of `RoleResponse` objects.

### 2.4 Anchor Deep Job Roles (10 Deep Roles)
* **Endpoint:** `GET /roles/anchor`
* **Purpose:** Retrieves the 10 deep job roles equipped with 4-tier requirement profiles (`critical`, `core`, `supporting`, `complementary`).
* **Response (200 OK):** Array of 10 `RoleResponse` objects.

### 2.5 Role Detail by Slug or ID
* **Endpoint:** `GET /roles/{role_id}`
* **Path Parameter:** `role_id` (string, e.g. `frontend-dev`, `devops-engineer`)
* **Response (200 OK):**
  ```json
  {
    "id": "frontend-dev",
    "slug": "frontend-developer",
    "title": "Frontend Developer",
    "domain": "Software Development",
    "description": "Designs and builds client-side web user interfaces...",
    "primary_focus": "Client Architecture & Web UI",
    "industry_demand": 8.5,
    "is_anchor_role": true,
    "education_factors": {
      "Computer Science": 1.0,
      "Information Technology": 0.95,
      "Electronics and Communication": 0.9,
      "Other STEM": 0.85,
      "Non-STEM": 0.8
    },
    "skills": [
      {
        "skill_id": "html",
        "name": "HTML",
        "category": "Core Web",
        "requirement_category": "critical",
        "required_level": 85,
        "weight": 7.0,
        "role_importance": 8.0,
        "mapping_weight": 0.85
      }
    ]
  }
  ```
* **Error Response (404 Not Found):**
  ```json
  {
    "detail": "Role with ID or slug 'fake-role-id' was not found in the taxonomy directory."
  }
  ```

---

## 3. Stakeholders & Regional Foundations (Phase 1)

### 3.1 Demo Administrative Districts
* **Endpoint:** `GET /districts`
* **Purpose:** Retrieves list of 5 demo administrative districts for regional planning.
* **Response (200 OK):**
  ```json
  [
    {
      "id": "bilaspur",
      "name": "Bilaspur",
      "state": "Chhattisgarh",
      "tier": 3,
      "economic_focus": "Industrial & Education Hub"
    }
  ]
  ```

### 3.2 Demo Higher Education Institutions
* **Endpoint:** `GET /institutions`
* **Purpose:** Retrieves list of 5 demo colleges and universities.
* **Response (200 OK):**
  ```json
  [
    {
      "id": "ggv-bilaspur",
      "name": "Guru Ghasidas Vishwavidyalaya",
      "district_id": "bilaspur",
      "state": "Chhattisgarh",
      "type": "Central University"
    }
  ]
  ```

---

## 4. Pure Mathematical Scoring & Gap Calculations (Phase 2)

### 4.1 Deterministic Match Scoring
* **Endpoint:** `POST /matching/calculate-match`
* **Payload:**
  ```json
  {
    "role_id": "frontend-dev",
    "student_ratings": {"html": 80, "css": 75, "javascript": 85, "react": 70},
    "degree_discipline": "Computer Science"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "role_id": "frontend-dev",
    "raw_match_score": 82.5,
    "critical_penalty": 1.0,
    "education_factor": 1.0,
    "final_readiness_score": 82.5,
    "inspect_math": {
      "capped_sum": 330.0,
      "required_sum": 400.0,
      "critical_skills_met": 2,
      "critical_skills_total": 2
    }
  }
  ```

### 4.2 4-Tier Gap Analysis
* **Endpoint:** `POST /matching/calculate-gaps`
* **Payload:** Same as match calculation.
* **Response (200 OK):** Array of gap objects classified into `critical`, `core`, `supporting`, `strengths`.

### 4.3 Interactive What-If Simulation
* **Endpoint:** `POST /matching/what-if-simulate`
* **Payload:** Baseline ratings + proposed adjusted rating for targeted skill.
* **Response (200 OK):** Baseline score, simulated score, and projected delta ($+\Delta\%$).

---

## 5. Multi-Stakeholder Auth & Data Persistence (Phase 3)

### 5.1 Persona Login & Token Issuance
* **Endpoint:** `POST /auth/login`
* **Payload:**
  ```json
  {
    "persona": "student | institution | government | employer",
    "identifier": "user@email.com / roll_no / aishe_code / dsdo_code",
    "credential": "password / otp / demo_token"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "role": "student",
    "permissions": ["student:read_self", "student:update_profile"]
  }
  ```

### 5.2 Current Session & Role Context
* **Endpoint:** `GET /auth/me`
* **Response (200 OK):** User identity, active persona, and scoped permissions.

### 5.3 Student Profile Persistence
* **Endpoint:** `POST /student/profile`
* **Payload:** Full student record (name, college, region, department, degree, year, skills map).
* **Endpoint:** `GET /student/profile/{student_id}`
* **Response (200 OK):** Saved student profile record.

---

## 6. Academic Governance / College Portal (Phase 6)

### 6.1 Departmental Curriculum Heatmap
* **Endpoint:** `GET /institution/{institution_id}/heatmap`
* **Query Parameter:** `department` (e.g. `Computer Science & Engineering`)
* **Response (200 OK):** Average student competency matrix vs. industry benchmark levels.

### 6.2 Course Syllabus Modernization Audits
* **Endpoint:** `GET /institution/{institution_id}/course-audits`
* **Response (200 OK):** Course catalog categorized as `ALIGNED`, `AT RISK`, or `OBSOLETE` with remediation recommendations.

---

## 7. Regional Planning & Industry Hiring (Phase 7)

### 7.1 District Supply vs. Demand Deficit Meter
* **Endpoint:** `GET /district/{district_id}/deficit-matrix`
* **Response (200 OK):** 5-sector supply vs demand metrics, net balance, and high-urgency alarms.

### 7.2 Gemini Unstructured Job Description Parser
* **Endpoint:** `POST /employer/extract-jd`
* **Payload:**
  ```json
  {
    "raw_text": "We are seeking a Senior DevOps Engineer with 5+ years in Kubernetes, Docker, and AWS..."
  }
  ```
* **Response (200 OK):** Structured 4-tier benchmark profile generated by Gemini 1.5/2.0 Flash (or deterministic offline fallback).

### 7.3 Vetted Talent Cohort Search
* **Endpoint:** `GET /employer/talent-search`
* **Query Parameters:** `role`, `min_score`, `batch`, `region`
* **Response (200 OK):** Blind candidate cohort records satisfying query filters.
