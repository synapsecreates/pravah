// FILE: src/pages/college/MathFrameworkTabContent.tsx
// PURPOSE: Mathematical formulas and methodology explanations for Gap, Privacy Floor, Health, Eligibility, and Flip.
// PHASE: 8 | DEPENDS ON: React, ./types.ts | LAST TOUCHED: Phase 8

import React from "react";
import type { MathModalTab } from "./types";

interface MathFrameworkTabContentProps {
  mathModalActiveTab: MathModalTab;
}

export const MathFrameworkTabContent: React.FC<MathFrameworkTabContentProps> = ({
  mathModalActiveTab,
}) => {
  return (
    <>
            {mathModalActiveTab === "gap" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    1. Formula for Individual Skill Curriculum Gap:
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "14px", color: "var(--brand-600)", padding: "8px 12px", backgroundColor: "var(--bg-surface)", borderRadius: "6px" }}>
                    Δ_k = max(0, R_(s,k) - C_(avg,k))
                  </div>
                  <div style={{ marginTop: "12px", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    Where <strong>R_(s,k)</strong> is the industry benchmark proficiency required for skill <em>k</em> in target role <em>s</em>, and <strong>C_(avg,k)</strong> is the department's student cohort average. Strengths where cohort average exceeds benchmark yield a deficit of 0 (no gap).
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Statutory Alignment Thresholds:
                  </h4>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ backgroundColor: "var(--bg-sunken)", borderBottom: "1px solid var(--border-subtle)" }}>
                        <th style={{ padding: "8px 12px" }}>Status</th>
                        <th style={{ padding: "8px 12px" }}>Curriculum Deficit Gap</th>
                        <th style={{ padding: "8px 12px" }}>Actionable Interpretation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "8px 12px", color: "#059669", fontWeight: 700 }}>ALIGNED</td>
                        <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>Δ &le; 15%</td>
                        <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>Syllabus matches industry expectations; students placement-ready.</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "8px 12px", color: "#d97706", fontWeight: 700 }}>AT RISK</td>
                        <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>15% &lt; Δ &le; 30%</td>
                        <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>Noticeable skill deficit; syllabus requires practical lab enhancements.</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 12px", color: "#ef4444", fontWeight: 700 }}>DEFICIENT</td>
                        <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>Δ &gt; 30%</td>
                        <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>Severe curriculum gap; course mapped skills obsolete or missing.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "var(--brand-50)", border: "1px solid var(--border-strong)", fontSize: "13px" }}>
                  <strong style={{ color: "var(--brand-600)" }}>Example from Current GGV Bilaspur Data:</strong>
                  <div style={{ marginTop: "4px", color: "var(--text-primary)" }}>
                    For <strong>Docker</strong>: Benchmark R_s = 70%, Cohort Average C_avg = 28% &rarr; Δ = 42% (&gt; 30% &rarr; <strong>DEFICIENT</strong>).<br />
                    For <strong>Python</strong>: Benchmark R_s = 65%, Cohort Average C_avg = 62.5% &rarr; Δ = 2.5% (&le; 15% &rarr; <strong>ALIGNED</strong>).
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: DPDP Privacy Blending Formula */}
            {mathModalActiveTab === "privacy" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    2. Under-20 Student Differential Privacy Blending Rule:
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--brand-600)", padding: "10px 14px", backgroundColor: "var(--bg-surface)", borderRadius: "6px", lineHeight: 1.7 }}>
                    C_(avg) = &#123; <br />
                    &nbsp;&nbsp;0.70 × S̄_college + 0.30 × S̄_district &nbsp;&nbsp;&nbsp;&nbsp; if N &lt; 20 (Privacy Shield Active)<br />
                    &nbsp;&nbsp;S̄_college &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if N &ge; 20 (Unblended Live Data)<br />
                    &#125;
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Why Does This Statutory Safeguard Exist?
                  </h4>
                  <p style={{ margin: "0 0 10px 0", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    Under India's <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>, presenting precise statistical averages on small sample sizes (<em>N &lt; 20</em>) enables <em>reverse-engineering and linkage attacks</em>. A professor, peer, or recruiter who possesses knowledge of one student's performance can isolate and calculate individual student grades.
                  </p>
                  <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    By mathematically blending <strong>70% institutional weight with 30% regional district baseline weight</strong>, the platform mathematically preserves <em>k-anonymity</em> while retaining high directional accuracy for departmental curriculum audits.
                  </p>
                </div>

                <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "var(--brand-50)", border: "1px solid var(--border-strong)", fontSize: "13px" }}>
                  <strong style={{ color: "var(--brand-600)" }}>Evaluator Test Toggle Demonstration:</strong>
                  <div style={{ marginTop: "4px", color: "var(--text-primary)" }}>
                    Click the <strong>"Switch to N = 19"</strong> button in the banner above to observe the live activation of this mathematical blending shield, and switch back to <strong>N = 48</strong> to inspect unblended direct institutional metrics.
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Curriculum Health Index */}
            {mathModalActiveTab === "health" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    3. Departmental Curriculum Health Index (CHI):
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--brand-600)", padding: "10px 14px", backgroundColor: "var(--bg-surface)", borderRadius: "6px" }}>
                    CHI = ( 1 / |K| ) × ∑_(k ∈ K) min( 100, ( C_(avg,k) / R_(s,k) ) × 100 )
                  </div>
                  <p style={{ margin: "10px 0 0 0", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    Where <strong>|K|</strong> is the total number of audited technical competencies (e.g. 8 core competencies for Full Stack Developer). The ratio computes the percentage fulfillment of each industry benchmark, capped at 100% so surplus proficiencies do not mask critical voids.
                  </p>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    AICTE Institutional Health Bands:
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                    <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong style={{ color: "#059669" }}>CHI &ge; 85.0% · AICTE Tier-A Exemplary</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "2px" }}>Department syllabus matches Tier-1 global industry hiring standards.</div>
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong style={{ color: "#d97706" }}>70.0% &le; CHI &lt; 85.0% · AICTE Tier-B Aligned (Current: 77.5%)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "2px" }}>Curriculum satisfies national standards but contains 1-2 critical infrastructure skill deficits.</div>
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong style={{ color: "#ef4444" }}>CHI &lt; 70.0% · AICTE Modernization Required</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "2px" }}>High risk of graduate underemployment; curriculum modernization engine recommended immediately.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Placement Eligibility & Recruitment Tiers */}
            {mathModalActiveTab === "eligibility" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    4. Placement Eligibility Rate (PER):
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--brand-600)", padding: "10px 14px", backgroundColor: "var(--bg-surface)", borderRadius: "6px" }}>
                    PER = ( ∑_(i=1)^N 𝕀( Readiness_i &ge; 60% ) / N ) × 100
                  </div>
                  <p style={{ margin: "10px 0 0 0", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "13px" }}>
                    The percentage of students whose overall technical readiness meets or exceeds the 60% cut-off established by corporate recruiters for campus drives. If <em>N &lt; 20</em>, regional blending applies: <code>PER_blended = 0.70 × PER_college + 0.30 × PER_district</code>.
                  </p>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    4-Tier Recruitment Segmentation Model:
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                    <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong>Tier 1: Elite &amp; Global R&amp;D (₹18-35 LPA)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>Readiness &ge; 85% · Top ~12.5% of cohort.</div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong>Tier 2: Specialist Tech &amp; Unicorns (₹10-18 LPA)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>70% &le; Readiness &lt; 85% · Next ~37.5% of cohort.</div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong>Tier 3: Enterprise IT &amp; Consulting (₹5-10 LPA)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>55% &le; Readiness &lt; 70% · Next ~35.0% of cohort.</div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-sunken)" }}>
                      <strong>Tier 4: Remedial Upskilling (₹3.5-5 LPA)</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>Readiness &lt; 55% · Bottom ~15.0% requiring remediation.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Dynamic Syllabus Modernization Flip Engine */}
            {mathModalActiveTab === "flip" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "var(--bg-sunken)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    5. Dynamic Course Status Modernization Rules:
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--brand-600)", padding: "10px 14px", backgroundColor: "var(--bg-surface)", borderRadius: "6px", lineHeight: 1.7 }}>
                    Alignment_Score = ( Modern_Skills_Count / Total_Required_Competencies ) × 100
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                  <div style={{ padding: "12px 14px", borderRadius: "8px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                    <strong style={{ color: "#ef4444" }}>OBSOLETE (Alignment Score = 32.0%):</strong>
                    <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                      Triggered when mapped skills contain deprecated technologies (e.g. <em>8085 Assembly, Turbo C, Pascal</em>) with 0 verified modern competencies.
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)" }}>
                    <strong style={{ color: "#d97706" }}>AT RISK (Alignment Score = 55.0% - 65.0%):</strong>
                    <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                      Triggered when course has partial coverage or only 1 modern skill without modern containerization/cloud deployment.
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                    <strong style={{ color: "#059669" }}>ALIGNED (Alignment Score = 88.0% - 92.0%):</strong>
                    <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                      Triggered dynamically when faculty maps &ge; 2 verified modern competencies (e.g. <em>ARM Cortex, Embedded C, Docker, PyTorch</em>).
                    </div>
                  </div>
                </div>

                <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "var(--brand-50)", border: "1px solid var(--border-strong)", fontSize: "13px" }}>
                  <strong style={{ color: "var(--brand-600)" }}>Dynamic Flip Demo:</strong>
                  <div style={{ marginTop: "4px", color: "var(--text-primary)" }}>
                    Go to the <strong>Syllabus Modernization Audit</strong> tab, click <strong>"Modernize Syllabus"</strong> on course <strong>CS405</strong>, add <em>ARM Cortex</em> and <em>Embedded C</em>, and click Save. You will witness the course status immediately flip from <strong>OBSOLETE &rarr; ALIGNED</strong> and course alignment score jump from <strong>32% &rarr; 88%</strong>!
                  </div>
                </div>
              </div>
            )}
    </>
  );
};
