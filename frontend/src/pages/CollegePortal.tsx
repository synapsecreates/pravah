// FILE: src/pages/CollegePortal.tsx
// PURPOSE: Modular coordinator shell for University Deans, HODs, and faculty intelligence terminal.
// PHASE: 8 | DEPENDS ON: React, src/api/client.ts, ./college/* | LAST TOUCHED: Phase 8

import React, { useState, useEffect, useMemo } from "react";
import {
  getInstitutions, getInstitutionOverview, getDepartmentHeatmap,
  getCourseAudits, updateCourseSkills, getPlacementEligibility,
  type InstitutionItem, type InstitutionOverviewData, type DepartmentHeatmapData,
  type CourseAuditsData, type CourseAuditData, type PlacementEligibilityData,
} from "../api/client";
import type { FormulaModalSkill, MathModalTab, PortalTab, HeatmapFilter, CourseFilter } from "./college/types";
import { CollegeHeader } from "./college/CollegeHeader";
import { OverviewTab } from "./college/OverviewTab";
import { HeatmapTab } from "./college/HeatmapTab";
import { CourseAuditsTab } from "./college/CourseAuditsTab";
import { PlacementTiersTab } from "./college/PlacementTiersTab";
import { FormulaInspectionModal } from "./college/FormulaInspectionModal";
import { MathFrameworkModal } from "./college/MathFrameworkModal";
import { SyllabusEditorModal } from "./college/SyllabusEditorModal";

interface CollegePortalProps {
  onBackToLanding?: () => void;
}

export const CollegePortal: React.FC<CollegePortalProps> = () => {
  const [institutions, setInstitutions] = useState<InstitutionItem[]>([]);
  const [selectedInstId, setSelectedInstId] = useState<string>("ggv-bilaspur");
  const [selectedDept, setSelectedDept] = useState<string>("Computer Science & Engineering");
  const [selectedTargetRole, setSelectedTargetRole] = useState<string>("fullstack-developer");
  const [simulatedCohortSize, setSimulatedCohortSize] = useState<number>(48);

  const [overview, setOverview] = useState<InstitutionOverviewData | null>(null);
  const [heatmap, setHeatmap] = useState<DepartmentHeatmapData | null>(null);
  const [courseAudits, setCourseAudits] = useState<CourseAuditsData | null>(null);
  const [placementData, setPlacementData] = useState<PlacementEligibilityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<PortalTab>("overview");
  const [formulaModalSkill, setFormulaModalSkill] = useState<FormulaModalSkill | null>(null);
  const [showMathFrameworkModal, setShowMathFrameworkModal] = useState<boolean>(false);
  const [mathModalActiveTab, setMathModalActiveTab] = useState<MathModalTab>("gap");

  const [editingCourse, setEditingCourse] = useState<CourseAuditData | null>(null);
  const [editSkillsList, setEditSkillsList] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState<string>("");
  const [isUpdatingCourse, setIsUpdatingCourse] = useState<boolean>(false);
  const [updateNotification, setUpdateNotification] = useState<string | null>(null);

  const [heatmapFilter, setHeatmapFilter] = useState<HeatmapFilter>("ALL");
  const [courseFilter, setCourseFilter] = useState<CourseFilter>("ALL");

  useEffect(() => {
    if (showMathFrameworkModal || formulaModalSkill || editingCourse) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showMathFrameworkModal, formulaModalSkill, editingCourse]);

  useEffect(() => {
    getInstitutions()
      .then((data) => {
        setInstitutions(data);
        if (data.length > 0 && !data.some((i) => i.id === selectedInstId)) {
          setSelectedInstId(data[0].id);
        }
      })
      .catch((err) => console.error("Error loading institutions:", err));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ov, hm, ca, pe] = await Promise.all([
        getInstitutionOverview(selectedInstId, simulatedCohortSize),
        getDepartmentHeatmap(selectedInstId, selectedDept, selectedTargetRole, simulatedCohortSize),
        getCourseAudits(selectedInstId, selectedDept),
        getPlacementEligibility(selectedInstId, selectedDept, simulatedCohortSize),
      ]);
      setOverview(ov);
      setHeatmap(hm);
      setCourseAudits(ca);
      setPlacementData(pe);
    } catch (err) {
      console.error("Failed to load college portal datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedInstId, selectedDept, selectedTargetRole, simulatedCohortSize]);

  const handleOpenEditCourse = (course: CourseAuditData) => {
    setEditingCourse(course);
    setEditSkillsList([...course.mapped_skills]);
    setCustomSkillInput("");
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !editSkillsList.includes(trimmed)) {
      setEditSkillsList([...editSkillsList, trimmed]);
      setCustomSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setEditSkillsList(editSkillsList.filter((s) => s !== skill));
  };

  const handleSaveModernizedSyllabus = async () => {
    if (!editingCourse) return;
    setIsUpdatingCourse(true);
    try {
      const updated = await updateCourseSkills(selectedInstId, editingCourse.id, editSkillsList);
      if (courseAudits) {
        const newCourses = courseAudits.courses.map((c) => (c.id === updated.id ? updated : c));
        const alignedCount = newCourses.filter((c) => c.status === "ALIGNED").length;
        const atRiskCount = newCourses.filter((c) => c.status === "AT RISK").length;
        const obsoleteCount = newCourses.filter((c) => c.status === "OBSOLETE").length;
        setCourseAudits({
          ...courseAudits,
          courses: newCourses,
          aligned_courses_count: alignedCount,
          at_risk_courses_count: atRiskCount,
          obsolete_courses_count: obsoleteCount,
        });
      }
      setUpdateNotification(
        `Dynamic Modernization Applied: ${updated.course_code} (${updated.course_name}) status dynamically flipped to ${updated.status} (Alignment Score: ${updated.alignment_score.toFixed(1)}%)!`
      );
      setTimeout(() => setUpdateNotification(null), 8000);
      setEditingCourse(null);
      fetchData();
    } catch (err) {
      console.error("Failed to modernize course syllabus:", err);
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  const filteredHeatmapSkills = useMemo(() => {
    if (!heatmap) return [];
    if (heatmapFilter === "ALL") return heatmap.skills;
    return heatmap.skills.filter((s) => s.alignment_status === heatmapFilter);
  }, [heatmap, heatmapFilter]);

  const filteredCourses = useMemo(() => {
    if (!courseAudits) return [];
    if (courseFilter === "ALL") return courseAudits.courses;
    return courseAudits.courses.filter((c) => c.status === courseFilter);
  }, [courseAudits, courseFilter]);

  return (
    <div style={{ maxWidth: "1520px", margin: "0 auto", padding: "24px 20px 60px 20px", color: "var(--text-primary)" }}>
      <CollegeHeader
        overview={overview} institutions={institutions} selectedInstId={selectedInstId}
        setSelectedInstId={setSelectedInstId} selectedDept={selectedDept} setSelectedDept={setSelectedDept}
        updateNotification={updateNotification} setUpdateNotification={setUpdateNotification}
        simulatedCohortSize={simulatedCohortSize}
        onOpenMathFramework={(tab) => { if (tab) setMathModalActiveTab(tab); setShowMathFrameworkModal(true); }}
        onToggleCohortSize={() => setSimulatedCohortSize((prev) => (prev < 20 ? 48 : 19))}
        activeTab={activeTab} setActiveTab={setActiveTab} courseAudits={courseAudits}
      />

      {loading && !overview ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-secondary)" }}>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>Loading institutional datasets...</p>
        </div>
      ) : (
        <>
          {activeTab === "overview" && (
            <OverviewTab
              overview={overview} heatmap={heatmap} courseAudits={courseAudits} placementData={placementData}
              onOpenMathFramework={(tab) => { if (tab) setMathModalActiveTab(tab); setShowMathFrameworkModal(true); }}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "heatmap" && (
            <HeatmapTab
              heatmap={heatmap} selectedTargetRole={selectedTargetRole} setSelectedTargetRole={setSelectedTargetRole}
              heatmapFilter={heatmapFilter} setHeatmapFilter={setHeatmapFilter} filteredHeatmapSkills={filteredHeatmapSkills}
              onInspectProof={(skill) => setFormulaModalSkill(skill)}
            />
          )}

          {activeTab === "syllabus" && (
            <CourseAuditsTab
              courseAudits={courseAudits} courseFilter={courseFilter} setCourseFilter={setCourseFilter}
              filteredCourses={filteredCourses} onOpenEditCourse={handleOpenEditCourse}
            />
          )}

          {activeTab === "placement" && (
            <PlacementTiersTab placementData={placementData} />
          )}
        </>
      )}

      <FormulaInspectionModal
        formulaModalSkill={formulaModalSkill} simulatedCohortSize={simulatedCohortSize} targetRole={heatmap?.target_role} onClose={() => setFormulaModalSkill(null)}
      />

      <MathFrameworkModal
        showMathFrameworkModal={showMathFrameworkModal} mathModalActiveTab={mathModalActiveTab}
        setMathModalActiveTab={setMathModalActiveTab} onClose={() => setShowMathFrameworkModal(false)}
      />

      <SyllabusEditorModal
        editingCourse={editingCourse} editSkillsList={editSkillsList} customSkillInput={customSkillInput}
        setCustomSkillInput={setCustomSkillInput} isUpdatingCourse={isUpdatingCourse} onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill} onSaveModernizedSyllabus={handleSaveModernizedSyllabus}
        onClose={() => setEditingCourse(null)}
      />
    </div>
  );
};
