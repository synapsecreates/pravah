// FILE: src/pages/college/CourseAuditsTab.tsx
// PURPOSE: Course syllabus modernization audit with filtering and live status flip trigger.
// PHASE: 8 | DEPENDS ON: React, lucide-react, src/components/PerspectiveCard.tsx, ./types.ts | LAST TOUCHED: Phase 8

import React from "react";
import { BookOpen, AlertTriangle, CheckCircle2, Edit3 } from "lucide-react";
import { PerspectiveCard } from "../../components/PerspectiveCard";
import type { CourseAuditsData, CourseAuditData, CourseFilter } from "./types";

interface CourseAuditsTabProps {
  courseAudits: CourseAuditsData | null;
  courseFilter: CourseFilter;
  setCourseFilter: (filter: CourseFilter) => void;
  filteredCourses: CourseAuditData[];
  onOpenEditCourse: (course: CourseAuditData) => void;
}

export const CourseAuditsTab: React.FC<CourseAuditsTabProps> = ({
  courseAudits,
  courseFilter,
  setCourseFilter,
  filteredCourses,
  onOpenEditCourse,
}) => {
  return (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                Curriculum Syllabus Modernization Audit &amp; Status Flip Engine
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                AICTE curriculum compliance auditor. Modernizing course skills dynamically re-evaluates alignment and flips status from <code>OBSOLETE</code> to <code>ALIGNED</code>.
              </p>
            </div>

            {/* Course Filter buttons */}
            <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-sunken)", padding: "3px", borderRadius: "8px" }}>
              {(["ALL", "OBSOLETE", "AT RISK", "ALIGNED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setCourseFilter(st)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: courseFilter === st ? "var(--brand-600)" : "transparent",
                    color: courseFilter === st ? "var(--bg-base)" : "var(--text-secondary)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Audited Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px" }}>
            {filteredCourses.map((course) => (
              <PerspectiveCard key={course.id} style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "6px",
                        backgroundColor: "var(--bg-sunken)",
                        color: "var(--brand-600)",
                        fontSize: "11px",
                        fontWeight: 700,
                        marginRight: "8px",
                      }}
                    >
                      {course.course_code}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor:
                          course.status === "OBSOLETE"
                            ? "rgba(239, 68, 68, 0.15)"
                            : course.status === "AT RISK"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                        color:
                          course.status === "OBSOLETE"
                            ? "#ef4444"
                            : course.status === "AT RISK"
                            ? "#d97706"
                            : "#059669",
                      }}
                    >
                      {course.status} ({course.alignment_score.toFixed(0)}%)
                    </span>
                  </div>

                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>
                    Priority: {course.syllabus_modernization_priority}
                  </span>
                </div>

                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {course.course_name}
                </h3>

                {/* Currently Mapped Skills */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                    CURRENTLY MAPPED SKILLS
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {course.mapped_skills.map((skill) => (
                      <span
                        key={skill}
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
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modernization Recommendation */}
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-sunken)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    marginBottom: "16px",
                    flex: 1,
                  }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>Modernization Fix:</strong> {course.recommended_action}
                </div>

                {/* Modernize Action CTA */}
                <button
                  type="button"
                  onClick={() => onOpenEditCourse(course)}
                  className="interactive-btn"
                  style={{
                    padding: "9px 14px",
                    borderRadius: "8px",
                    backgroundColor: course.status === "ALIGNED" ? "var(--bg-surface)" : "var(--brand-600)",
                    border: course.status === "ALIGNED" ? "1px solid var(--border-strong)" : "none",
                    color: course.status === "ALIGNED" ? "var(--text-primary)" : "var(--bg-base)",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  <Edit3 size={14} />
                  <span>
                    {course.status === "ALIGNED" ? "Review & Edit Syllabus" : "Modernize Syllabus & Flip Status"}
                  </span>
                </button>
              </PerspectiveCard>
            ))}
          </div>
        </div>


  );
};
