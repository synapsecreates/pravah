// FILE: src/pages/DistrictPortal.tsx
// PURPOSE: Regional labor planning portal for District Skill Development Officers (DSDO). Features 5-sector labor supply vs demand deficit matrix, net balance meters, and state training subsidy allocation recommendations with transparent mathematical proofs.
// PHASE: 7 | DEPENDS ON: src/api/client.ts, src/components/PerspectiveCard.tsx, lucide-react | LAST TOUCHED: Phase 7

import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Users,
  Briefcase,
  Building2,
  DollarSign,
  ChevronRight,
  Info,
  X,
  Calculator,
  Database,
  Award,
  Zap,
  Sparkles,
  Layers,
  ArrowUpRight,
  Target,
  ShieldAlert,
} from "lucide-react";
import { PerspectiveCard } from "../components/PerspectiveCard";
import {
  getDistricts,
  getDistrictDeficitMatrix,
  getDistrictSubsidyRecommendations,
  type DistrictItem,
  type DistrictDeficitMatrixData,
  type DistrictSubsidyData,
  type SectorDeficitItem,
} from "../api/client";

interface DistrictPortalProps {
  onBackToLanding?: () => void;
}

export const DistrictPortal: React.FC<DistrictPortalProps> = ({ onBackToLanding }) => {
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("bilaspur");
  const [deficitMatrix, setDeficitMatrix] = useState<DistrictDeficitMatrixData | null>(null);
  const [subsidyData, setSubsidyData] = useState<DistrictSubsidyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Active section tab
  const [activeTab, setActiveTab] = useState<"matrix" | "subsidies">("matrix");

  // Formula inspection modal state for single sector
  const [inspectedSector, setInspectedSector] = useState<SectorDeficitItem | null>(null);

  // Global DSDO Mathematical Framework modal state
  const [showMathModal, setShowMathModal] = useState<boolean>(false);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (inspectedSector || showMathModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [inspectedSector, showMathModal]);

  // Load districts on mount
  useEffect(() => {
    getDistricts()
      .then((data) => {
        setDistricts(data);
        if (data.length > 0 && !data.some((d) => d.id === selectedDistrictId)) {
          setSelectedDistrictId(data[0].id);
        }
      })
      .catch((err) => console.error("Error loading districts:", err));
  }, []);

  // Fetch district deficit matrix and subsidy recommendations
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDistrictDeficitMatrix(selectedDistrictId),
      getDistrictSubsidyRecommendations(selectedDistrictId),
    ])
      .then(([matrix, subsidies]) => {
        setDeficitMatrix(matrix);
        setSubsidyData(subsidies);
      })
      .catch((err) => console.error("Failed to fetch district telemetry:", err))
      .finally(() => setLoading(false));
  }, [selectedDistrictId]);

  return (
    <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "24px 20px 80px 20px" }}>
      {/* Header & District Selector Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
          paddingBottom: "18px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "14px",
                backgroundColor: "var(--brand-50)",
                color: "var(--brand-600)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              <MapPin size={13} />
              District DSDO Administration
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Tier {deficitMatrix?.tier || 2} · State: <strong>{deficitMatrix?.state || "Chhattisgarh"}</strong>
            </span>
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              margin: 0,
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
            }}
          >
            {deficitMatrix?.district_name || "District"} Labor Supply vs Demand Command
          </h1>
          <p style={{ margin: "6px 0 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
            5-sector regional labor balance telemetry, critical skill bottlenecks, and state training subsidy allocation engine.
          </p>
        </div>

        {/* District Selector & Math Framework CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
              SELECT ADMINISTRATIVE DISTRICT
            </label>
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="interactive-input"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-strong)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state}) · Tier {d.tier}
                </option>
              ))}
            </select>
          </div>

          <div style={{ alignSelf: "flex-end" }}>
            <button
              type="button"
              onClick={() => setShowMathModal(true)}
              className="interactive-btn"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--brand-50)",
                border: "1px solid var(--border-strong)",
                color: "var(--brand-600)",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Calculator size={15} />
              <span>Labor Economics Math</span>
            </button>
          </div>
        </div>
      </div>

      {/* MVP SEED DATA DISCLOSURE BANNER */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "12px",
          backgroundColor: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.28)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", maxWidth: "900px" }}>
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              color: "var(--brand-600)",
              marginTop: "2px",
            }}
          >
            <Database size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--brand-600)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                MSDE &amp; SSDM Benchmark Seed Data Active
              </span>
              
                          <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "var(--brand-600)",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                MVP Baseline Mode
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              You are exploring the DSDO planning portal operating on <strong>calibrated regional labor benchmark seed datasets</strong> (modeled after Ministry of Skill Development &amp; Entrepreneurship data). In production deployment, hiring demand is populated from <strong>live employer job posting scrapers / EPFO payroll feeds</strong> and supply is calculated from <strong>enrolled higher education and ITI student batches</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowMathModal(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--brand-600)",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span>See How It's Calculated</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* SECTION 01: Executive Labor Market KPIs (4 Cards) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {/* KPI 1: Open Hiring Demand */}
        <PerspectiveCard style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Total Regional Hiring Demand
            </span>
            <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "var(--brand-50)", color: "var(--brand-600)" }}>
              <Briefcase size={16} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
              {deficitMatrix?.total_demand.toLocaleString() || "2,540"}
            </span>
            <span style={{ fontSize: "12px", color: "var(--brand-600)", fontWeight: 600 }}>
              Active Requisitions
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
            Aggregated across 5 economic key sectors in {deficitMatrix?.district_name}
          </p>
        </PerspectiveCard>

        {/* KPI 2: Evaluated Student Supply */}
        <PerspectiveCard style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Evaluated Graduate Supply
            </span>
            <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
              {deficitMatrix?.total_supply.toLocaleString() || "1,770"}
            </span>
            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}>
              Graduating Cohort
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
            Qualified candidates from local colleges, polytechnics, and ITIs
          </p>
        </PerspectiveCard>

        {/* KPI 3: Net Regional Labor Deficit */}
        <PerspectiveCard style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Net Regional Labor Deficit (Δ)
            </span>
            <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#ef4444" }}>
              +{deficitMatrix?.net_regional_deficit.toLocaleString() || "770"}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "6px",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
              }}
            >
              DEFICIT SHORTAGE
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
            Formula: <code>Net Deficit = Total Demand - Local Supply</code>
          </p>
        </PerspectiveCard>

        {/* KPI 4: Critical Sectors Under Strain */}
        <PerspectiveCard style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Critical Deficit Sectors
            </span>
            <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
              <Zap size={16} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#d97706" }}>
              {deficitMatrix?.critical_sectors_count || 2}
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              of 5 Key Sectors
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("subsidies")}
            style={{
              padding: "4px 0",
              background: "transparent",
              border: "none",
              color: "var(--brand-600)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>View Subsidy Action Plan</span>
            <ChevronRight size={13} />
          </button>
        </PerspectiveCard>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className="interactive-btn"
          style={{
            padding: "10px 18px",
            border: "none",
            background: "transparent",
            borderBottom: activeTab === "matrix" ? "2px solid var(--brand-600)" : "2px solid transparent",
            color: activeTab === "matrix" ? "var(--brand-600)" : "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: activeTab === "matrix" ? 700 : 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Layers size={16} />
          <span>5-Sector Supply vs Demand Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("subsidies")}
          className="interactive-btn"
          style={{
            padding: "10px 18px",
            border: "none",
            background: "transparent",
            borderBottom: activeTab === "subsidies" ? "2px solid var(--brand-600)" : "2px solid transparent",
            color: activeTab === "subsidies" ? "var(--brand-600)" : "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: activeTab === "subsidies" ? 700 : 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <DollarSign size={16} />
          <span>State Training Subsidy Allocation Engine</span>
        </button>
      </div>

      {/* TAB 1: 5-Sector Supply vs Demand Matrix */}
      {activeTab === "matrix" && (
        <div>
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
              Sectoral Labor Supply &amp; Demand Deficit Telemetry
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
              Ranked by net deficit severity. Identifies specific technical bottleneck competencies causing regional underemployment.
            </p>
          </div>

          <PerspectiveCard style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-sunken)", borderBottom: "1px solid var(--border-subtle)" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>ECONOMIC SECTOR</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>DEMAND VOLUME</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>SUPPLY VOLUME</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>NET BALANCE (Δ)</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>URGENCY</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>CRITICAL BOTTLENECK SKILLS</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-secondary)" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {deficitMatrix?.sectors.map((sec, idx) => (
                    <tr
                      key={sec.sector_id}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        backgroundColor: idx % 2 === 0 ? "transparent" : "var(--bg-sunken)",
                      }}
                    >
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{sec.sector_name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          YoY Growth: <strong style={{ color: "var(--brand-600)" }}>{sec.yoy_growth}</strong>
                        </div>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {sec.demand_volume.toLocaleString()} jobs
                        </span>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {sec.supply_volume.toLocaleString()} candidates
                        </span>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            fontWeight: 800,
                            color: sec.net_balance > 150 ? "#ef4444" : sec.net_balance > 0 ? "#d97706" : "#059669",
                          }}
                        >
                          {sec.net_balance > 0 ? `+${sec.net_balance}` : sec.net_balance}
                        </span>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            backgroundColor:
                              sec.urgency_status === "HIGH DEFICIT"
                                ? "rgba(239, 68, 68, 0.15)"
                                : sec.urgency_status === "MODERATE DEFICIT"
                                ? "rgba(245, 158, 11, 0.15)"
                                : "rgba(16, 185, 129, 0.15)",
                            color:
                              sec.urgency_status === "HIGH DEFICIT"
                                ? "#ef4444"
                                : sec.urgency_status === "MODERATE DEFICIT"
                                ? "#d97706"
                                : "#059669",
                          }}
                        >
                          {sec.urgency_status === "HIGH DEFICIT" ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                          <span>{sec.urgency_status}</span>
                        </span>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {sec.critical_bottleneck_skills.map((skill) => (
                            <span
                              key={skill}
                              style={{
                                padding: "2px 6px",
                                borderRadius: "4px",
                                backgroundColor: "var(--bg-surface)",
                                border: "1px solid var(--border-strong)",
                                fontSize: "11px",
                                fontWeight: 500,
                                color: "var(--text-primary)",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td style={{ padding: "14px 18px" }}>
                        <button
                          type="button"
                          onClick={() => setInspectedSector(sec)}
                          className="interactive-btn"
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-strong)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--brand-600)",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Calculator size={12} />
                          <span>Inspect Math</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PerspectiveCard>
        </div>
      )}

      {/* TAB 2: State Training Subsidy Allocation Engine */}
      {activeTab === "subsidies" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                State Training Subsidy Allocation Blueprint
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                Direct budget distribution models calibrated to maximize regional deficit reduction per Rupee invested.
              </p>
            </div>

            <div
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                backgroundColor: "var(--brand-50)",
                border: "1px solid var(--border-strong)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DollarSign size={18} color="var(--brand-600)" />
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", display: "block" }}>
                  TOTAL RECOMMENDED ALLOCATION:
                </span>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-600)" }}>
                  {subsidyData?.total_budget_recommended || "₹1.45 Crores"}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
            {subsidyData?.recommendations.map((rec, idx) => (
              <PerspectiveCard key={rec.id} style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    PRIORITY #{idx + 1} (Score: {rec.priority_score.toFixed(1)})
                  </span>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--accent-emerald)" }}>
                    {rec.recommended_subsidy_amount}
                  </span>
                </div>

                <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {rec.target_program}
                </h3>

                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                  Sector: <strong style={{ color: "var(--text-primary)" }}>{rec.sector_name}</strong>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    RECOMMENDED PARTNER INSTITUTIONS
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {rec.partner_institutions.map((inst) => (
                      <span
                        key={inst}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          backgroundColor: "var(--bg-sunken)",
                          border: "1px solid var(--border-subtle)",
                          fontSize: "12px",
                          color: "var(--text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-sunken)",
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "auto",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--text-secondary)", display: "block" }}>Projected Trainees:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{rec.projected_trainees} candidates</strong>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ color: "var(--text-secondary)", display: "block" }}>Projected ROI:</span>
                    <strong style={{ color: "#059669" }}>{rec.projected_roi}</strong>
                  </div>
                </div>
              </PerspectiveCard>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Individual Sector Math Inspector */}
      {inspectedSector && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setInspectedSector(null)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid var(--border-strong)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--brand-50)",
                    color: "var(--brand-600)",
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Labor Economics Proof
                </span>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {inspectedSector.sector_name}
                </h3>
              </div>
              <button
                onClick={() => setInspectedSector(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
              <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)", fontFamily: "monospace" }}>
                <div><strong>Formula:</strong> Net Labor Balance (Δ) = Demand - Supply</div>
                <div style={{ marginTop: "6px", color: "var(--brand-600)" }}>
                  Δ = {inspectedSector.demand_volume} jobs - {inspectedSector.supply_volume} candidates = <strong>+{inspectedSector.net_balance} ({inspectedSector.urgency_status})</strong>
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Classification Rules:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "var(--text-secondary)" }}>
                  <div>• <strong>HIGH DEFICIT (Δ &gt; 150)</strong>: Critical employer recruitment bottleneck; requires urgent state intervention.</div>
                  <div>• <strong>MODERATE DEFICIT (0 &lt; Δ &le; 150)</strong>: Moderate hiring shortage; solvable with 3-month bridge courses.</div>
                  <div>• <strong>BALANCED / SURPLUS (Δ &le; 0)</strong>: Supply satisfies current industrial demand.</div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Top Hiring Employers:
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {inspectedSector.top_employers.map((emp) => (
                    <span key={emp} style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: "var(--bg-sunken)", fontSize: "12px" }}>
                      {emp}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setInspectedSector(null)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    backgroundColor: "var(--brand-600)",
                    color: "var(--bg-base)",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Close Proof
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Global DSDO Mathematical Scoring Framework */}
      {showMathModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowMathModal(false)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "720px",
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid var(--border-strong)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--brand-50)",
                    color: "var(--brand-600)",
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  DSDO Regional Planning Framework
                </span>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>
                  Labor Economics Mathematical Methodology
                </h3>
              </div>
              <button
                onClick={() => setShowMathModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
              {/* Formula 1: Net Deficit */}
              <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
                  1. Sectoral Net Labor Deficit (Δ_s):
                </strong>
                <div style={{ fontFamily: "monospace", color: "var(--brand-600)", backgroundColor: "var(--bg-surface)", padding: "8px 12px", borderRadius: "6px", fontSize: "13px" }}>
                  Δ_s = Demand_Volume_s - Supply_Volume_s
                </div>
                <p style={{ margin: "8px 0 0 0", color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.5 }}>
                  A positive balance indicates a regional labor shortage where employers cannot fill open requisitions due to missing technical competencies.
                </p>
              </div>

              {/* Formula 2: Subsidy Allocation Priority */}
              <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
                  2. Subsidy Allocation Priority Score:
                </strong>
                <div style={{ fontFamily: "monospace", color: "var(--brand-600)", backgroundColor: "var(--bg-surface)", padding: "8px 12px", borderRadius: "6px", fontSize: "13px" }}>
                  Priority_Score = ( ( Δ_s / ∑ Δ ) × 60 ) + ( YoY_Growth_Rate × 40 )
                </div>
                <p style={{ margin: "8px 0 0 0", color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.5 }}>
                  Allocates state skilling budgets towards programs that simultaneously address the largest numeric shortages while targeting fastest-growing sectors (e.g. Solar EV at +45% YoY growth).
                </p>
              </div>

              {/* Close Button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowMathModal(false)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    backgroundColor: "var(--brand-600)",
                    color: "var(--bg-base)",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Close Framework
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
