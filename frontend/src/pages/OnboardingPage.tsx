// FILE: src/pages/OnboardingPage.tsx
// PURPOSE: Modular coordinator shell for 3-step candidate onboarding: Profile (1), Skills Studio (2), and Target Roles (3).
// PHASE: 8 | DEPENDS ON: React, ./onboarding/OnboardingStepper.tsx, ./onboarding/ProfileStep.tsx, ./onboarding/SkillsStep.tsx, ./onboarding/RolesStep.tsx, ./onboarding/VerificationModal.tsx, ./onboarding/onboardingUtils.ts | LAST TOUCHED: Phase 8

import React, { useState, useEffect, useMemo } from "react";
import type { RoleMatchSummary, StudentProfileData } from "../types/student";
import { saveStudentProfile, getTopRoles, evaluateStudentLocally, ANCHOR_ROLES_DATA } from "../api/client";
import { OnboardingStepper } from "./onboarding/OnboardingStepper";
import { ProfileStep } from "./onboarding/ProfileStep";
import { SkillsStep } from "./onboarding/SkillsStep";
import { RolesStep } from "./onboarding/RolesStep";
import { VerificationModal } from "./onboarding/VerificationModal";
import { DOMAIN_CRITICAL_SKILLS, ARCHETYPE_DECKS, DEFAULT_FALLBACK_ROLE } from "./onboarding/constants";
import { calculateSkillArchetype, calculateRadarPoints, calculateSmartSynergies } from "./onboarding/onboardingUtils";

export { DOMAIN_CRITICAL_SKILLS };

interface OnboardingPageProps {
  onComplete: (profile: StudentProfileData, targetRole: RoleMatchSummary) => void;
  onInstantDemo: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedRoleSlug, setSelectedRoleSlug] = useState<string>("ai-ml-engineer");
  const [predictedRoles, setPredictedRoles] = useState<RoleMatchSummary[]>([]);
  const [isPredictingRoles, setIsPredictingRoles] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const [fullName, setFullName] = useState<string>("");
  const [degreeField, setDegreeField] = useState<string>("Computer Science");
  const [currentYear, setCurrentYear] = useState<number>(2);
  const [collegeName, setCollegeName] = useState<string>("");
  const [skills, setSkills] = useState<{ name: string; level: number }[]>([
    { name: "Python", level: 75 },
    { name: "SQL", level: 70 },
    { name: "Git", level: 60 },
  ]);
  const [newSkillName, setNewSkillName] = useState<string>("");
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>("All");
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [activeArchetypeId, setActiveArchetypeId] = useState<string | null>(null);

  const isAboutYouComplete = fullName.trim().length > 0 && collegeName.trim().length > 0;

  const skillsRecord = useMemo<Record<string, number>>(() => {
    const rec: Record<string, number> = {};
    skills.forEach((s) => { rec[s.name] = s.level; });
    return rec;
  }, [skills]);

  const localRoleRankings = useMemo(() => {
    if (skills.length === 0) return [];
    const scored = ANCHOR_ROLES_DATA.map((role) => ({
      role,
      score: Math.round(evaluateStudentLocally(role, skillsRecord, degreeField).finalScore),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [skillsRecord, degreeField, skills.length]);

  useEffect(() => {
    if (step === 3 && predictedRoles.length === 0 && !isPredictingRoles && skills.length > 0) {
      setIsPredictingRoles(true);
      setPredictionError(null);
      getTopRoles(skillsRecord, degreeField)
        .then((roles) => {
          setPredictedRoles(roles);
          if (roles.length > 0) setSelectedRoleSlug(roles[0].slug);
          setIsPredictingRoles(false);
        })
        .catch((err) => {
          console.error("Failed to predict top roles:", err);
          setPredictionError("Could not calculate role affinities. Please check backend status.");
          setIsPredictingRoles(false);
        });
    }
  }, [step, skillsRecord, degreeField, predictedRoles.length, isPredictingRoles, skills.length]);

  const { totalXP, avgProficiency, dominantArchetype, domainScores } = useMemo(
    () => calculateSkillArchetype(skills),
    [skills]
  );

  const filteredDomainSkills = useMemo(() => {
    return DOMAIN_CRITICAL_SKILLS.map((d) => {
      if (activeDomainFilter !== "All" && d.domain !== activeDomainFilter) return null;
      const matchingSkills = d.skills.filter((s) =>
        s.toLowerCase().includes(skillSearchQuery.toLowerCase().trim())
      );
      return matchingSkills.length > 0 ? { ...d, skills: matchingSkills } : null;
    }).filter(Boolean) as typeof DOMAIN_CRITICAL_SKILLS;
  }, [activeDomainFilter, skillSearchQuery]);

  const smartSynergies = useMemo(() => calculateSmartSynergies(skills), [skills]);
  const radarPoints = useMemo(() => calculateRadarPoints(domainScores), [domainScores]);

  const handleToggleSkill = (name: string, defaultLevel = 70) => {
    const idx = skills.findIndex((s) => s.name.toLowerCase() === name.toLowerCase());
    if (idx >= 0) setSkills(skills.filter((_, i) => i !== idx));
    else setSkills([...skills, { name, level: defaultLevel }]);
  };

  const handleUpdateLevel = (index: number, newLevel: number) => {
    const clamped = Math.max(10, Math.min(100, Math.round(newLevel)));
    const updated = [...skills];
    updated[index].level = clamped;
    setSkills(updated);
  };

  const handleApplyArchetype = (deck: (typeof ARCHETYPE_DECKS)[0]) => {
    setActiveArchetypeId(deck.id);
    setSkills(deck.skills);
  };

  const handleAddCustomSkill = () => {
    const trimmed = newSkillName.trim();
    if (!trimmed) return;
    if (!skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { name: trimmed, level: 70 }]);
    }
    setNewSkillName("");
  };

  const handleLoadDemoPreset = () => {
    setFullName("Aaditya Sharma");
    setCollegeName("Indian Institute of Technology, Roorkee");
    setDegreeField("Computer Science");
    setCurrentYear(3);
    setSkills([
      { name: "Python", level: 85 }, { name: "React", level: 80 },
      { name: "TypeScript", level: 75 }, { name: "Docker", level: 70 },
      { name: "SQL", level: 80 }, { name: "Machine Learning", level: 65 },
      { name: "Git", level: 85 },
    ]);
  };

  const handleFinalSubmit = async () => {
    const selectedRole = predictedRoles.find((r) => r.slug === selectedRoleSlug) || DEFAULT_FALLBACK_ROLE;
    const finalProfile: StudentProfileData = {
      full_name: fullName || "Student",
      institution_name: collegeName || "Verified Institution",
      region: "North",
      department: degreeField,
      degree_field: degreeField,
      current_year_of_study: currentYear,
      graduation_year: 2026,
      career_intent: "Industry Ready Placement",
      target_work_mobility: "Pan-India",
      target_role_slug: selectedRole.slug,
      skills: skillsRecord,
      is_demo_account: false,
    };
    try { await saveStudentProfile(finalProfile); } catch (e) {
      console.warn("Backend profile save skipped/failed, proceeding in-memory:", e);
    }
    onComplete(finalProfile, selectedRole);
  };

  return (
    <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "16px", padding: "32px", boxShadow: "var(--shadow-elevation)" }}>
        <OnboardingStepper step={step} />
        {step === 1 && (
          <ProfileStep
            fullName={fullName} setFullName={setFullName}
            collegeName={collegeName} setCollegeName={setCollegeName}
            degreeField={degreeField} setDegreeField={setDegreeField}
            currentYear={currentYear} setCurrentYear={setCurrentYear}
            isAboutYouComplete={isAboutYouComplete}
            onNext={() => setStep(2)}
            onLoadDemoPreset={handleLoadDemoPreset}
          />
        )}
        {step === 2 && (
          <SkillsStep
            skills={skills} totalXP={totalXP} avgProficiency={avgProficiency}
            dominantArchetype={dominantArchetype} domainScores={domainScores} radarPoints={radarPoints}
            activeArchetypeId={activeArchetypeId} onApplyArchetype={handleApplyArchetype}
            smartSynergies={smartSynergies} onToggleSkill={handleToggleSkill}
            skillSearchQuery={skillSearchQuery} setSkillSearchQuery={setSkillSearchQuery}
            activeDomainFilter={activeDomainFilter} setActiveDomainFilter={setActiveDomainFilter}
            filteredDomainSkills={filteredDomainSkills} newSkillName={newSkillName} setNewSkillName={setNewSkillName}
            onAddCustomSkill={handleAddCustomSkill} onUpdateLevel={handleUpdateLevel}
            onRemoveSkill={(idx) => setSkills(skills.filter((_, i) => i !== idx))}
            onClearAll={() => setSkills([])} localRoleRankings={localRoleRankings}
            onPrev={() => setStep(1)} onNext={() => setStep(3)}
            onOpenVerificationModal={() => setShowVerificationModal(true)}
          />
        )}
        {step === 3 && (
          <RolesStep
            isPredictingRoles={isPredictingRoles} predictionError={predictionError}
            predictedRoles={predictedRoles} selectedRoleSlug={selectedRoleSlug}
            setSelectedRoleSlug={setSelectedRoleSlug} skillsCount={skills.length}
            onPrev={() => setStep(2)} onFinalSubmit={handleFinalSubmit}
          />
        )}
      </div>
      <VerificationModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
    </div>
  );
};
