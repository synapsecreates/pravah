// FILE: src/data/roles_taxonomy.ts
// PURPOSE: Complete national occupational directory of all 106 roles with competency requirements and domain categorization.
// PHASE: 5 | DEPENDS ON: backend/app/data/seed_roles.json | LAST TOUCHED: Phase 5

export interface TaxonomyRoleSkill {
  skill_id: string;
  name: string;
  required_level: number;
  importance_weight: number;
  category: string;
}

export interface TaxonomyRole {
  id: string;
  slug: string;
  title: string;
  domain: string;
  description: string;
  primary_focus: string;
  industry_demand: number;
  is_anchor_role: boolean;
  skills: TaxonomyRoleSkill[];
}

export const ALL_106_ROLES: TaxonomyRole[] = [
  {
    "id": "frontend-dev",
    "slug": "frontend-developer",
    "title": "Frontend Developer",
    "domain": "Software Engineering",
    "description": "Designs and builds client-side web user interfaces, component architectures, and responsive experiences.",
    "primary_focus": "",
    "industry_demand": 8.5,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "html",
        "name": "HTML",
        "required_level": 85,
        "importance_weight": 7,
        "category": "Core Web"
      },
      {
        "skill_id": "css",
        "name": "CSS",
        "required_level": 80,
        "importance_weight": 7,
        "category": "Core Web"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "typescript",
        "name": "TypeScript",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "react",
        "name": "React",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Frameworks"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Tools & Workflow"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "responsive-design",
        "name": "Responsive Design",
        "required_level": 80,
        "importance_weight": 7,
        "category": "Core Web"
      }
    ]
  },
  {
    "id": "backend-dev",
    "slug": "backend-developer",
    "title": "Backend Developer",
    "domain": "Software Engineering",
    "description": "Architects server-side logic, data access layers, transactional integrity, and scalable micro-service APIs.",
    "primary_focus": "",
    "industry_demand": 9.0,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 70,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Architecture"
      },
      {
        "skill_id": "databases",
        "name": "Databases",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Tools & Workflow"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 75,
        "importance_weight": 9,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "ai-ml-engineer",
    "slug": "ai-ml-engineer",
    "title": "AI/ML Engineer",
    "domain": "AI & Machine Learning",
    "description": "Researches, trains, validates, and deploys predictive machine learning and deep neural network models.",
    "primary_focus": "",
    "industry_demand": 9.5,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "probability",
        "name": "Probability",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "statistics",
        "name": "Statistics",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Mathematics"
      },
      {
        "skill_id": "machine-learning",
        "name": "Machine Learning",
        "required_level": 80,
        "importance_weight": 10,
        "category": "Core AI"
      },
      {
        "skill_id": "numpy",
        "name": "NumPy",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Data Science"
      },
      {
        "skill_id": "pandas",
        "name": "Pandas",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Data Science"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Databases"
      },
      {
        "skill_id": "deep-learning",
        "name": "Deep Learning",
        "required_level": 75,
        "importance_weight": 9,
        "category": "Core AI"
      }
    ]
  },
  {
    "id": "data-analyst",
    "slug": "data-analyst",
    "title": "Data Analyst",
    "domain": "Data & Analytics",
    "description": "Transforms raw transactional and business telemetry into statistical insights, executive dashboards, and actionable metrics.",
    "primary_focus": "",
    "industry_demand": 8.0,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Databases"
      },
      {
        "skill_id": "excel",
        "name": "Excel",
        "required_level": 80,
        "importance_weight": 7,
        "category": "Analysis Tools"
      },
      {
        "skill_id": "statistics",
        "name": "Statistics",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 70,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "pandas",
        "name": "Pandas",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Data Science"
      },
      {
        "skill_id": "data-visualization",
        "name": "Data Visualization",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Visualization"
      },
      {
        "skill_id": "power-bi",
        "name": "Power BI",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Visualization"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Soft Skills"
      }
    ]
  },
  {
    "id": "fullstack-dev",
    "slug": "full-stack-developer",
    "title": "Full Stack Developer",
    "domain": "Software Engineering",
    "description": "Builds end-to-end web applications combining user interfaces, API gateways, database persistence, and cloud infrastructure.",
    "primary_focus": "",
    "industry_demand": 9.2,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "typescript",
        "name": "TypeScript",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "react",
        "name": "React",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frontend"
      },
      {
        "skill_id": "node-js",
        "name": "Node.js",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Backend"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 75,
        "importance_weight": 6,
        "category": "Tools"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Architecture"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "devops-engineer",
    "slug": "devops-engineer",
    "title": "DevOps Engineer",
    "domain": "Cloud & DevOps",
    "description": "Automates CI/CD pipelines, container orchestration, infrastructure provisioning, and continuous monitoring.",
    "primary_focus": "",
    "industry_demand": 9.4,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "docker",
        "name": "Docker",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Containers"
      },
      {
        "skill_id": "kubernetes",
        "name": "Kubernetes",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Orchestration"
      },
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 85,
        "importance_weight": 8,
        "category": "OS"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 80,
        "importance_weight": 7,
        "category": "Tools"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Scripting"
      },
      {
        "skill_id": "bash",
        "name": "Bash",
        "required_level": 80,
        "importance_weight": 7,
        "category": "Scripting"
      },
      {
        "skill_id": "aws",
        "name": "AWS",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Cloud"
      },
      {
        "skill_id": "ci-cd",
        "name": "CI/CD",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Automation"
      }
    ]
  },
  {
    "id": "cloud-architect",
    "slug": "cloud-solutions-architect",
    "title": "Cloud Solutions Architect",
    "domain": "Cloud & DevOps",
    "description": "Architects enterprise cloud infrastructure, multi-region failover, cost optimization, and migration strategies.",
    "primary_focus": "",
    "industry_demand": 9.6,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "aws",
        "name": "AWS",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Cloud"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Architecture"
      },
      {
        "skill_id": "docker",
        "name": "Docker",
        "required_level": 80,
        "importance_weight": 7,
        "category": "Containers"
      },
      {
        "skill_id": "kubernetes",
        "name": "Kubernetes",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Orchestration"
      },
      {
        "skill_id": "networking",
        "name": "Networking",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Infrastructure"
      },
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Security"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Programming"
      }
    ]
  },
  {
    "id": "cybersecurity-analyst",
    "slug": "cybersecurity-analyst",
    "title": "Cybersecurity Analyst",
    "domain": "Cybersecurity",
    "description": "Monitors networks, mitigates security incidents, conducts vulnerability assessments, and enforces compliance policies.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Cybersecurity"
      },
      {
        "skill_id": "networking",
        "name": "Networking",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Infrastructure"
      },
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 80,
        "importance_weight": 8,
        "category": "OS"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Scripting"
      },
      {
        "skill_id": "penetration-testing",
        "name": "Penetration Testing",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Security"
      },
      {
        "skill_id": "cryptography",
        "name": "Cryptography",
        "required_level": 70,
        "importance_weight": 7,
        "category": "Security"
      },
      {
        "skill_id": "siem",
        "name": "SIEM",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Monitoring"
      }
    ]
  },
  {
    "id": "data-engineer",
    "slug": "data-engineer",
    "title": "Data Engineer",
    "domain": "Data & Analytics",
    "description": "Builds batch and real-time data pipelines, data warehouses, ETL processes, and analytical data modeling.",
    "primary_focus": "",
    "industry_demand": 9.5,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Databases"
      },
      {
        "skill_id": "spark",
        "name": "Spark",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Big Data"
      },
      {
        "skill_id": "hadoop",
        "name": "Hadoop",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Big Data"
      },
      {
        "skill_id": "kafka",
        "name": "Kafka",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Streaming"
      },
      {
        "skill_id": "databases",
        "name": "Databases",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Tools"
      }
    ]
  },
  {
    "id": "data-scientist",
    "slug": "data-scientist",
    "title": "Data Scientist",
    "domain": "Data & Analytics",
    "description": "Applies statistical modeling, exploratory data analysis, machine learning algorithms, and hypothesis testing to solve business problems.",
    "primary_focus": "",
    "industry_demand": 9.4,
    "is_anchor_role": true,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "r",
        "name": "R",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "statistics",
        "name": "Statistics",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Mathematics"
      },
      {
        "skill_id": "machine-learning",
        "name": "Machine Learning",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Core AI"
      },
      {
        "skill_id": "pandas",
        "name": "Pandas",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Data Science"
      },
      {
        "skill_id": "numpy",
        "name": "NumPy",
        "required_level": 80,
        "importance_weight": 7,
        "category": "Data Science"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "data-visualization",
        "name": "Data Visualization",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Visualization"
      }
    ]
  },
  {
    "id": "nlp-engineer",
    "slug": "nlp-engineer",
    "title": "NLP & LLM Applications Engineer",
    "domain": "AI & Machine Learning",
    "description": "Develops generative AI workflows, RAG architectures, prompt embeddings, and language understanding systems.",
    "primary_focus": "",
    "industry_demand": 9.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "machine-learning",
        "name": "Machine Learning",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Core AI"
      },
      {
        "skill_id": "deep-learning",
        "name": "Deep Learning",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Core AI"
      },
      {
        "skill_id": "nlp",
        "name": "NLP",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Core AI"
      },
      {
        "skill_id": "pytorch",
        "name": "PyTorch",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frameworks"
      },
      {
        "skill_id": "transformers",
        "name": "Transformers",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Core AI"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "computer-vision-engineer",
    "slug": "computer-vision-engineer",
    "title": "Computer Vision Engineer",
    "domain": "AI & Machine Learning",
    "description": "Constructs image processing algorithms, object detection, segmentation models, and real-time video analytics.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "opencv",
        "name": "OpenCV",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Vision"
      },
      {
        "skill_id": "machine-learning",
        "name": "Machine Learning",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Core AI"
      },
      {
        "skill_id": "deep-learning",
        "name": "Deep Learning",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Core AI"
      },
      {
        "skill_id": "pytorch",
        "name": "PyTorch",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frameworks"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      }
    ]
  },
  {
    "id": "site-reliability-engineer",
    "slug": "site-reliability-engineer",
    "title": "Site Reliability Engineer (SRE)",
    "domain": "Data & Analytics",
    "description": "Ensures high availability, fault tolerance, SLO tracking, and infrastructure scalability for large distributed systems.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 85,
        "importance_weight": 8,
        "category": "OS"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "go",
        "name": "Go",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "kubernetes",
        "name": "Kubernetes",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Orchestration"
      },
      {
        "skill_id": "docker",
        "name": "Docker",
        "required_level": 80,
        "importance_weight": 7,
        "category": "Containers"
      },
      {
        "skill_id": "monitoring",
        "name": "Monitoring",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Operations"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "mobile-ios-dev",
    "slug": "ios-developer",
    "title": "iOS App Developer",
    "domain": "Mobile & Embedded",
    "description": "Designs native iOS mobile applications using Swift, SwiftUI, Xcode, and Apple Human Interface Guidelines.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "swift",
        "name": "Swift",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Mobile"
      },
      {
        "skill_id": "ios",
        "name": "iOS",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Mobile"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 75,
        "importance_weight": 6,
        "category": "Tools"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "ui-ux",
        "name": "UI/UX",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Design"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 70,
        "importance_weight": 7,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "mobile-android-dev",
    "slug": "android-developer",
    "title": "Android App Developer",
    "domain": "Mobile & Embedded",
    "description": "Engineers native Android mobile applications using Kotlin, Android Jetpack, and Material Design components.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "kotlin",
        "name": "Kotlin",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Mobile"
      },
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "android",
        "name": "Android",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Mobile"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 75,
        "importance_weight": 6,
        "category": "Tools"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "ui-ux",
        "name": "UI/UX",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Design"
      }
    ]
  },
  {
    "id": "react-native-dev",
    "slug": "react-native-developer",
    "title": "React Native Developer",
    "domain": "Mobile & Embedded",
    "description": "Creates cross-platform iOS and Android mobile apps leveraging React Native, JavaScript/TypeScript, and native bridges.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "typescript",
        "name": "TypeScript",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "react",
        "name": "React",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Frameworks"
      },
      {
        "skill_id": "react-native",
        "name": "React Native",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Mobile"
      },
      {
        "skill_id": "mobile-development",
        "name": "Mobile Development",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mobile"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "flutter-dev",
    "slug": "flutter-developer",
    "title": "Flutter Developer",
    "domain": "Mobile & Embedded",
    "description": "Builds multi-platform desktop, mobile, and web user experiences using Dart and Flutter widget trees.",
    "primary_focus": "",
    "industry_demand": 8.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "dart",
        "name": "Dart",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "flutter",
        "name": "Flutter",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Mobile"
      },
      {
        "skill_id": "mobile-development",
        "name": "Mobile Development",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mobile"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 75,
        "importance_weight": 6,
        "category": "Tools"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "ui-ux",
        "name": "UI/UX",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Design"
      }
    ]
  },
  {
    "id": "embedded-systems-eng",
    "slug": "embedded-systems-engineer",
    "title": "Embedded Systems Engineer",
    "domain": "Mobile & Embedded",
    "description": "Develops low-level firmware, micro-controller code, real-time operating system (RTOS) drivers, and hardware interfaces.",
    "primary_focus": "",
    "industry_demand": 9.0,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Systems"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Systems"
      },
      {
        "skill_id": "embedded-c",
        "name": "Embedded C",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Systems"
      },
      {
        "skill_id": "microcontrollers",
        "name": "Microcontrollers",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Hardware"
      },
      {
        "skill_id": "rtos",
        "name": "RTOS",
        "required_level": 80,
        "importance_weight": 8,
        "category": "OS"
      },
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 75,
        "importance_weight": 7,
        "category": "OS"
      },
      {
        "skill_id": "hardware",
        "name": "Hardware",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Hardware"
      }
    ]
  },
  {
    "id": "firmware-eng",
    "slug": "firmware-engineer",
    "title": "Firmware Engineer",
    "domain": "Mobile & Embedded",
    "description": "Writes low-latency bootloaders, device drivers, SPI/I2C communication protocols, and hardware abstraction code.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Systems"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Systems"
      },
      {
        "skill_id": "assembly",
        "name": "Assembly",
        "required_level": 75,
        "importance_weight": 8,
        "category": "Systems"
      },
      {
        "skill_id": "microcontrollers",
        "name": "Microcontrollers",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Hardware"
      },
      {
        "skill_id": "electronics",
        "name": "Electronics",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Hardware"
      },
      {
        "skill_id": "debugging",
        "name": "Debugging",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Engineering"
      }
    ]
  },
  {
    "id": "vlsi-design-eng",
    "slug": "vlsi-design-engineer",
    "title": "VLSI Design Engineer",
    "domain": "Mobile & Embedded",
    "description": "Architects integrated circuits, digital logic synthesis, Verilog/VHDL models, and silicon chip verification.",
    "primary_focus": "",
    "industry_demand": 9.1,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "verilog",
        "name": "Verilog",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Hardware"
      },
      {
        "skill_id": "vhdl",
        "name": "VHDL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Hardware"
      },
      {
        "skill_id": "digital-electronics",
        "name": "Digital Electronics",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Hardware"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Systems"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Scripting"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Mathematics"
      }
    ]
  },
  {
    "id": "robotics-eng",
    "slug": "robotics-engineer",
    "title": "Robotics Engineer",
    "domain": "AI & Machine Learning",
    "description": "Integrates kinematic modeling, ROS (Robot Operating System), sensor fusion, and autonomous motion control software.",
    "primary_focus": "",
    "industry_demand": 9.2,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Systems"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "ros",
        "name": "ROS",
        "required_level": 85,
        "importance_weight": 10,
        "category": "Robotics"
      },
      {
        "skill_id": "control-systems",
        "name": "Control Systems",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Engineering"
      },
      {
        "skill_id": "kinematics",
        "name": "Kinematics",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Physics"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      }
    ]
  },
  {
    "id": "iot-developer",
    "slug": "iot-solutions-developer",
    "title": "IoT Solutions Developer",
    "domain": "Mobile & Embedded",
    "description": "Connects edge hardware telemetry, MQTT broker gateways, sensor networks, and cloud analytics platforms.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Systems"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "embedded-systems",
        "name": "Embedded Systems",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Hardware"
      },
      {
        "skill_id": "mqtt",
        "name": "MQTT",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Networking"
      },
      {
        "skill_id": "aws-iot",
        "name": "AWS IoT",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Cloud"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "blockchain-dev",
    "slug": "blockchain-developer",
    "title": "Blockchain Developer",
    "domain": "AI & Machine Learning",
    "description": "Constructs decentralized ledgers, cryptographic protocols, peer-to-peer node architectures, and Web3 apps.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "solidity",
        "name": "Solidity",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Blockchain"
      },
      {
        "skill_id": "rust",
        "name": "Rust",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Systems"
      },
      {
        "skill_id": "go",
        "name": "Go",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Backend"
      },
      {
        "skill_id": "cryptography",
        "name": "Cryptography",
        "required_level": 80,
        "importance_weight": 9,
        "category": "Security"
      },
      {
        "skill_id": "node-js",
        "name": "Node.js",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Backend"
      },
      {
        "skill_id": "web3",
        "name": "Web3",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Blockchain"
      }
    ]
  },
  {
    "id": "smart-contract-dev",
    "slug": "smart-contract-developer",
    "title": "Smart Contract Developer",
    "domain": "Software Engineering",
    "description": "Engineers audit-proof EVM smart contracts, DeFi tokenomics protocols, and decentralized governance contracts.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "solidity",
        "name": "Solidity",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Blockchain"
      },
      {
        "skill_id": "ethereum",
        "name": "Ethereum",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Blockchain"
      },
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Auditing"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Tools"
      },
      {
        "skill_id": "web3",
        "name": "Web3",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Blockchain"
      }
    ]
  },
  {
    "id": "unity-game-dev",
    "slug": "unity-game-developer",
    "title": "Unity Game Developer",
    "domain": "Gaming & Graphics",
    "description": "Engineers 2D/3D gameplay mechanics, C# scripts, physics simulation, component systems, and asset optimization.",
    "primary_focus": "",
    "industry_demand": 8.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C#",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "unity",
        "name": "Unity",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Game Engine"
      },
      {
        "skill_id": "3d-math",
        "name": "3D Math",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "physics-engine",
        "name": "Physics Engine",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Game Mechanics"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Tools"
      }
    ]
  },
  {
    "id": "unreal-game-dev",
    "slug": "unreal-engine-developer",
    "title": "Unreal Engine Developer",
    "domain": "Gaming & Graphics",
    "description": "Develops high-fidelity AAA graphics, C++ gameplay code, Blueprints, custom shaders, and spatial rendering.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "unreal-engine",
        "name": "Unreal Engine",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Game Engine"
      },
      {
        "skill_id": "3d-math",
        "name": "3D Math",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "shaders",
        "name": "Shaders",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Graphics"
      },
      {
        "skill_id": "graphics-programming",
        "name": "Graphics Programming",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Graphics"
      }
    ]
  },
  {
    "id": "ar-vr-developer",
    "slug": "ar-vr-developer",
    "title": "AR/VR Developer",
    "domain": "Gaming & Graphics",
    "description": "Builds immersive spatial computing applications, Unity/Unreal XR interactions, and head-mounted display interfaces.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C#",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "unity",
        "name": "Unity",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Engine"
      },
      {
        "skill_id": "ar-vr",
        "name": "AR/VR",
        "required_level": 85,
        "importance_weight": 10,
        "category": "XR"
      },
      {
        "skill_id": "computer-vision",
        "name": "Computer Vision",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Vision"
      },
      {
        "skill_id": "3d-math",
        "name": "3D Math",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      }
    ]
  },
  {
    "id": "product-manager-tech",
    "slug": "technical-product-manager",
    "title": "Technical Product Manager",
    "domain": "Software Engineering",
    "description": "Translates customer demands into technical product roadmaps, sprint backlogs, feature specs, and market strategy.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "product-management",
        "name": "Product Management",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Product"
      },
      {
        "skill_id": "agile",
        "name": "Agile",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Process"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Engineering"
      },
      {
        "skill_id": "data-analytics",
        "name": "Data Analytics",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Analytics"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Soft Skills"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Data"
      }
    ]
  },
  {
    "id": "technical-program-mgr",
    "slug": "technical-program-manager",
    "title": "Technical Program Manager (TPM)",
    "domain": "Software Engineering",
    "description": "Drives cross-functional engineering deliverables, risk mitigation schedules, resource allocation, and milestone execution.",
    "primary_focus": "",
    "industry_demand": 9.1,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "program-management",
        "name": "Program Management",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Management"
      },
      {
        "skill_id": "agile",
        "name": "Agile",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Process"
      },
      {
        "skill_id": "scrum",
        "name": "Scrum",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Process"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Architecture"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Soft Skills"
      }
    ]
  },
  {
    "id": "engineering-manager",
    "slug": "engineering-manager",
    "title": "Engineering Manager",
    "domain": "Software Engineering",
    "description": "Leads software engineering teams, oversees technical architecture decisions, performance reviews, and team scaling.",
    "primary_focus": "",
    "industry_demand": 9.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "leadership",
        "name": "Leadership",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Management"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Architecture"
      },
      {
        "skill_id": "software-architecture",
        "name": "Software Architecture",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Architecture"
      },
      {
        "skill_id": "agile",
        "name": "Agile",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Process"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Soft Skills"
      }
    ]
  },
  {
    "id": "ux-designer",
    "slug": "ux-designer",
    "title": "UX Designer",
    "domain": "Software Engineering",
    "description": "Conducts user research, wireframing, interaction design, information architecture, and user journey optimization.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "figma",
        "name": "Figma",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Design Tools"
      },
      {
        "skill_id": "ui-ux",
        "name": "UI/UX",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Design"
      },
      {
        "skill_id": "wireframing",
        "name": "Wireframing",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Design"
      },
      {
        "skill_id": "user-research",
        "name": "User Research",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Research"
      },
      {
        "skill_id": "prototyping",
        "name": "Prototyping",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Design"
      },
      {
        "skill_id": "html-css",
        "name": "HTML/CSS",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Frontend"
      }
    ]
  },
  {
    "id": "ui-designer",
    "slug": "ui-designer",
    "title": "UI Designer",
    "domain": "Software Engineering",
    "description": "Crafts pixel-perfect visual components, design tokens, typography scale, color palettes, and component design systems.",
    "primary_focus": "",
    "industry_demand": 8.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "figma",
        "name": "Figma",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Design Tools"
      },
      {
        "skill_id": "ui-ux",
        "name": "UI/UX",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Design"
      },
      {
        "skill_id": "design-systems",
        "name": "Design Systems",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Design"
      },
      {
        "skill_id": "graphic-design",
        "name": "Graphic Design",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Visual"
      },
      {
        "skill_id": "html-css",
        "name": "HTML/CSS",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Frontend"
      }
    ]
  },
  {
    "id": "database-administrator",
    "slug": "database-administrator",
    "title": "Database Administrator (DBA)",
    "domain": "Data & Analytics",
    "description": "Manages database indexing, transaction logs, backup recovery strategies, performance tuning, and schema migration.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Databases"
      },
      {
        "skill_id": "postgresql",
        "name": "PostgreSQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "mysql",
        "name": "MySQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "oracle",
        "name": "Oracle",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Enterprise DB"
      },
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 80,
        "importance_weight": 8,
        "category": "OS"
      },
      {
        "skill_id": "database-tuning",
        "name": "Database Tuning",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Databases"
      }
    ]
  },
  {
    "id": "bi-developer",
    "slug": "business-intelligence-developer",
    "title": "BI & Data Visualization Developer",
    "domain": "Data & Analytics",
    "description": "Builds automated enterprise data warehouses, ETL pipelines, Power BI dashboards, and Tableau visual telemetry.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Databases"
      },
      {
        "skill_id": "power-bi",
        "name": "Power BI",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Visualization"
      },
      {
        "skill_id": "tableau",
        "name": "Tableau",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Visualization"
      },
      {
        "skill_id": "etl",
        "name": "ETL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Data Pipeline"
      },
      {
        "skill_id": "data-modeling",
        "name": "Data Modeling",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Data"
      },
      {
        "skill_id": "excel",
        "name": "Excel",
        "required_level": 75,
        "importance_weight": 6,
        "category": "Analysis"
      }
    ]
  },
  {
    "id": "mlops-engineer",
    "slug": "mlops-engineer",
    "title": "MLOps & AI Infrastructure Engineer",
    "domain": "AI & Machine Learning",
    "description": "Automates model CI/CD pipelines, feature stores, model drift telemetry, and scalable inference deployment.",
    "primary_focus": "",
    "industry_demand": 9.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "docker",
        "name": "Docker",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Containers"
      },
      {
        "skill_id": "kubernetes",
        "name": "Kubernetes",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Orchestration"
      },
      {
        "skill_id": "mlflow",
        "name": "MLflow",
        "required_level": 80,
        "importance_weight": 8,
        "category": "MLOps"
      },
      {
        "skill_id": "kubeflow",
        "name": "Kubeflow",
        "required_level": 75,
        "importance_weight": 7,
        "category": "MLOps"
      },
      {
        "skill_id": "machine-learning",
        "name": "Machine Learning",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Core AI"
      },
      {
        "skill_id": "aws",
        "name": "AWS",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Cloud"
      }
    ]
  },
  {
    "id": "ai-research-scientist",
    "slug": "ai-research-scientist",
    "title": "AI Research Scientist",
    "domain": "AI & Machine Learning",
    "description": "Publishes foundational AI research, novel deep learning architectures, mathematical proofs, and model breakthroughs.",
    "primary_focus": "",
    "industry_demand": 9.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "pytorch",
        "name": "PyTorch",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Frameworks"
      },
      {
        "skill_id": "machine-learning",
        "name": "Machine Learning",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Core AI"
      },
      {
        "skill_id": "deep-learning",
        "name": "Deep Learning",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Core AI"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Mathematics"
      },
      {
        "skill_id": "calculus",
        "name": "Calculus",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "statistics",
        "name": "Statistics",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Mathematics"
      }
    ]
  },
  {
    "id": "generative-ai-eng",
    "slug": "generative-ai-engineer",
    "title": "Generative AI Engineer",
    "domain": "AI & Machine Learning",
    "description": "Engineers LLM agents, vector database retrieval, prompt routing, diffusion models, and AI workflow integration.",
    "primary_focus": "",
    "industry_demand": 9.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "transformers",
        "name": "Transformers",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Core AI"
      },
      {
        "skill_id": "pytorch",
        "name": "PyTorch",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frameworks"
      },
      {
        "skill_id": "langchain",
        "name": "LangChain",
        "required_level": 85,
        "importance_weight": 9,
        "category": "GenAI"
      },
      {
        "skill_id": "vector-dbs",
        "name": "Vector DBs",
        "required_level": 85,
        "importance_weight": 9,
        "category": "GenAI"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "prompt-engineer",
    "slug": "prompt-engineer",
    "title": "Prompt Engineer & LLM Specialist",
    "domain": "AI & Machine Learning",
    "description": "Optimizes instruction tuning, context window structuring, few-shot prompting, and model evaluation metrics.",
    "primary_focus": "",
    "industry_demand": 8.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "prompt-engineering",
        "name": "Prompt Engineering",
        "required_level": 90,
        "importance_weight": 10,
        "category": "GenAI"
      },
      {
        "skill_id": "llms",
        "name": "LLMs",
        "required_level": 85,
        "importance_weight": 9,
        "category": "GenAI"
      },
      {
        "skill_id": "nlp",
        "name": "NLP",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Core AI"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Soft Skills"
      },
      {
        "skill_id": "json",
        "name": "JSON",
        "required_level": 80,
        "importance_weight": 7,
        "category": "Data"
      }
    ]
  },
  {
    "id": "network-engineer",
    "slug": "network-engineer",
    "title": "Network Infrastructure Engineer",
    "domain": "Cloud & DevOps",
    "description": "Configures routing protocols (BGP/OSPF), VPN gateways, switches, firewalls, and enterprise SDN architectures.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "networking",
        "name": "Networking",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Infrastructure"
      },
      {
        "skill_id": "cisco",
        "name": "Cisco",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Networking"
      },
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 80,
        "importance_weight": 8,
        "category": "OS"
      },
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Security"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Scripting"
      },
      {
        "skill_id": "wireshark",
        "name": "Wireshark",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Tools"
      }
    ]
  },
  {
    "id": "penetration-tester",
    "slug": "penetration-tester",
    "title": "Penetration Tester / Ethical Hacker",
    "domain": "Cybersecurity",
    "description": "Executes offensive red team exploits, web application vulnerability testing, payload injection, and security audits.",
    "primary_focus": "",
    "industry_demand": 9.2,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Cybersecurity"
      },
      {
        "skill_id": "penetration-testing",
        "name": "Penetration Testing",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Security"
      },
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 85,
        "importance_weight": 8,
        "category": "OS"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Scripting"
      },
      {
        "skill_id": "networking",
        "name": "Networking",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Infrastructure"
      },
      {
        "skill_id": "metasploit",
        "name": "Metasploit",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Tools"
      },
      {
        "skill_id": "web-security",
        "name": "Web Security",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Security"
      }
    ]
  },
  {
    "id": "soc-analyst",
    "slug": "soc-analyst",
    "title": "SOC Security Analyst",
    "domain": "Cybersecurity",
    "description": "Analyzes real-time threat telemetry, incident responses, malware artifacts, and SIEM alert monitoring.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Cybersecurity"
      },
      {
        "skill_id": "siem",
        "name": "SIEM",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Monitoring"
      },
      {
        "skill_id": "networking",
        "name": "Networking",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Infrastructure"
      },
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 75,
        "importance_weight": 7,
        "category": "OS"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Scripting"
      },
      {
        "skill_id": "incident-response",
        "name": "Incident Response",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Security"
      }
    ]
  },
  {
    "id": "solutions-architect",
    "slug": "solutions-architect",
    "title": "Solutions Architect",
    "domain": "Cloud & DevOps",
    "description": "Translates enterprise client specifications into end-to-end technical blueprints, integration middleware, and cloud systems.",
    "primary_focus": "",
    "industry_demand": 9.4,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Architecture"
      },
      {
        "skill_id": "cloud",
        "name": "Cloud",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Cloud"
      },
      {
        "skill_id": "software-architecture",
        "name": "Software Architecture",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Architecture"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Security"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Soft Skills"
      }
    ]
  },
  {
    "id": "qa-automation-eng",
    "slug": "qa-automation-engineer",
    "title": "QA Automation Engineer",
    "domain": "Software Engineering",
    "description": "Engineers end-to-end automated test suites using Selenium, Cypress, Playwright, PyTest, and CI integration.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "selenium",
        "name": "Selenium",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Testing"
      },
      {
        "skill_id": "cypress",
        "name": "Cypress",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Testing"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 75,
        "importance_weight": 6,
        "category": "Tools"
      },
      {
        "skill_id": "ci-cd",
        "name": "CI/CD",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Automation"
      },
      {
        "skill_id": "qa-testing",
        "name": "QA Testing",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Testing"
      }
    ]
  },
  {
    "id": "salesforce-dev",
    "slug": "salesforce-developer",
    "title": "Salesforce Developer",
    "domain": "Software Engineering",
    "description": "Develops Apex code, Lightning Web Components (LWC), Salesforce SOQL queries, and CRM workflow automation.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "salesforce",
        "name": "Salesforce",
        "required_level": 90,
        "importance_weight": 10,
        "category": "CRM"
      },
      {
        "skill_id": "apex",
        "name": "Apex",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "html-css",
        "name": "HTML/CSS",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Frontend"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Databases"
      },
      {
        "skill_id": "crm",
        "name": "CRM",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Enterprise"
      }
    ]
  },
  {
    "id": "sap-developer",
    "slug": "sap-abap-developer",
    "title": "SAP ABAP Developer",
    "domain": "Software Engineering",
    "description": "Customizes SAP ERP business logic, ABAP programming, SAP S/4HANA migrations, and enterprise module workflows.",
    "primary_focus": "",
    "industry_demand": 8.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "sap",
        "name": "SAP",
        "required_level": 90,
        "importance_weight": 10,
        "category": "ERP"
      },
      {
        "skill_id": "abap",
        "name": "ABAP",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "erp",
        "name": "ERP",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Enterprise"
      },
      {
        "skill_id": "business-processes",
        "name": "Business Processes",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Domain"
      }
    ]
  },
  {
    "id": "rust-systems-dev",
    "slug": "rust-systems-developer",
    "title": "Rust Systems Developer",
    "domain": "Software Engineering",
    "description": "Engineers memory-safe, zero-cost abstraction systems code, high-throughput microservices, and compiler tooling.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "rust",
        "name": "Rust",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Systems"
      },
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 80,
        "importance_weight": 8,
        "category": "OS"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "concurrency",
        "name": "Concurrency",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Systems"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 75,
        "importance_weight": 6,
        "category": "Tools"
      }
    ]
  },
  {
    "id": "golang-dev",
    "slug": "golang-developer",
    "title": "Go (Golang) Backend Engineer",
    "domain": "Software Engineering",
    "description": "Builds high-concurrency cloud-native microservices, goroutine worker pools, gRPC APIs, and distributed systems.",
    "primary_focus": "",
    "industry_demand": 9.4,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "go",
        "name": "Go",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "docker",
        "name": "Docker",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Containers"
      },
      {
        "skill_id": "kubernetes",
        "name": "Kubernetes",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Orchestration"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Architecture"
      },
      {
        "skill_id": "grpc",
        "name": "gRPC",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      }
    ]
  },
  {
    "id": "quantitative-analyst",
    "slug": "quantitative-analyst",
    "title": "Quantitative Analyst (Quant)",
    "domain": "Data & Analytics",
    "description": "Develops algorithmic trading strategies, risk modeling software, and statistical arbitrage engines.",
    "primary_focus": "",
    "industry_demand": 9.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "statistics",
        "name": "Statistics",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Mathematics"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Mathematics"
      },
      {
        "skill_id": "stochastic-calculus",
        "name": "Stochastic Calculus",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "machine-learning",
        "name": "Machine Learning",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Core AI"
      },
      {
        "skill_id": "financial-modeling",
        "name": "Financial Modeling",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Finance"
      }
    ]
  },
  {
    "id": "gis-developer",
    "slug": "geospatial-gis-developer",
    "title": "Geospatial & GIS Developer",
    "domain": "Software Engineering",
    "description": "Builds spatial mapping engines, GeoJSON processing, PostGIS databases, and satellite imagery mapping platforms.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frontend"
      },
      {
        "skill_id": "postgis",
        "name": "PostGIS",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "gis",
        "name": "GIS",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Spatial"
      },
      {
        "skill_id": "data-visualization",
        "name": "Data Visualization",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Visualization"
      }
    ]
  },
  {
    "id": "autonomous-vehicle-eng",
    "slug": "autonomous-vehicle-engineer",
    "title": "Autonomous Vehicle Software Engineer",
    "domain": "Software Engineering",
    "description": "Engineers self-driving perception, sensor fusion (LIDAR/Radar), trajectory planning, and safety software.",
    "primary_focus": "",
    "industry_demand": 9.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Systems"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "ros",
        "name": "ROS",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Robotics"
      },
      {
        "skill_id": "computer-vision",
        "name": "Computer Vision",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Vision"
      },
      {
        "skill_id": "deep-learning",
        "name": "Deep Learning",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Core AI"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Mathematics"
      },
      {
        "skill_id": "sensor-fusion",
        "name": "Sensor Fusion",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Engineering"
      }
    ]
  },
  {
    "id": "hpc-engineer",
    "slug": "hpc-engineer",
    "title": "HPC (High Performance Computing) Engineer",
    "domain": "Cloud & DevOps",
    "description": "Optimizes parallel MPI/OpenMP algorithms, GPU CUDA kernels, supercomputing clusters, and memory throughput.",
    "primary_focus": "",
    "industry_demand": 9.4,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Systems"
      },
      {
        "skill_id": "c",
        "name": "C",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Systems"
      },
      {
        "skill_id": "cuda",
        "name": "CUDA",
        "required_level": 90,
        "importance_weight": 10,
        "category": "GPU"
      },
      {
        "skill_id": "mpi",
        "name": "MPI",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Parallel Computing"
      },
      {
        "skill_id": "linux",
        "name": "Linux",
        "required_level": 85,
        "importance_weight": 8,
        "category": "OS"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Scripting"
      }
    ]
  },
  {
    "id": "cloud-security-eng",
    "slug": "cloud-security-engineer",
    "title": "Cloud Security Engineer",
    "domain": "Cloud & DevOps",
    "description": "Enforces IAM policies, infrastructure-as-code security scans, KMS encryption keys, and cloud compliance auditing.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Security"
      },
      {
        "skill_id": "aws",
        "name": "AWS",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Cloud"
      },
      {
        "skill_id": "terraform",
        "name": "Terraform",
        "required_level": 80,
        "importance_weight": 8,
        "category": "IaC"
      },
      {
        "skill_id": "docker",
        "name": "Docker",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Containers"
      },
      {
        "skill_id": "kubernetes",
        "name": "Kubernetes",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Orchestration"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Scripting"
      }
    ]
  },
  {
    "id": "api-gateway-eng",
    "slug": "api-gateway-engineer",
    "title": "API Gateway & Integration Engineer",
    "domain": "Cloud & DevOps",
    "description": "Designs enterprise REST/gRPC API contracts, rate limiting, OAuth authentication flows, and API proxies.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Architecture"
      },
      {
        "skill_id": "graphql",
        "name": "GraphQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "node-js",
        "name": "Node.js",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Backend"
      },
      {
        "skill_id": "go",
        "name": "Go",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Backend"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Security"
      }
    ]
  },
  {
    "id": "microservices-architect",
    "slug": "microservices-architect",
    "title": "Microservices Architect",
    "domain": "Cloud & DevOps",
    "description": "Decomposes monolithic codebases into domain-driven microservices, event buses, and distributed saga transactions.",
    "primary_focus": "",
    "industry_demand": 9.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Architecture"
      },
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Backend"
      },
      {
        "skill_id": "go",
        "name": "Go",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Backend"
      },
      {
        "skill_id": "kafka",
        "name": "Kafka",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Streaming"
      },
      {
        "skill_id": "docker",
        "name": "Docker",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Containers"
      },
      {
        "skill_id": "kubernetes",
        "name": "Kubernetes",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Orchestration"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "technical-writer",
    "slug": "technical-writer",
    "title": "Technical Writer & API Documentarian",
    "domain": "Software Engineering",
    "description": "Produces comprehensive API documentation, SDK quickstarts, developer portals, and architectural guides.",
    "primary_focus": "",
    "industry_demand": 8.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "technical-writing",
        "name": "Technical Writing",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Documentation"
      },
      {
        "skill_id": "markdown",
        "name": "Markdown",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Tools"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Tools"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Knowledge"
      },
      {
        "skill_id": "html-css",
        "name": "HTML/CSS",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Core Web"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Soft Skills"
      }
    ]
  },
  {
    "id": "scrum-master",
    "slug": "scrum-master-agile-coach",
    "title": "Scrum Master & Agile Coach",
    "domain": "Software Engineering",
    "description": "Facilitates sprint planning, daily standups, retrospectives, velocity metrics, and removal of engineering blockers.",
    "primary_focus": "",
    "industry_demand": 8.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "scrum",
        "name": "Scrum",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Process"
      },
      {
        "skill_id": "agile",
        "name": "Agile",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Process"
      },
      {
        "skill_id": "jira",
        "name": "JIRA",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Tools"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Soft Skills"
      },
      {
        "skill_id": "leadership",
        "name": "Leadership",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Management"
      }
    ]
  },
  {
    "id": "rpa-developer",
    "slug": "rpa-developer",
    "title": "RPA (Robotic Process Automation) Developer",
    "domain": "Software Engineering",
    "description": "Automates repetitive enterprise business workflows using UiPath, Automation Anywhere, and Python automation scripts.",
    "primary_focus": "",
    "industry_demand": 8.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "uipath",
        "name": "UiPath",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Automation"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Scripting"
      },
      {
        "skill_id": "c",
        "name": "C#",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Databases"
      },
      {
        "skill_id": "process-automation",
        "name": "Process Automation",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Automation"
      }
    ]
  },
  {
    "id": "fintech-developer",
    "slug": "fintech-software-engineer",
    "title": "FinTech Software Engineer",
    "domain": "Software Engineering",
    "description": "Engineers PCI-compliant payment gateways, core banking ledgers, fraud detection algorithms, and real-time settlements.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Backend"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Security"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "edtech-developer",
    "slug": "edtech-software-engineer",
    "title": "EdTech Platform Engineer",
    "domain": "Software Engineering",
    "description": "Develops interactive learning management systems, gamified skill assessments, and video streaming classrooms.",
    "primary_focus": "",
    "industry_demand": 8.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Frontend"
      },
      {
        "skill_id": "react",
        "name": "React",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frontend"
      },
      {
        "skill_id": "node-js",
        "name": "Node.js",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Backend"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Backend"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Databases"
      },
      {
        "skill_id": "ui-ux",
        "name": "UI/UX",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Design"
      }
    ]
  },
  {
    "id": "health-informatics-spec",
    "slug": "health-informatics-specialist",
    "title": "Health Informatics Software Specialist",
    "domain": "Software Engineering",
    "description": "Builds HL7/FHIR compliant electronic health record (EHR) integrations, HIPAA data pipelines, and medical analytics.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "healthcare-data",
        "name": "Healthcare Data",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Domain"
      },
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Security"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "ecommerce-developer",
    "slug": "e-commerce-developer",
    "title": "E-Commerce Software Engineer",
    "domain": "Software Engineering",
    "description": "Constructs online storefront checkout funnels, inventory sync engines, Stripe payment integrations, and cart state.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Frontend"
      },
      {
        "skill_id": "react",
        "name": "React",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frontend"
      },
      {
        "skill_id": "node-js",
        "name": "Node.js",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Backend"
      },
      {
        "skill_id": "php",
        "name": "PHP",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Backend"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "shopify-developer",
    "slug": "shopify-developer",
    "title": "Shopify Liquid Developer",
    "domain": "Software Engineering",
    "description": "Develops custom Shopify themes, Liquid templates, GraphQL Admin APIs, and custom storefront apps.",
    "primary_focus": "",
    "industry_demand": 8.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "liquid",
        "name": "Liquid",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Shopify"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Frontend"
      },
      {
        "skill_id": "html-css",
        "name": "HTML/CSS",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Frontend"
      },
      {
        "skill_id": "graphql",
        "name": "GraphQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "APIs"
      },
      {
        "skill_id": "shopify-api",
        "name": "Shopify API",
        "required_level": 85,
        "importance_weight": 9,
        "category": "E-commerce"
      }
    ]
  },
  {
    "id": "wordpress-developer",
    "slug": "wordpress-developer",
    "title": "WordPress & PHP Engineer",
    "domain": "Software Engineering",
    "description": "Engineers custom PHP plugins, headless WordPress React frontends, WooCommerce extensions, and MySQL queries.",
    "primary_focus": "",
    "industry_demand": 8.2,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "php",
        "name": "PHP",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Backend"
      },
      {
        "skill_id": "wordpress",
        "name": "WordPress",
        "required_level": 90,
        "importance_weight": 10,
        "category": "CMS"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Frontend"
      },
      {
        "skill_id": "html-css",
        "name": "HTML/CSS",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frontend"
      },
      {
        "skill_id": "mysql",
        "name": "MySQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      }
    ]
  },
  {
    "id": "csharp-dotnet-dev",
    "slug": "csharp-dotnet-developer",
    "title": "C# .NET Enterprise Developer",
    "domain": "Software Engineering",
    "description": "Builds enterprise Web APIs, Entity Framework ORM access layers, Azure microservices, and ASP.NET Core apps.",
    "primary_focus": "",
    "industry_demand": 9.0,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C#",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "net",
        "name": ".NET",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Frameworks"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "azure",
        "name": "Azure",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Cloud"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "scala-developer",
    "slug": "scala-big-data-developer",
    "title": "Scala & Spark Big Data Developer",
    "domain": "Data & Analytics",
    "description": "Engineers functional Scala pipelines, Apache Spark distributed jobs, Akka actor systems, and stream processing.",
    "primary_focus": "",
    "industry_demand": 9.1,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "scala",
        "name": "Scala",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "spark",
        "name": "Spark",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Big Data"
      },
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "functional-programming",
        "name": "Functional Programming",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Paradigms"
      }
    ]
  },
  {
    "id": "matlab-engineer",
    "slug": "matlab-simulation-engineer",
    "title": "MATLAB & Simulink Simulation Engineer",
    "domain": "Software Engineering",
    "description": "Develops mathematical control models, signal processing algorithms, physical system simulations, and auto-generated C code.",
    "primary_focus": "",
    "industry_demand": 8.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "matlab",
        "name": "MATLAB",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Simulation"
      },
      {
        "skill_id": "simulink",
        "name": "Simulink",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Simulation"
      },
      {
        "skill_id": "control-systems",
        "name": "Control Systems",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Engineering"
      },
      {
        "skill_id": "signal-processing",
        "name": "Signal Processing",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Engineering"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Systems"
      }
    ]
  },
  {
    "id": "cad-cam-developer",
    "slug": "cad-cam-software-developer",
    "title": "CAD/CAM Software Developer",
    "domain": "Software Engineering",
    "description": "Engineers 3D geometric modeling kernel software, mesh generation algorithms, and CNC toolpath generation.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "3d-math",
        "name": "3D Math",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Mathematics"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "opengl",
        "name": "OpenGL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Graphics"
      },
      {
        "skill_id": "computational-geometry",
        "name": "Computational Geometry",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Algorithms"
      }
    ]
  },
  {
    "id": "biomedical-software-eng",
    "slug": "biomedical-software-engineer",
    "title": "Biomedical Software Engineer",
    "domain": "Data & Analytics",
    "description": "Develops medical device software, signal filter algorithms for ECG/EEG, and FDA-compliant firmware.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Systems"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "signal-processing",
        "name": "Signal Processing",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Engineering"
      },
      {
        "skill_id": "matlab",
        "name": "Matlab",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Analysis"
      },
      {
        "skill_id": "medical-regulations",
        "name": "Medical Regulations",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Domain"
      }
    ]
  },
  {
    "id": "drone-software-dev",
    "slug": "drone-software-developer",
    "title": "Drone Autopilot & Avionics Developer",
    "domain": "Mobile & Embedded",
    "description": "Builds PX4/ArduPilot flight controllers, autonomous pathfinding, obstacle avoidance, and telemetry link code.",
    "primary_focus": "",
    "industry_demand": 9.1,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Systems"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      },
      {
        "skill_id": "ros",
        "name": "ROS",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Robotics"
      },
      {
        "skill_id": "control-systems",
        "name": "Control Systems",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Engineering"
      },
      {
        "skill_id": "embedded-systems",
        "name": "Embedded Systems",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Hardware"
      },
      {
        "skill_id": "sensor-fusion",
        "name": "Sensor Fusion",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Engineering"
      }
    ]
  },
  {
    "id": "computer-graphics-eng",
    "slug": "computer-graphics-engineer",
    "title": "Computer Graphics & Rendering Engineer",
    "domain": "Gaming & Graphics",
    "description": "Engineers ray tracing, rasterization pipelines, Vulkan/DirectX render engines, and PBR material shaders.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "opengl",
        "name": "OpenGL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Graphics"
      },
      {
        "skill_id": "vulkan",
        "name": "Vulkan",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Graphics"
      },
      {
        "skill_id": "shaders",
        "name": "Shaders",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Graphics"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "3d-math",
        "name": "3D Math",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Mathematics"
      }
    ]
  },
  {
    "id": "shader-gpu-programmer",
    "slug": "shader-gpu-programmer",
    "title": "Shader & GPU Computing Programmer",
    "domain": "Gaming & Graphics",
    "description": "Writes HLSL/GLSL pixel shaders, compute shaders for physics, and GPU memory alignment routines.",
    "primary_focus": "",
    "industry_demand": 9.2,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "glsl",
        "name": "GLSL",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Graphics"
      },
      {
        "skill_id": "hlsl",
        "name": "HLSL",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Graphics"
      },
      {
        "skill_id": "cuda",
        "name": "CUDA",
        "required_level": 80,
        "importance_weight": 8,
        "category": "GPU"
      },
      {
        "skill_id": "graphics-programming",
        "name": "Graphics Programming",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Graphics"
      },
      {
        "skill_id": "3d-math",
        "name": "3D Math",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      }
    ]
  },
  {
    "id": "etl-developer",
    "slug": "etl-data-pipeline-developer",
    "title": "ETL & Data Pipeline Developer",
    "domain": "Data & Analytics",
    "description": "Architects enterprise data extraction, transformation, loading routines, and data staging schemas.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Databases"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Scripting"
      },
      {
        "skill_id": "etl",
        "name": "ETL",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Data"
      },
      {
        "skill_id": "data-warehousing",
        "name": "Data Warehousing",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "databases",
        "name": "Databases",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Databases"
      }
    ]
  },
  {
    "id": "search-engineer",
    "slug": "search-engine-developer",
    "title": "Search Engineer (Elasticsearch/Solr)",
    "domain": "Software Engineering",
    "description": "Engineers inverted indexes, BM25 relevance scoring, vector search embeddings, and distributed cluster search.",
    "primary_focus": "",
    "industry_demand": 9.0,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "elasticsearch",
        "name": "Elasticsearch",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Search Engine"
      },
      {
        "skill_id": "lucene",
        "name": "Lucene",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Search Engine"
      },
      {
        "skill_id": "vector-dbs",
        "name": "Vector DBs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "GenAI"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "iam-security-engineer",
    "slug": "iam-security-engineer",
    "title": "Identity & Access Management (IAM) Engineer",
    "domain": "Cybersecurity",
    "description": "Configures OAuth2, SAML single sign-on, Okta integrations, Zero Trust policies, and RBAC permissions.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "security",
        "name": "Security",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Security"
      },
      {
        "skill_id": "iam",
        "name": "IAM",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Security"
      },
      {
        "skill_id": "oauth",
        "name": "OAuth",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Security"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Scripting"
      },
      {
        "skill_id": "cloud-security",
        "name": "Cloud Security",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Cloud"
      }
    ]
  },
  {
    "id": "low-code-developer",
    "slug": "low-code-no-code-developer",
    "title": "Low-Code / Power Platform Developer",
    "domain": "Software Engineering",
    "description": "Builds rapid business apps, automated workflows, and connector integrations using Microsoft Power Platform.",
    "primary_focus": "",
    "industry_demand": 8.4,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "power-platform",
        "name": "Power Platform",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Low-Code"
      },
      {
        "skill_id": "power-automate",
        "name": "Power Automate",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Automation"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Databases"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Frontend"
      },
      {
        "skill_id": "business-automation",
        "name": "Business Automation",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Workflow"
      }
    ]
  },
  {
    "id": "chatbot-developer",
    "slug": "conversational-ai-chatbot-developer",
    "title": "Conversational AI & Chatbot Developer",
    "domain": "AI & Machine Learning",
    "description": "Engineers dialog trees, intent classification engines, Twilio/WhatsApp webhook bots, and LLM agent flows.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "node-js",
        "name": "Node.js",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Backend"
      },
      {
        "skill_id": "nlp",
        "name": "NLP",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Core AI"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "llms",
        "name": "LLMs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "GenAI"
      }
    ]
  },
  {
    "id": "seo-technical-analyst",
    "slug": "technical-seo-analyst",
    "title": "Technical SEO & Performance Analyst",
    "domain": "Software Engineering",
    "description": "Optimizes web crawlability, Core Web Vitals performance, structured schema markup, and sitemaps.",
    "primary_focus": "",
    "industry_demand": 8.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "html-css",
        "name": "HTML/CSS",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Frontend"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frontend"
      },
      {
        "skill_id": "seo",
        "name": "SEO",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Analytics"
      },
      {
        "skill_id": "google-analytics",
        "name": "Google Analytics",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Analytics"
      },
      {
        "skill_id": "web-vitals",
        "name": "Web Vitals",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Performance"
      }
    ]
  },
  {
    "id": "growth-hacker-analyst",
    "slug": "growth-engineering-analyst",
    "title": "Growth Hacker & Data Product Analyst",
    "domain": "Data & Analytics",
    "description": "Executes A/B testing experiments, viral product loops, conversion funnel analysis, and retention metrics.",
    "primary_focus": "",
    "industry_demand": 8.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Data Science"
      },
      {
        "skill_id": "google-analytics",
        "name": "Google Analytics",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Analytics"
      },
      {
        "skill_id": "a-b-testing",
        "name": "A/B Testing",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Experimentation"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Soft Skills"
      }
    ]
  },
  {
    "id": "magento-developer",
    "slug": "magento-adobe-commerce-developer",
    "title": "Magento (Adobe Commerce) Developer",
    "domain": "Software Engineering",
    "description": "Engineers Magento PHP modules, MySQL query optimization, custom themes, and GraphQL APIs.",
    "primary_focus": "",
    "industry_demand": 8.4,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "php",
        "name": "PHP",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Backend"
      },
      {
        "skill_id": "magento",
        "name": "Magento",
        "required_level": 90,
        "importance_weight": 10,
        "category": "E-commerce"
      },
      {
        "skill_id": "mysql",
        "name": "MySQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Frontend"
      },
      {
        "skill_id": "html-css",
        "name": "HTML/CSS",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Frontend"
      }
    ]
  },
  {
    "id": "php-laravel-dev",
    "slug": "php-laravel-developer",
    "title": "PHP & Laravel Backend Developer",
    "domain": "Software Engineering",
    "description": "Constructs REST APIs, Eloquent ORM relationships, Blade templates, and Queue worker systems in Laravel.",
    "primary_focus": "",
    "industry_demand": 8.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "php",
        "name": "PHP",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "laravel",
        "name": "Laravel",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Frameworks"
      },
      {
        "skill_id": "mysql",
        "name": "MySQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 75,
        "importance_weight": 6,
        "category": "Tools"
      }
    ]
  },
  {
    "id": "ruby-rails-dev",
    "slug": "ruby-on-rails-developer",
    "title": "Ruby on Rails Developer",
    "domain": "AI & Machine Learning",
    "description": "Develops convention-over-configuration web apps, Active Record migrations, RSpec test suites, and Sidekiq workers.",
    "primary_focus": "",
    "industry_demand": 8.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "ruby",
        "name": "Ruby",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "ruby-on-rails",
        "name": "Ruby on Rails",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Frameworks"
      },
      {
        "skill_id": "postgresql",
        "name": "PostgreSQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "git",
        "name": "Git",
        "required_level": 75,
        "importance_weight": 6,
        "category": "Tools"
      }
    ]
  },
  {
    "id": "kotlin-backend-dev",
    "slug": "kotlin-backend-developer",
    "title": "Kotlin Backend Engineer",
    "domain": "Software Engineering",
    "description": "Builds Spring Boot Kotlin services, coroutines asynchronous pipelines, and high-concurrency microservices.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "kotlin",
        "name": "Kotlin",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "spring-boot",
        "name": "Spring Boot",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Frameworks"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "r-programmer",
    "slug": "r-data-science-programmer",
    "title": "R Data Science Programmer",
    "domain": "Data & Analytics",
    "description": "Builds statistical models, Tidyverse data manipulations, ggplot2 visualizations, and Shiny interactive apps.",
    "primary_focus": "",
    "industry_demand": 8.4,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "r",
        "name": "R",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "statistics",
        "name": "Statistics",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Mathematics"
      },
      {
        "skill_id": "data-visualization",
        "name": "Data Visualization",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Visualization"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Databases"
      },
      {
        "skill_id": "data-analysis",
        "name": "Data Analysis",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Data Science"
      }
    ]
  },
  {
    "id": "julia-developer",
    "slug": "julia-scientific-computing-developer",
    "title": "Julia Scientific Computing Developer",
    "domain": "Software Engineering",
    "description": "Engineers high-speed numerical simulations, differential equation solvers, and mathematical algorithms.",
    "primary_focus": "",
    "industry_demand": 8.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "julia",
        "name": "Julia",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Mathematics"
      },
      {
        "skill_id": "calculus",
        "name": "Calculus",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "scientific-computing",
        "name": "Scientific Computing",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Simulation"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Programming"
      }
    ]
  },
  {
    "id": "fea-engineer",
    "slug": "fea-simulation-engineer",
    "title": "Finite Element Analysis (FEA) Structural Engineer",
    "domain": "Software Engineering",
    "description": "Simulates structural stress, thermal dissipation, mechanical vibration, and material deformation.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "ansys",
        "name": "ANSYS",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Simulation"
      },
      {
        "skill_id": "solidworks",
        "name": "SolidWorks",
        "required_level": 85,
        "importance_weight": 9,
        "category": "CAD"
      },
      {
        "skill_id": "finite-element-analysis",
        "name": "Finite Element Analysis",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Engineering"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "physics",
        "name": "Physics",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Physics"
      }
    ]
  },
  {
    "id": "cfd-engineer",
    "slug": "cfd-aerodynamics-engineer",
    "title": "Computational Fluid Dynamics (CFD) Engineer",
    "domain": "Software Engineering",
    "description": "Simulates fluid flow, heat transfer, aerodynamic drag coefficients, and combustion turbulence.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "openfoam",
        "name": "OpenFOAM",
        "required_level": 85,
        "importance_weight": 9,
        "category": "CFD"
      },
      {
        "skill_id": "ansys-fluent",
        "name": "ANSYS Fluent",
        "required_level": 90,
        "importance_weight": 10,
        "category": "CFD"
      },
      {
        "skill_id": "fluid-mechanics",
        "name": "Fluid Mechanics",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Physics"
      },
      {
        "skill_id": "calculus",
        "name": "Calculus",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Scripting"
      }
    ]
  },
  {
    "id": "remote-sensing-eng",
    "slug": "remote-sensing-engineer",
    "title": "Remote Sensing & Satellite Imagery Engineer",
    "domain": "Software Engineering",
    "description": "Processes multispectral satellite imagery, SAR radar data, NDVI vegetation metrics, and LiDAR point clouds.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "gis",
        "name": "GIS",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Spatial"
      },
      {
        "skill_id": "opencv",
        "name": "OpenCV",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Vision"
      },
      {
        "skill_id": "satellite-data",
        "name": "Satellite Data",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Spatial"
      },
      {
        "skill_id": "data-visualization",
        "name": "Data Visualization",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Visualization"
      }
    ]
  },
  {
    "id": "performance-test-eng",
    "slug": "performance-test-engineer",
    "title": "Performance & Load Testing Engineer",
    "domain": "Software Engineering",
    "description": "Executes JMeter/K6 load testing scripts, identifies memory leaks, CPU bottlenecks, and latency curves.",
    "primary_focus": "",
    "industry_demand": 8.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "jmeter",
        "name": "JMeter",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Testing"
      },
      {
        "skill_id": "k6",
        "name": "K6",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Testing"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Scripting"
      },
      {
        "skill_id": "performance-testing",
        "name": "Performance Testing",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Testing"
      },
      {
        "skill_id": "monitoring",
        "name": "Monitoring",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Operations"
      }
    ]
  },
  {
    "id": "erp-consultant",
    "slug": "erp-technical-consultant",
    "title": "ERP Technical Consultant",
    "domain": "Software Engineering",
    "description": "Configures enterprise resource planning modules, database migrations, financial compliance, and custom workflows.",
    "primary_focus": "",
    "industry_demand": 8.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "erp-systems",
        "name": "ERP Systems",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Enterprise"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "business-analysis",
        "name": "Business Analysis",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Domain"
      },
      {
        "skill_id": "project-management",
        "name": "Project Management",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Management"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Soft Skills"
      }
    ]
  },
  {
    "id": "voice-interface-dev",
    "slug": "voice-interface-developer",
    "title": "Voice Interface & Alexa Skill Developer",
    "domain": "Software Engineering",
    "description": "Engineers Alexa skills, Google Assistant voice actions, speech-to-text models, and SSML SS voice output.",
    "primary_focus": "",
    "industry_demand": 8.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "node-js",
        "name": "Node.js",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Backend"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "voice-ux",
        "name": "Voice UX",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Voice"
      },
      {
        "skill_id": "nlp",
        "name": "NLP",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Core AI"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      }
    ]
  },
  {
    "id": "crm-developer",
    "slug": "crm-custom-developer",
    "title": "CRM Solutions Developer",
    "domain": "Software Engineering",
    "description": "Customizes HubSpot, Dynamics 365, and Zoho CRM workflows, custom REST webhooks, and sales pipeline analytics.",
    "primary_focus": "",
    "industry_demand": 8.4,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "crm-systems",
        "name": "CRM Systems",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Enterprise"
      },
      {
        "skill_id": "javascript",
        "name": "JavaScript",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Frontend"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Scripting"
      }
    ]
  },
  {
    "id": "web3-frontend-eng",
    "slug": "web3-frontend-engineer",
    "title": "Web3 Frontend Engineer",
    "domain": "Software Engineering",
    "description": "Constructs dApp interfaces connecting Ethers.js / Wagmi hooks, MetaMask wallet signatures, and smart contracts.",
    "primary_focus": "",
    "industry_demand": 8.9,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "react",
        "name": "React",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Frontend"
      },
      {
        "skill_id": "typescript",
        "name": "TypeScript",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "ethers-js",
        "name": "Ethers.js",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Web3"
      },
      {
        "skill_id": "solidity",
        "name": "Solidity",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Blockchain"
      },
      {
        "skill_id": "web3",
        "name": "Web3",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Blockchain"
      }
    ]
  },
  {
    "id": "big-data-engineer",
    "slug": "hadoop-big-data-engineer",
    "title": "Hadoop & Big Data Engineer",
    "domain": "Data & Analytics",
    "description": "Manages HDFS clusters, MapReduce jobs, Hive data warehousing, and distributed parallel storage.",
    "primary_focus": "",
    "industry_demand": 8.8,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "hadoop",
        "name": "Hadoop",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Big Data"
      },
      {
        "skill_id": "hive",
        "name": "Hive",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Big Data"
      },
      {
        "skill_id": "spark",
        "name": "Spark",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Big Data"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Databases"
      }
    ]
  },
  {
    "id": "spark-engineer",
    "slug": "apache-spark-engineer",
    "title": "Apache Spark Big Data Engineer",
    "domain": "Data & Analytics",
    "description": "Architects PySpark/Scala Spark streaming jobs, memory caching optimizations, and large-scale ETL pipelines.",
    "primary_focus": "",
    "industry_demand": 9.2,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "pyspark",
        "name": "PySpark",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Big Data"
      },
      {
        "skill_id": "scala",
        "name": "Scala",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "kafka",
        "name": "Kafka",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Streaming"
      }
    ]
  },
  {
    "id": "kafka-engineer",
    "slug": "apache-kafka-engineer",
    "title": "Apache Kafka Event Streaming Engineer",
    "domain": "Data & Analytics",
    "description": "Designs event-driven messaging topologies, consumer group rebalancing, Schema Registry, and Kafka Streams.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "java",
        "name": "Java",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "kafka",
        "name": "Kafka",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Streaming"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "distributed-systems",
        "name": "Distributed Systems",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Architecture"
      },
      {
        "skill_id": "docker",
        "name": "Docker",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Containers"
      }
    ]
  },
  {
    "id": "reinforcement-learning-eng",
    "slug": "reinforcement-learning-engineer",
    "title": "Reinforcement Learning Engineer",
    "domain": "AI & Machine Learning",
    "description": "Constructs Markov decision processes, Q-learning, PPO policy gradients, and simulation environments.",
    "primary_focus": "",
    "industry_demand": 9.4,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "pytorch",
        "name": "PyTorch",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Frameworks"
      },
      {
        "skill_id": "reinforcement-learning",
        "name": "Reinforcement Learning",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Core AI"
      },
      {
        "skill_id": "gymnasium",
        "name": "Gymnasium",
        "required_level": 85,
        "importance_weight": 8,
        "category": "RL"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "probability",
        "name": "Probability",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Mathematics"
      }
    ]
  },
  {
    "id": "llm-fine-tuning-eng",
    "slug": "llm-fine-tuning-engineer",
    "title": "LLM Fine-Tuning & Quantization Engineer",
    "domain": "AI & Machine Learning",
    "description": "Executes LoRA/QLoRA adapter tuning, DPO alignment, GGML/GGUF quantization, and GPU vLLM serving.",
    "primary_focus": "",
    "industry_demand": 9.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "pytorch",
        "name": "PyTorch",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Frameworks"
      },
      {
        "skill_id": "transformers",
        "name": "Transformers",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Core AI"
      },
      {
        "skill_id": "llms",
        "name": "LLMs",
        "required_level": 95,
        "importance_weight": 10,
        "category": "GenAI"
      },
      {
        "skill_id": "cuda",
        "name": "CUDA",
        "required_level": 80,
        "importance_weight": 8,
        "category": "GPU"
      },
      {
        "skill_id": "model-optimization",
        "name": "Model Optimization",
        "required_level": 85,
        "importance_weight": 9,
        "category": "AI Infrastructure"
      }
    ]
  },
  {
    "id": "platform-engineer",
    "slug": "platform-engineer",
    "title": "Internal Developer Platform (IDP) Engineer",
    "domain": "Software Engineering",
    "description": "Engineers developer self-service platforms, Backstage portals, service mesh, and infrastructure automation.",
    "primary_focus": "",
    "industry_demand": 9.2,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "go",
        "name": "Go",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "kubernetes",
        "name": "Kubernetes",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Orchestration"
      },
      {
        "skill_id": "docker",
        "name": "Docker",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Containers"
      },
      {
        "skill_id": "terraform",
        "name": "Terraform",
        "required_level": 85,
        "importance_weight": 9,
        "category": "IaC"
      },
      {
        "skill_id": "ci-cd",
        "name": "CI/CD",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Automation"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Scripting"
      }
    ]
  },
  {
    "id": "digital-marketing-analyst",
    "slug": "digital-marketing-data-analyst",
    "title": "Digital Marketing Data Analyst",
    "domain": "Data & Analytics",
    "description": "Analyzes paid ad campaign ROAS, multi-touch attribution models, customer acquisition costs, and SQL cohorts.",
    "primary_focus": "",
    "industry_demand": 8.4,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "excel",
        "name": "Excel",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Analysis"
      },
      {
        "skill_id": "google-analytics",
        "name": "Google Analytics",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Analytics"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 70,
        "importance_weight": 6,
        "category": "Data Science"
      },
      {
        "skill_id": "data-visualization",
        "name": "Data Visualization",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Visualization"
      }
    ]
  },
  {
    "id": "insurtech-analyst",
    "slug": "insurtech-data-analyst",
    "title": "InsurTech Actuarial & Risk Data Analyst",
    "domain": "Data & Analytics",
    "description": "Constructs predictive insurance claim loss models, mortality risk tables, and automated underwriting engines.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "statistics",
        "name": "Statistics",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Mathematics"
      },
      {
        "skill_id": "probability",
        "name": "Probability",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Mathematics"
      },
      {
        "skill_id": "risk-modeling",
        "name": "Risk Modeling",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Finance"
      }
    ]
  },
  {
    "id": "algorithmic-trader",
    "slug": "algorithmic-trading-developer",
    "title": "Algorithmic Trading Software Developer",
    "domain": "Software Engineering",
    "description": "Engineers ultra-low latency C++ exchange order routing, FIX protocol parsers, and backtesting engines.",
    "primary_focus": "",
    "industry_demand": 9.6,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Programming"
      },
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Scripting"
      },
      {
        "skill_id": "financial-modeling",
        "name": "Financial Modeling",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Finance"
      },
      {
        "skill_id": "concurrency",
        "name": "Concurrency",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Systems"
      },
      {
        "skill_id": "networking",
        "name": "Networking",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Infrastructure"
      }
    ]
  },
  {
    "id": "financial-data-scientist",
    "slug": "financial-data-scientist",
    "title": "Financial Data Scientist",
    "domain": "Data & Analytics",
    "description": "Analyzes time-series stock telemetry, sentiment analysis on SEC filings, and credit scoring neural networks.",
    "primary_focus": "",
    "industry_demand": 9.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "python",
        "name": "Python",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Programming"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Databases"
      },
      {
        "skill_id": "statistics",
        "name": "Statistics",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Mathematics"
      },
      {
        "skill_id": "machine-learning",
        "name": "Machine Learning",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Core AI"
      },
      {
        "skill_id": "pandas",
        "name": "Pandas",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Data Science"
      },
      {
        "skill_id": "financial-analysis",
        "name": "Financial Analysis",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Finance"
      }
    ]
  },
  {
    "id": "simulation-engineer",
    "slug": "multiphysics-simulation-engineer",
    "title": "Multi-Physics Simulation Engineer",
    "domain": "Software Engineering",
    "description": "Models coupled thermal-mechanical-fluid interactions, finite element grids, and computational dynamics.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "matlab",
        "name": "MATLAB",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Simulation"
      },
      {
        "skill_id": "c",
        "name": "C++",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Programming"
      },
      {
        "skill_id": "physics",
        "name": "Physics",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Physics"
      },
      {
        "skill_id": "calculus",
        "name": "Calculus",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Mathematics"
      },
      {
        "skill_id": "linear-algebra",
        "name": "Linear Algebra",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Mathematics"
      }
    ]
  },
  {
    "id": "ux-researcher",
    "slug": "ux-researcher",
    "title": "UX Researcher & Usability Specialist",
    "domain": "Data & Analytics",
    "description": "Designs qualitative user interviews, usability testing sessions, eye-tracking metrics, and affinity mapping.",
    "primary_focus": "",
    "industry_demand": 8.5,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "user-research",
        "name": "User Research",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Research"
      },
      {
        "skill_id": "usability-testing",
        "name": "Usability Testing",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Testing"
      },
      {
        "skill_id": "figma",
        "name": "Figma",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Design"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Soft Skills"
      },
      {
        "skill_id": "data-analysis",
        "name": "Data Analysis",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Analysis"
      }
    ]
  },
  {
    "id": "test-lead",
    "slug": "qa-test-lead-manager",
    "title": "QA Test Lead & Quality Manager",
    "domain": "Software Engineering",
    "description": "Defines master test strategies, defect triage workflows, release sign-off criteria, and automation coverage goals.",
    "primary_focus": "",
    "industry_demand": 8.7,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "qa-testing",
        "name": "QA Testing",
        "required_level": 95,
        "importance_weight": 10,
        "category": "Testing"
      },
      {
        "skill_id": "test-strategy",
        "name": "Test Strategy",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Management"
      },
      {
        "skill_id": "agile",
        "name": "Agile",
        "required_level": 85,
        "importance_weight": 8,
        "category": "Process"
      },
      {
        "skill_id": "automation-testing",
        "name": "Automation Testing",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Testing"
      },
      {
        "skill_id": "communication",
        "name": "Communication",
        "required_level": 90,
        "importance_weight": 9,
        "category": "Soft Skills"
      }
    ]
  },
  {
    "id": "low-code-architect",
    "slug": "no-code-low-code-architect",
    "title": "No-Code / Low-Code Solutions Architect",
    "domain": "Cloud & DevOps",
    "description": "Designs enterprise governance, custom API connectors, and app architectures built on no-code tools.",
    "primary_focus": "",
    "industry_demand": 8.3,
    "is_anchor_role": false,
    "skills": [
      {
        "skill_id": "low-code",
        "name": "Low-Code",
        "required_level": 90,
        "importance_weight": 10,
        "category": "Low-Code"
      },
      {
        "skill_id": "system-design",
        "name": "System Design",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "rest-apis",
        "name": "REST APIs",
        "required_level": 80,
        "importance_weight": 8,
        "category": "Architecture"
      },
      {
        "skill_id": "business-automation",
        "name": "Business Automation",
        "required_level": 85,
        "importance_weight": 9,
        "category": "Workflow"
      },
      {
        "skill_id": "sql",
        "name": "SQL",
        "required_level": 75,
        "importance_weight": 7,
        "category": "Databases"
      }
    ]
  }
];
