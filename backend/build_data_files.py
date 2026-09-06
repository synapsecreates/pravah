# FILE: backend/build_data_files.py
# PURPOSE: Generates canonical skills, 106 roles with 10 deep anchor roles, and demo stakeholders.
# PHASE: 1 | DEPENDS ON: Python standard library, json | LAST TOUCHED: Phase 1

import json
import os
import re

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app", "data")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. Generate canonical_skills.json (50 canonical industry skills with aliases)
CANONICAL_SKILLS = [
    # Programming
    {"id": "python", "name": "Python", "category": "Programming", "aliases": ["py", "python3"], "default_importance": 9.0, "industry_demand": 9.5},
    {"id": "javascript", "name": "JavaScript", "category": "Programming", "aliases": ["js", "es6", "vanilla js"], "default_importance": 9.0, "industry_demand": 9.2},
    {"id": "typescript", "name": "TypeScript", "category": "Programming", "aliases": ["ts"], "default_importance": 8.5, "industry_demand": 9.0},
    {"id": "java", "name": "Java", "category": "Programming", "aliases": ["core java", "java8", "jvm"], "default_importance": 8.5, "industry_demand": 8.8},
    {"id": "cplusplus", "name": "C++", "category": "Programming", "aliases": ["cpp", "c/c++"], "default_importance": 8.0, "industry_demand": 8.2},
    {"id": "csharp", "name": "C#", "category": "Programming", "aliases": ["c#/.net", "csharp", "dotnet"], "default_importance": 8.0, "industry_demand": 8.0},
    {"id": "go", "name": "Go", "category": "Programming", "aliases": ["golang"], "default_importance": 8.5, "industry_demand": 8.6},
    {"id": "rust", "name": "Rust", "category": "Programming", "aliases": ["rustlang"], "default_importance": 8.0, "industry_demand": 8.4},
    {"id": "php", "name": "PHP", "category": "Programming", "aliases": ["php8"], "default_importance": 6.5, "industry_demand": 6.8},
    {"id": "ruby", "name": "Ruby", "category": "Programming", "aliases": ["ruby on rails", "rails"], "default_importance": 6.5, "industry_demand": 6.5},

    # Core Web & Frontend
    {"id": "html", "name": "HTML", "category": "Core Web", "aliases": ["html5", "semantic html"], "default_importance": 7.5, "industry_demand": 8.5},
    {"id": "css", "name": "CSS", "category": "Core Web", "aliases": ["css3", "sass", "scss"], "default_importance": 7.5, "industry_demand": 8.5},
    {"id": "react", "name": "React", "category": "Frontend", "aliases": ["reactjs", "react.js"], "default_importance": 9.0, "industry_demand": 9.4},
    {"id": "nextjs", "name": "Next.js", "category": "Frontend", "aliases": ["next", "next js"], "default_importance": 8.5, "industry_demand": 8.9},
    {"id": "angular", "name": "Angular", "category": "Frontend", "aliases": ["angularjs", "ng"], "default_importance": 7.5, "industry_demand": 7.8},
    {"id": "vue", "name": "Vue.js", "category": "Frontend", "aliases": ["vue", "vuejs"], "default_importance": 7.5, "industry_demand": 7.9},
    {"id": "tailwind", "name": "Tailwind CSS", "category": "Frontend", "aliases": ["tailwindcss", "tailwind"], "default_importance": 7.5, "industry_demand": 8.5},

    # Backend & Architecture
    {"id": "node", "name": "Node.js", "category": "Backend", "aliases": ["nodejs", "node"], "default_importance": 8.5, "industry_demand": 9.0},
    {"id": "express", "name": "Express.js", "category": "Backend", "aliases": ["express", "expressjs"], "default_importance": 7.5, "industry_demand": 8.2},
    {"id": "django", "name": "Django", "category": "Backend", "aliases": ["django rest framework", "drf"], "default_importance": 8.0, "industry_demand": 8.3},
    {"id": "fastapi", "name": "FastAPI", "category": "Backend", "aliases": ["fast-api", "fastapi python"], "default_importance": 8.5, "industry_demand": 8.8},
    {"id": "springboot", "name": "Spring Boot", "category": "Backend", "aliases": ["spring", "spring framework"], "default_importance": 8.5, "industry_demand": 8.7},
    {"id": "rest_apis", "name": "REST APIs", "category": "Architecture", "aliases": ["restful", "rest api", "rest"], "default_importance": 8.5, "industry_demand": 9.0},
    {"id": "graphql", "name": "GraphQL", "category": "Architecture", "aliases": ["gql", "apollo"], "default_importance": 7.5, "industry_demand": 8.0},
    {"id": "microservices", "name": "Microservices", "category": "Architecture", "aliases": ["microservice architecture"], "default_importance": 8.5, "industry_demand": 8.8},

    # Databases & Storage
    {"id": "sql", "name": "SQL & Databases", "category": "Databases", "aliases": ["sql", "rdbms", "relational database"], "default_importance": 9.0, "industry_demand": 9.2},
    {"id": "postgresql", "name": "PostgreSQL", "category": "Databases", "aliases": ["postgres", "pgsql"], "default_importance": 8.5, "industry_demand": 9.0},
    {"id": "mysql", "name": "MySQL", "category": "Databases", "aliases": ["mariadb"], "default_importance": 8.0, "industry_demand": 8.4},
    {"id": "mongodb", "name": "MongoDB", "category": "Databases", "aliases": ["mongo", "nosql"], "default_importance": 8.0, "industry_demand": 8.3},
    {"id": "redis", "name": "Redis", "category": "Databases", "aliases": ["redis cache", "in-memory db"], "default_importance": 7.5, "industry_demand": 8.4},

    # DevOps, Cloud & OS
    {"id": "git", "name": "Git & Version Control", "category": "DevOps", "aliases": ["git", "github", "gitlab"], "default_importance": 8.0, "industry_demand": 9.2},
    {"id": "docker", "name": "Docker", "category": "DevOps", "aliases": ["containerization", "containers", "docker-compose"], "default_importance": 8.5, "industry_demand": 9.2},
    {"id": "kubernetes", "name": "Kubernetes", "category": "DevOps", "aliases": ["k8s", "k8", "kube"], "default_importance": 8.5, "industry_demand": 9.1},
    {"id": "linux", "name": "Linux Shell & Scripting", "category": "Operating Systems", "aliases": ["linux", "bash", "shell scripting", "unix"], "default_importance": 8.0, "industry_demand": 8.7},
    {"id": "ci_cd", "name": "CI/CD Pipelines", "category": "DevOps", "aliases": ["cicd", "continuous integration", "github actions", "jenkins"], "default_importance": 8.0, "industry_demand": 8.9},
    {"id": "aws", "name": "AWS Cloud", "category": "Cloud Infrastructure", "aliases": ["aws", "amazon web services", "ec2", "s3"], "default_importance": 8.5, "industry_demand": 9.3},
    {"id": "azure", "name": "Microsoft Azure", "category": "Cloud Infrastructure", "aliases": ["azure", "azure cloud"], "default_importance": 8.0, "industry_demand": 8.6},
    {"id": "gcp", "name": "Google Cloud Platform", "category": "Cloud Infrastructure", "aliases": ["gcp", "google cloud"], "default_importance": 8.0, "industry_demand": 8.5},
    {"id": "terraform", "name": "Terraform (IaC)", "category": "DevOps", "aliases": ["terraform", "iac", "infrastructure as code"], "default_importance": 8.0, "industry_demand": 8.7},

    # AI, Data Science & Machine Learning
    {"id": "machine_learning", "name": "Machine Learning", "category": "AI & ML", "aliases": ["ml", "scikit-learn", "sklearn"], "default_importance": 9.0, "industry_demand": 9.6},
    {"id": "deep_learning", "name": "Deep Learning", "category": "AI & ML", "aliases": ["neural networks", "dl", "ann", "cnn"], "default_importance": 8.5, "industry_demand": 9.2},
    {"id": "pytorch", "name": "PyTorch", "category": "AI & ML", "aliases": ["torch"], "default_importance": 8.5, "industry_demand": 9.3},
    {"id": "tensorflow", "name": "TensorFlow", "category": "AI & ML", "aliases": ["tf", "keras"], "default_importance": 8.0, "industry_demand": 8.8},
    {"id": "nlp", "name": "Natural Language Processing", "category": "AI & ML", "aliases": ["nlp", "transformers", "llm", "huggingface"], "default_importance": 8.5, "industry_demand": 9.4},
    {"id": "data_analysis", "name": "Data Analysis & Pandas", "category": "Analytics", "aliases": ["pandas", "numpy", "eda"], "default_importance": 8.5, "industry_demand": 9.0},
    {"id": "data_visualization", "name": "Data Visualization", "category": "Analytics", "aliases": ["power bi", "tableau", "matplotlib", "seaborn"], "default_importance": 7.5, "industry_demand": 8.5},

    # System Design & Architecture
    {"id": "system_design", "name": "System Design & Architecture", "category": "Architecture", "aliases": ["hld", "lld", "software architecture"], "default_importance": 8.5, "industry_demand": 9.1},

    # Security & Testing
    {"id": "cybersecurity", "name": "Cybersecurity Fundamentals", "category": "Security", "aliases": ["infosec", "network security", "owasp"], "default_importance": 8.0, "industry_demand": 8.9},
    {"id": "cryptography", "name": "Cryptography & PKI", "category": "Security", "aliases": ["crypto", "ssl/tls", "encryption"], "default_importance": 7.5, "industry_demand": 8.1},
    {"id": "unit_testing", "name": "Testing & QA Automation", "category": "Testing", "aliases": ["pytest", "jest", "unit test", "selenium"], "default_importance": 7.5, "industry_demand": 8.4}
]

with open(os.path.join(DATA_DIR, "canonical_skills.json"), "w", encoding="utf-8") as f:
    json.dump(CANONICAL_SKILLS, f, indent=2)
print(f"Generated canonical_skills.json with {len(CANONICAL_SKILLS)} skills.")

# 2. Build seed_roles.json from sih-26134-app source with 4-tier requirement categories
SCRATCH_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC_ROLES = os.path.join(SCRATCH_DIR, "sih-26134-app", "backend", "data", "seed_roles.json")
with open(SRC_ROLES, "r", encoding="utf-8") as f:
    src_data = json.load(f)

raw_roles = src_data.get("roles", [])
top10_ids = [
    "frontend-dev",
    "backend-dev",
    "ai-ml-engineer",
    "data-analyst",
    "fullstack-dev",
    "devops-engineer",
    "cloud-architect",
    "cybersecurity-analyst",
    "data-engineer",
    "data-scientist",
]

transformed_roles = []
for role in raw_roles:
    is_anchor = role["id"] in top10_ids
    transformed_skills = []
    
    # Transform skills to include 4-tier categorization
    for s in role.get("skills", []):
        imp = s.get("role_importance", 7.0)
        req_lvl = s.get("required_level", 70)
        
        # Determine 4-tier semantic requirement category
        if imp >= 9.0 or req_lvl >= 85:
            req_cat = "critical"
        elif imp >= 8.0 or req_lvl >= 75:
            req_cat = "core"
        elif imp >= 6.5 or req_lvl >= 60:
            req_cat = "supporting"
        else:
            req_cat = "complementary"
            
        skill_slug = re.sub(r"[^a-z0-9]+", "-", s["name"].lower()).strip("-")
        transformed_skills.append({
            "skill_id": skill_slug,
            "name": s["name"],
            "category": s.get("category", "General"),
            "requirement_category": req_cat,
            "required_level": req_lvl,
            "weight": s.get("weight", 7.0),
            "role_importance": imp,
            "mapping_weight": s.get("mapping_weight", 0.85)
        })

    transformed_roles.append({
        "id": role["id"],
        "slug": role.get("slug", role["id"]),
        "title": role["title"],
        "domain": role.get("domain", "Software Development"),
        "description": role.get("description", ""),
        "primary_focus": role.get("primary_focus", ""),
        "industry_demand": role.get("industry_demand", 8.0),
        "is_anchor_role": is_anchor,
        "education_factors": role.get("education_factors", {
            "Computer Science": 1.0,
            "Information Technology": 0.95,
            "Electronics and Communication": 0.90,
            "Other STEM": 0.85,
            "Non-STEM": 0.80
        }),
        "skills": transformed_skills
    })

roles_payload = {
    "dataset_version": "1.0.0",
    "dataset_label": "Pravah Industry Occupations Taxonomy",
    "total_roles": len(transformed_roles),
    "anchor_roles_count": sum(1 for r in transformed_roles if r["is_anchor_role"]),
    "roles": transformed_roles
}

with open(os.path.join(DATA_DIR, "seed_roles.json"), "w", encoding="utf-8") as f:
    json.dump(roles_payload, f, indent=2)
print(f"Generated seed_roles.json: {len(transformed_roles)} total roles, {roles_payload['anchor_roles_count']} anchor deep roles.")

# 3. Generate seed_stakeholders.json
stakeholders_payload = {
    "districts": [
        {"id": "bilaspur", "name": "Bilaspur", "state": "Chhattisgarh", "tier": 3, "economic_focus": "Industrial & Education Hub"},
        {"id": "raipur", "name": "Raipur", "state": "Chhattisgarh", "tier": 2, "economic_focus": "Capital & Technology Center"},
        {"id": "bangalore", "name": "Bangalore Urban", "state": "Karnataka", "tier": 1, "economic_focus": "Tier 1 Global Tech Capital"},
        {"id": "pune", "name": "Pune", "state": "Maharashtra", "tier": 1, "economic_focus": "Automotive & Enterprise Software"},
        {"id": "hyderabad", "name": "Hyderabad", "state": "Telangana", "tier": 1, "economic_focus": "AI, Cloud & Biotechnology Hub"}
    ],
    "institutions": [
        {"id": "ggv-bilaspur", "name": "Guru Ghasidas Vishwavidyalaya", "district_id": "bilaspur", "state": "Chhattisgarh", "type": "Central University"},
        {"id": "nit-raipur", "name": "National Institute of Technology Raipur", "district_id": "raipur", "state": "Chhattisgarh", "type": "Institute of National Importance"},
        {"id": "iiit-bangalore", "name": "IIIT Bangalore", "district_id": "bangalore", "state": "Karnataka", "type": "State University"},
        {"id": "coep-pune", "name": "COEP Technological University", "district_id": "pune", "state": "Maharashtra", "type": "State University"},
        {"id": "iiit-hyderabad", "name": "IIIT Hyderabad", "district_id": "hyderabad", "state": "Telangana", "type": "Autonomous University"}
    ],
    "curriculum_courses": [
        {"id": "cs101", "institution_id": "ggv-bilaspur", "department": "Computer Science & Engineering", "course_code": "CS301", "course_name": "Object-Oriented Programming (Java/Python)", "mapped_skills": ["Python", "Java"], "status": "ALIGNED", "recommended_action": "Modernize with design patterns and asynchronous programming."},
        {"id": "cs102", "institution_id": "ggv-bilaspur", "department": "Computer Science & Engineering", "course_code": "CS302", "course_name": "Database Management Systems", "mapped_skills": ["SQL & Databases", "PostgreSQL"], "status": "ALIGNED", "recommended_action": "Incorporate NoSQL databases and query indexing strategies."},
        {"id": "cs103", "institution_id": "ggv-bilaspur", "department": "Computer Science & Engineering", "course_code": "CS401", "course_name": "Web Technologies & Application Design", "mapped_skills": ["HTML", "CSS", "JavaScript", "React"], "status": "ALIGNED", "recommended_action": "Upgrade from jQuery to React/TypeScript and REST APIs."},
        {"id": "cs104", "institution_id": "ggv-bilaspur", "department": "Computer Science & Engineering", "course_code": "CS405", "course_name": "Microprocessor Architecture & 8085 Assembly", "mapped_skills": ["Assembly", "Microprocessors"], "status": "OBSOLETE", "recommended_action": "Replace 8085 legacy labs with ARM Cortex, RISC-V, or Embedded C/Linux systems."},
        {"id": "cs105", "institution_id": "ggv-bilaspur", "department": "Computer Science & Engineering", "course_code": "CS502", "course_name": "Server Administration & Linux Shell", "mapped_skills": ["Linux Shell & Scripting", "Git & Version Control", "Docker"], "status": "AT RISK", "recommended_action": "Expand basic bash scripting to containerization with Docker and CI/CD fundamentals."},
        {"id": "cs106", "institution_id": "ggv-bilaspur", "department": "Computer Science & Engineering", "course_code": "CS504", "course_name": "Introduction to Artificial Intelligence", "mapped_skills": ["Machine Learning", "Python"], "status": "AT RISK", "recommended_action": "Modernize syllabus with PyTorch, neural networks, and prompt engineering foundations."},
        {"id": "cs107", "institution_id": "ggv-bilaspur", "department": "Computer Science & Engineering", "course_code": "CS603", "course_name": "Distributed Systems & Cloud Computing", "mapped_skills": ["AWS Cloud", "Docker", "REST APIs"], "status": "ALIGNED", "recommended_action": "Incorporate hands-on cloud credits and microservice deployment labs."}
    ],
    "district_demand": {
        "bilaspur": {
            "Python": {"demand_level": 8.0, "hiring_volume": 140, "growth_yoy": "+14%"},
            "SQL & Databases": {"demand_level": 8.5, "hiring_volume": 180, "growth_yoy": "+18%"},
            "React": {"demand_level": 8.2, "hiring_volume": 160, "growth_yoy": "+22%"},
            "JavaScript": {"demand_level": 8.5, "hiring_volume": 190, "growth_yoy": "+15%"},
            "Machine Learning": {"demand_level": 7.5, "hiring_volume": 90, "growth_yoy": "+35%"},
            "AWS Cloud": {"demand_level": 8.0, "hiring_volume": 110, "growth_yoy": "+28%"},
            "Docker": {"demand_level": 7.2, "hiring_volume": 85, "growth_yoy": "+25%"}
        },
        "raipur": {
            "Python": {"demand_level": 8.8, "hiring_volume": 280, "growth_yoy": "+24%"},
            "SQL & Databases": {"demand_level": 9.0, "hiring_volume": 320, "growth_yoy": "+20%"},
            "React": {"demand_level": 8.9, "hiring_volume": 290, "growth_yoy": "+30%"},
            "JavaScript": {"demand_level": 9.1, "hiring_volume": 340, "growth_yoy": "+22%"},
            "Machine Learning": {"demand_level": 8.4, "hiring_volume": 180, "growth_yoy": "+42%"},
            "AWS Cloud": {"demand_level": 8.6, "hiring_volume": 220, "growth_yoy": "+38%"},
            "Docker": {"demand_level": 8.0, "hiring_volume": 160, "growth_yoy": "+34%"}
        },
        "bangalore": {
            "Python": {"demand_level": 9.8, "hiring_volume": 3200, "growth_yoy": "+45%"},
            "SQL & Databases": {"demand_level": 9.5, "hiring_volume": 2900, "growth_yoy": "+30%"},
            "React": {"demand_level": 9.6, "hiring_volume": 3100, "growth_yoy": "+38%"},
            "JavaScript": {"demand_level": 9.5, "hiring_volume": 3300, "growth_yoy": "+28%"},
            "Machine Learning": {"demand_level": 9.7, "hiring_volume": 2400, "growth_yoy": "+65%"},
            "AWS Cloud": {"demand_level": 9.6, "hiring_volume": 2700, "growth_yoy": "+52%"},
            "Docker": {"demand_level": 9.2, "hiring_volume": 2100, "growth_yoy": "+48%"}
        },
        "pune": {
            "Python": {"demand_level": 9.2, "hiring_volume": 1800, "growth_yoy": "+32%"},
            "SQL & Databases": {"demand_level": 9.1, "hiring_volume": 1950, "growth_yoy": "+25%"},
            "React": {"demand_level": 9.0, "hiring_volume": 1700, "growth_yoy": "+28%"},
            "JavaScript": {"demand_level": 9.0, "hiring_volume": 1850, "growth_yoy": "+24%"},
            "Machine Learning": {"demand_level": 8.8, "hiring_volume": 1200, "growth_yoy": "+40%"},
            "AWS Cloud": {"demand_level": 9.0, "hiring_volume": 1400, "growth_yoy": "+36%"},
            "Docker": {"demand_level": 8.7, "hiring_volume": 1150, "growth_yoy": "+30%"}
        },
        "hyderabad": {
            "Python": {"demand_level": 9.5, "hiring_volume": 2600, "growth_yoy": "+40%"},
            "SQL & Databases": {"demand_level": 9.3, "hiring_volume": 2400, "growth_yoy": "+28%"},
            "React": {"demand_level": 9.4, "hiring_volume": 2500, "growth_yoy": "+35%"},
            "JavaScript": {"demand_level": 9.3, "hiring_volume": 2550, "growth_yoy": "+26%"},
            "Machine Learning": {"demand_level": 9.5, "hiring_volume": 2100, "growth_yoy": "+58%"},
            "AWS Cloud": {"demand_level": 9.4, "hiring_volume": 2300, "growth_yoy": "+48%"},
            "Docker": {"demand_level": 9.0, "hiring_volume": 1800, "growth_yoy": "+42%"}
        }
    }
}

with open(os.path.join(DATA_DIR, "seed_stakeholders.json"), "w", encoding="utf-8") as f:
    json.dump(stakeholders_payload, f, indent=2)
print(f"Generated seed_stakeholders.json: {len(stakeholders_payload['districts'])} districts, {len(stakeholders_payload['institutions'])} institutions.")
