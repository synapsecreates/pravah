# FILE: backend/app/api/v1/endpoints/district.py
# PURPOSE: District Skill Development Officer (DSDO) endpoints for 5-sector supply vs demand deficit matrix and training subsidy allocation engine.
# PHASE: 7 | DEPENDS ON: schemas.py, dataset.py, stakeholder_engine.py | LAST TOUCHED: Phase 7

from typing import Dict, List
from fastapi import APIRouter, HTTPException
from app.core.dataset import get_demo_districts
from app.models.schemas import (
    DistrictDeficitMatrixResponse,
    DistrictResponse,
    DistrictSubsidyResponse,
    SectorDeficitItem,
    SubsidyRecommendationItem,
)

router = APIRouter()

# 5-Sector Master Taxonomy Calibrated to AICTE & Ministry of Skill Development (MSDE)
SECTOR_METRICS: Dict[str, Dict[str, dict]] = {
    "bilaspur": {
        "it-software": {
            "name": "Information Technology, Cloud & AI",
            "demand": 680,
            "supply": 410,
            "yoy": "+22%",
            "bottlenecks": ["Docker", "AWS Cloud", "React", "Python"],
            "employers": ["SECL Tech", "NTPC IT", "Wipro Digital", "Local Tech MSMEs"],
        },
        "manufacturing": {
            "name": "Advanced Manufacturing & Heavy Industries",
            "demand": 820,
            "supply": 580,
            "yoy": "+16%",
            "bottlenecks": ["PLC Automation", "AutoCAD / SolidWorks", "Industrial IoT", "CNC Operations"],
            "employers": ["Jindal Steel & Power", "SECL Bilaspur", "Beckman Coulter", "Balco"],
        },
        "healthcare": {
            "name": "Healthcare Diagnostics & Biomedical Informatics",
            "demand": 340,
            "supply": 260,
            "yoy": "+28%",
            "bottlenecks": ["Clinical Data Analysis", "Medical Imaging Software", "Biostatistics"],
            "employers": ["Apollo Hospitals Bilaspur", "CIMS Medical College", "SRL Diagnostics"],
        },
        "green-energy": {
            "name": "Solar, Green Energy & EV Mobility",
            "demand": 290,
            "supply": 140,
            "yoy": "+45%",
            "bottlenecks": ["Solar PV Grid Integration", "Battery Management Systems", "EV Diagnostics"],
            "employers": ["CREDA Chhattisgarh", "Tata Power Solar", "Ola Electric Grid"],
        },
        "bfsi": {
            "name": "BFSI, FinTech & Digital Accounting",
            "demand": 410,
            "supply": 380,
            "yoy": "+12%",
            "bottlenecks": ["SQL Reporting", "Financial Modeling", "Fraud Risk Analytics"],
            "employers": ["State Bank of India", "HDFC Bank", "ICICI Securities", "Bandhan Bank"],
        },
    },
    "raipur": {
        "it-software": {
            "name": "Information Technology, Cloud & AI",
            "demand": 1450,
            "supply": 920,
            "yoy": "+32%",
            "bottlenecks": ["Cloud DevOps", "Full Stack Development", "FastAPI / Python", "Data Engineering"],
            "employers": ["Tech Mahindra", "Infosys Raipur Center", "TCS Digital", "State IT Center"],
        },
        "manufacturing": {
            "name": "Advanced Manufacturing & Heavy Industries",
            "demand": 1200,
            "supply": 850,
            "yoy": "+18%",
            "bottlenecks": ["Robotics Maintenance", "Six Sigma Quality Control", "Metallurgical Testing"],
            "employers": ["Godawari Power & Ispat", "Monnet Ispat", "Sarda Energy", "Naya Raipur Smart City"],
        },
        "healthcare": {
            "name": "Healthcare Diagnostics & Biomedical Informatics",
            "demand": 620,
            "supply": 490,
            "yoy": "+24%",
            "bottlenecks": ["Electronic Health Records (EHR)", "Radiology Tele-imaging", "Pharmacovigilance"],
            "employers": ["AIIMS Raipur", "Narayana Hrudayalaya", "Ramkrishna CARE Hospital"],
        },
        "green-energy": {
            "name": "Solar, Green Energy & EV Mobility",
            "demand": 510,
            "supply": 280,
            "yoy": "+48%",
            "bottlenecks": ["Smart Grid Telemetry", "Power Electronics", "Renewable Energy Economics"],
            "employers": ["NTPC Green Energy", "Adani Solar", "Hero Electric Charging"],
        },
        "bfsi": {
            "name": "BFSI, FinTech & Digital Accounting",
            "demand": 780,
            "supply": 690,
            "yoy": "+15%",
            "bottlenecks": ["Core Banking Systems", "Credit Underwriting Algorithms", "Data Visualization"],
            "employers": ["Axis Bank", "Kotak Mahindra", "IDFC First Bank", "Shriram Finance"],
        },
    },
    "bangalore": {
        "it-software": {
            "name": "Information Technology, Cloud & AI",
            "demand": 16500,
            "supply": 11200,
            "yoy": "+42%",
            "bottlenecks": ["Kubernetes", "Distributed Systems", "LLM Fine-Tuning", "Cloud Security"],
            "employers": ["Google Bangalore", "Microsoft IDC", "Amazon AWS", "Flipkart", "Swiggy"],
        },
        "manufacturing": {
            "name": "Advanced Manufacturing & Precision Engineering",
            "demand": 4200,
            "supply": 3100,
            "yoy": "+20%",
            "bottlenecks": ["Aerospace Precision Machining", "Semiconductor Packaging", "Embedded Firmware"],
            "employers": ["HAL", "Boeing India", "Titan Precision", "Bosch India"],
        },
        "healthcare": {
            "name": "Healthcare Diagnostics & Biomedical Informatics",
            "demand": 3800,
            "supply": 2700,
            "yoy": "+36%",
            "bottlenecks": ["Genomics Bioinformatics", "Computational Biology", "Medical Device Firmware"],
            "employers": ["Biocon", "AstraZeneca R&D", "Syngene International", "Manipal Health"],
        },
        "green-energy": {
            "name": "Solar, Green Energy & EV Mobility",
            "demand": 4100,
            "supply": 2400,
            "yoy": "+65%",
            "bottlenecks": ["EV Powertrain Design", "Lithium-Ion Battery Modeling", "Thermal Management"],
            "employers": ["Ather Energy", "Ola Electric R&D", "Simple Energy", "SunMobility"],
        },
        "bfsi": {
            "name": "BFSI, FinTech & Digital Accounting",
            "demand": 5900,
            "supply": 4800,
            "yoy": "+28%",
            "bottlenecks": ["Algorithmic Trading", "Payment Gateway Security", "Quantitative Risk Modeling"],
            "employers": ["CRED", "Razorpay", "PhonePe", "Zerodha", "Goldman Sachs"],
        },
    },
    "pune": {
        "it-software": {
            "name": "Information Technology, Cloud & AI",
            "demand": 8500,
            "supply": 6400,
            "yoy": "+30%",
            "bottlenecks": ["Cloud DevOps", "Java Microservices", "React/TypeScript", "MLOps"],
            "employers": ["Persistent Systems", "Zensar Technologies", "Barclays Global", "Infosys Hinjawadi"],
        },
        "manufacturing": {
            "name": "Advanced Manufacturing & Automotive Engineering",
            "demand": 6200,
            "supply": 4800,
            "yoy": "+22%",
            "bottlenecks": ["Automotive Mechatronics", "CAN Bus Protocol", "EV Chassis Engineering"],
            "employers": ["Tata Motors", "Bajaj Auto", "Bharat Forge", "Mahindra & Mahindra"],
        },
        "healthcare": {
            "name": "Healthcare Diagnostics & Biomedical Informatics",
            "demand": 1900,
            "supply": 1500,
            "yoy": "+20%",
            "bottlenecks": ["Vaccine Production Quality", "Clinical Trials Analytics", "Regulatory Affairs"],
            "employers": ["Serum Institute of India", "Lupin Research Park", "Emcure Pharma"],
        },
        "green-energy": {
            "name": "Solar, Green Energy & EV Mobility",
            "demand": 2400,
            "supply": 1500,
            "yoy": "+52%",
            "bottlenecks": ["EV Motor Inverter Calibration", "Renewable Storage", "Battery Testing"],
            "employers": ["KPIT Technologies", "Tata AutoComp", "Pinnacle Mobility"],
        },
        "bfsi": {
            "name": "BFSI, FinTech & Digital Accounting",
            "demand": 3100,
            "supply": 2600,
            "yoy": "+18%",
            "bottlenecks": ["Fraud Analytics", "FinTech Cloud APIs", "Compliance Telemetry"],
            "employers": ["Bajaj Finserv", "Credit Suisse Pune", "Deutsche Bank Pune", "Citi Center"],
        },
    },
    "hyderabad": {
        "it-software": {
            "name": "Information Technology, Cloud & AI",
            "demand": 11500,
            "supply": 8400,
            "yoy": "+38%",
            "bottlenecks": ["AWS Cloud Solutions", "Distributed Database Optimization", "PyTorch / GenAI", "Kubernetes"],
            "employers": ["Microsoft Hyderabad", "Amazon India HQ", "Google Cloud", "Oracle India"],
        },
        "manufacturing": {
            "name": "Advanced Manufacturing & Defense Aerospace",
            "demand": 3400,
            "supply": 2600,
            "yoy": "+24%",
            "bottlenecks": ["Avionics Embedded Software", "Defense Electronics", "Precision Tooling"],
            "employers": ["Tata Boeing Aerospace", "DRDO Labs", "BrahMos Aerospace", "Bharat Dynamics"],
        },
        "healthcare": {
            "name": "Healthcare Diagnostics & Pharmaceutical Informatics",
            "demand": 4200,
            "supply": 2900,
            "yoy": "+34%",
            "bottlenecks": ["Formulation Data Science", "Bioprocess Chromatography", "Clinical Informatics"],
            "employers": ["Dr. Reddy's Labs", "Bharat Biotech", "Hetero Drugs", "Biological E"],
        },
        "green-energy": {
            "name": "Solar, Green Energy & EV Mobility",
            "demand": 2800,
            "supply": 1700,
            "yoy": "+55%",
            "bottlenecks": ["Hydrogen Fuel Cell Modeling", "Smart Metering", "Battery Chemistry"],
            "employers": ["Amara Raja Energy", "Gensol Solar", "Evey Trans"],
        },
        "bfsi": {
            "name": "BFSI, FinTech & Digital Accounting",
            "demand": 3900,
            "supply": 3200,
            "yoy": "+20%",
            "bottlenecks": ["WealthTech APIs", "Predictive Risk Analytics", "Insurance Telematics"],
            "employers": ["Franklin Templeton", "Synchrony Financial", "State Street", "D.E. Shaw"],
        },
    },
}


# -----------------------------------------------------------------------------
# ENDPOINT 1: LIST DISTRICTS
# -----------------------------------------------------------------------------
@router.get("/list", response_model=List[DistrictResponse])
def list_districts() -> List[DistrictResponse]:
    """Returns the catalog of administrative districts available for regional labor planning."""
    return get_demo_districts()


# -----------------------------------------------------------------------------
# ENDPOINT 2: 5-SECTOR SUPPLY VS DEMAND DEFICIT MATRIX
# -----------------------------------------------------------------------------
@router.get("/{district_id}/deficit-matrix", response_model=DistrictDeficitMatrixResponse)
def get_district_deficit_matrix(district_id: str) -> DistrictDeficitMatrixResponse:
    """Returns the 5-sector labor supply vs demand deficit matrix and urgency telemetry for DSDO."""
    key = district_id.strip().lower()
    districts = {d.id: d for d in get_demo_districts()}
    district = districts.get(key)

    if not district:
        raise HTTPException(status_code=404, detail=f"District '{district_id}' not found.")

    raw_sectors = SECTOR_METRICS.get(key, SECTOR_METRICS["bilaspur"])

    sector_items: List[SectorDeficitItem] = []
    total_demand = 0
    total_supply = 0
    critical_count = 0

    for sec_id, data in raw_sectors.items():
        dem = data["demand"]
        sup = data["supply"]
        net = dem - sup
        urgency = "HIGH DEFICIT" if net > 150 else ("MODERATE DEFICIT" if net > 0 else "BALANCED")
        if urgency == "HIGH DEFICIT":
            critical_count += 1

        total_demand += dem
        total_supply += sup

        sector_items.append(
            SectorDeficitItem(
                sector_id=sec_id,
                sector_name=data["name"],
                demand_volume=dem,
                supply_volume=sup,
                net_balance=net,
                urgency_status=urgency,
                yoy_growth=data["yoy"],
                critical_bottleneck_skills=data["bottlenecks"],
                top_employers=data["employers"],
            )
        )

    # Sort sectors by largest net deficit first
    sector_items.sort(key=lambda s: -s.net_balance)

    return DistrictDeficitMatrixResponse(
        district_id=district.id,
        district_name=district.name,
        state=district.state,
        tier=district.tier,
        economic_focus=district.economic_focus,
        total_demand=total_demand,
        total_supply=total_supply,
        net_regional_deficit=total_demand - total_supply,
        critical_sectors_count=critical_count,
        sectors=sector_items,
    )


# -----------------------------------------------------------------------------
# ENDPOINT 3: STATE TRAINING SUBSIDY ALLOCATION ENGINE
# -----------------------------------------------------------------------------
@router.get("/{district_id}/subsidy-recommendations", response_model=DistrictSubsidyResponse)
def get_district_subsidy_recommendations(district_id: str) -> DistrictSubsidyResponse:
    """Calculates prioritized state training subsidy budget allocations to close regional labor deficits."""
    key = district_id.strip().lower()
    districts = {d.id: d for d in get_demo_districts()}
    district = districts.get(key)

    if not district:
        raise HTTPException(status_code=404, detail=f"District '{district_id}' not found.")

    subsidy_blueprints = {
        "bilaspur": [
            SubsidyRecommendationItem(
                id="sub-bil-01",
                sector_name="Information Technology, Cloud & AI",
                target_program="Cloud DevOps & Microservices Vocational Bridge",
                partner_institutions=["Guru Ghasidas Vishwavidyalaya", "Government ITI Bilaspur"],
                recommended_subsidy_amount="₹45 Lakhs",
                projected_trainees=180,
                priority_score=94.5,
                projected_roi="85% Deficit Closed in 6 Months",
            ),
            SubsidyRecommendationItem(
                id="sub-bil-02",
                sector_name="Solar, Green Energy & EV Mobility",
                target_program="Solar PV Grid Integration & Battery Diagnostics Lab",
                partner_institutions=["Government Polytechnic Bilaspur", "CREDA Skill Cell"],
                recommended_subsidy_amount="₹35 Lakhs",
                projected_trainees=120,
                priority_score=89.2,
                projected_roi="80% Deficit Closed in 6 Months",
            ),
            SubsidyRecommendationItem(
                id="sub-bil-03",
                sector_name="Advanced Manufacturing & Heavy Industries",
                target_program="Industrial PLC & CNC Precision Machining Apprenticeship",
                partner_institutions=["SECL Technical Training Institute"],
                recommended_subsidy_amount="₹40 Lakhs",
                projected_trainees=160,
                priority_score=84.0,
                projected_roi="75% Deficit Closed in 9 Months",
            ),
            SubsidyRecommendationItem(
                id="sub-bil-04",
                sector_name="Healthcare Diagnostics & Biomedical Informatics",
                target_program="Healthcare EHR Tele-Imaging Certification",
                partner_institutions=["CIMS Medical College", "Apollo Bilaspur"],
                recommended_subsidy_amount="₹25 Lakhs",
                projected_trainees=90,
                priority_score=78.5,
                projected_roi="70% Deficit Closed in 6 Months",
            ),
        ],
        "raipur": [
            SubsidyRecommendationItem(
                id="sub-rai-01",
                sector_name="Information Technology, Cloud & AI",
                target_program="State Cloud Infrastructure & AI Application Bootcamp",
                partner_institutions=["NIT Raipur", "Government Engineering College Raipur"],
                recommended_subsidy_amount="₹75 Lakhs",
                projected_trainees=350,
                priority_score=96.0,
                projected_roi="88% Deficit Closed in 6 Months",
            ),
            SubsidyRecommendationItem(
                id="sub-rai-02",
                sector_name="Solar, Green Energy & EV Mobility",
                target_program="EV Fleet Maintenance & Charging Infrastructure Hub",
                partner_institutions=["CSVTU Skill Hub", "Naya Raipur Smart City Institute"],
                recommended_subsidy_amount="₹50 Lakhs",
                projected_trainees=200,
                priority_score=91.5,
                projected_roi="82% Deficit Closed in 6 Months",
            ),
            SubsidyRecommendationItem(
                id="sub-rai-03",
                sector_name="Advanced Manufacturing & Heavy Industries",
                target_program="Industry 4.0 Robotics & Metallurgical Quality Assurance",
                partner_institutions=["NIT Raipur Metallurgy Dept", "Godawari Power Institute"],
                recommended_subsidy_amount="₹60 Lakhs",
                projected_trainees=240,
                priority_score=86.8,
                projected_roi="78% Deficit Closed in 9 Months",
            ),
        ],
        "bangalore": [
            SubsidyRecommendationItem(
                id="sub-blr-01",
                sector_name="Information Technology, Cloud & AI",
                target_program="DeepTech LLM Fine-Tuning & Distributed Systems Fellowship",
                partner_institutions=["IIIT Bangalore", "Karnataka Digital Economy Mission"],
                recommended_subsidy_amount="₹1.80 Crores",
                projected_trainees=900,
                priority_score=98.5,
                projected_roi="92% Deficit Closed in 6 Months",
            ),
            SubsidyRecommendationItem(
                id="sub-blr-02",
                sector_name="Solar, Green Energy & EV Mobility",
                target_program="EV Powertrain & High-Voltage Battery Lab",
                partner_institutions=["BMS College of Engineering", "Ather Energy Skill Labs"],
                recommended_subsidy_amount="₹1.20 Crores",
                projected_trainees=600,
                priority_score=94.0,
                projected_roi="85% Deficit Closed in 6 Months",
            ),
        ],
        "pune": [
            SubsidyRecommendationItem(
                id="sub-pun-01",
                sector_name="Advanced Manufacturing & Automotive Engineering",
                target_program="Next-Gen EV Chassis & Autonomous Driving Sensors Lab",
                partner_institutions=["COEP Technological University", "ARAI Pune"],
                recommended_subsidy_amount="₹1.10 Crores",
                projected_trainees=500,
                priority_score=95.0,
                projected_roi="86% Deficit Closed in 6 Months",
            ),
            SubsidyRecommendationItem(
                id="sub-pun-02",
                sector_name="Information Technology, Cloud & AI",
                target_program="Enterprise Cloud Microservices & DevSecOps Accelerator",
                partner_institutions=["Pune Institute of Computer Technology", "Zensar Labs"],
                recommended_subsidy_amount="₹90 Lakhs",
                projected_trainees=450,
                priority_score=91.0,
                projected_roi="82% Deficit Closed in 6 Months",
            ),
        ],
        "hyderabad": [
            SubsidyRecommendationItem(
                id="sub-hyd-01",
                sector_name="Healthcare Diagnostics & Pharmaceutical Informatics",
                target_program="Biopharmaceutical Computational Genomics & Drug Informatics Lab",
                partner_institutions=["Genome Valley Skill Campus", "IIIT Hyderabad"],
                recommended_subsidy_amount="₹1.40 Crores",
                projected_trainees=650,
                priority_score=97.0,
                projected_roi="90% Deficit Closed in 6 Months",
            ),
            SubsidyRecommendationItem(
                id="sub-hyd-02",
                sector_name="Information Technology, Cloud & AI",
                target_program="Hyperscale Cloud Architecture & Neural Model Inference Hub",
                partner_institutions=["IIIT Hyderabad", "T-Hub Foundation"],
                recommended_subsidy_amount="₹1.50 Crores",
                projected_trainees=750,
                priority_score=96.5,
                projected_roi="88% Deficit Closed in 6 Months",
            ),
        ],
    }

    recs = subsidy_blueprints.get(key, subsidy_blueprints["bilaspur"])
    budget_map = {
        "bilaspur": "₹1.45 Crores",
        "raipur": "₹1.85 Crores",
        "bangalore": "₹3.00 Crores",
        "pune": "₹2.00 Crores",
        "hyderabad": "₹2.90 Crores",
    }

    return DistrictSubsidyResponse(
        district_id=district.id,
        total_budget_recommended=budget_map.get(key, "₹1.45 Crores"),
        recommendations=recs,
    )
