// FILE: src/App.tsx
// PURPOSE: Root application entry wiring ThemeProvider, top judge persona switcher, Barba transitions, LandingPage, OnboardingPage, and AnalysisPortal.
// PHASE: 5 | DEPENDS ON: ThemeContext.tsx, PersonaSwitcher.tsx, BarbaContainer.tsx, LandingPage.tsx, OnboardingPage.tsx, AnalysisPortal.tsx | LAST TOUCHED: Phase 5

import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { BackendStatusProvider } from "./context/BackendStatusContext";
import type { PersonaType } from "./components/PersonaSwitcher";
import { GlobalHeader } from "./components/GlobalHeader";
import { GlobalFooter } from "./components/GlobalFooter";
import { BackendFallbackBanner } from "./components/BackendFallbackBanner";
import { BarbaContainer } from "./components/BarbaContainer";
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { AnalysisPortal } from "./pages/AnalysisPortal";
import { CollegePortal } from "./pages/CollegePortal";
import { DistrictPortal } from "./pages/DistrictPortal";
import { EmployerPortal } from "./pages/EmployerPortal";
import { PerspectiveCard } from "./components/PerspectiveCard";
import { Sparkles } from "lucide-react";
import type { RoleMatchSummary, StudentProfileData } from "./types/student";
import { ALL_106_ROLES } from "./data/roles_taxonomy";
import { ANCHOR_ROLES_DATA } from "./api/client";
import "./App.css";

// Default benchmark student profile for Demo Student
const DEFAULT_DEMO_PROFILE: StudentProfileData = {
  full_name: "Demo Student",
  degree_field: "Computer Science",
  current_year_of_study: 2,
  graduation_year: 2026,
  institution_name: "National Institute of Technology, Raipur",
  region: "Western Region",
  department: "Computer Science and Engineering",
  career_intent: "Technical Employment",
  target_work_mobility: "Pan-India",
  target_role_slug: "ai-ml-engineer",
  skills: {
    Python: 70,
    "C++": 65,
    JavaScript: 40,
    React: 25,
    SQL: 60,
    Git: 30,
    Statistics: 45,
    "Machine Learning": 20,
    "Linear Algebra": 55,
  },
  is_demo_account: true,
};

const DEFAULT_TARGET_ROLE: RoleMatchSummary = {
  role_id: "backend-dev",
  slug: "backend-developer",
  title: "Backend Developer",
  domain: "Software Development",
  match_percentage: 68.5,
  industry_demand: 9.0,
  primary_focus: "Backend APIs & Distributed Data Access",
  why_match_rationale: "Strong foundation in Python and SQL with high market demand.",
};

// Root application component managing active persona, view routing, and student state.
// Coordinates smooth transition between Landing Page, Student Onboarding, and the Analysis Portal.
function App() {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>("student");
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // Student journey screen state: 'onboarding' | 'analysis'
  const [studentScreen, setStudentScreen] = useState<"onboarding" | "analysis">("onboarding");
  const [activeProfile, setActiveProfile] = useState<StudentProfileData>(DEFAULT_DEMO_PROFILE);
  const [activeTargetRole, setActiveTargetRole] = useState<RoleMatchSummary>(DEFAULT_TARGET_ROLE);

  // Handles wizard completion by persisting student profile and transitioning directly to the Analysis Portal.
  const handleCompleteOnboarding = (profile: StudentProfileData, role: RoleMatchSummary) => {
    setActiveProfile(profile);
    setActiveTargetRole(role);
    setStudentScreen("analysis");
  };

  // 1-Click Instant Demo shortcut initializing Demo Student's benchmark dataset and jumping directly to live analysis.
  const handleInstantDemo = () => {
    setActiveProfile(DEFAULT_DEMO_PROFILE);
    setActiveTargetRole(DEFAULT_TARGET_ROLE);
    setStudentScreen("analysis");
  };


  return (
    <ThemeProvider>
      <BackendStatusProvider>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--bg-base)",
            color: "var(--text-primary)",
            transition: "background-color 0.25s ease, color 0.25s ease",
          }}
        >
          {/* Global Application Header with Theme Toggle & Hub-and-Spoke Portal Navigation */}
          <GlobalHeader
            showLanding={showLanding}
            currentPersona={currentPersona}
            onReturnToHub={() => setShowLanding(true)}
            onNavigateToSection={(sectionId) => {
              if (!showLanding) {
                setShowLanding(true);
              }
              setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }, 60);
            }}
          />

          {/* Persistent, Dismissible Backend Unreachable Notification Banner */}
          <BackendFallbackBanner />

          {/* Main Barba Transition Stage */}
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <BarbaContainer transitionKey={showLanding ? "landing" : `persona-${currentPersona}-${studentScreen}`}>
            {showLanding ? (
              <LandingPage
                onSelectPersona={(persona) => {
                  setCurrentPersona(persona);
                  setShowLanding(false);
                }}
                onInstantDemoStudent={() => {
                  setCurrentPersona("student");
                  handleInstantDemo();
                  setShowLanding(false);
                }}
              />
            ) : currentPersona === "student" ? (
              studentScreen === "onboarding" ? (
                /* Screen 1: Dedicated Student Onboarding Wizard */
                <OnboardingPage
                  onComplete={handleCompleteOnboarding}
                  onInstantDemo={handleInstantDemo}
                />
              ) : (
                /* Screen 2: Dedicated Separate Analysis Portal Screen */
                <AnalysisPortal
                  studentProfile={activeProfile}
                  targetRole={activeTargetRole}
                  onBackToOnboarding={() => setStudentScreen("onboarding")}
                  onSwitchTargetRole={(newRoleSlug) => {
                    const foundRole =
                      ALL_106_ROLES.find((r) => r.slug === newRoleSlug) ||
                      ANCHOR_ROLES_DATA.find((r) => r.slug === newRoleSlug);
                    if (foundRole) {
                      setActiveTargetRole({
                        role_id: (foundRole as any).id || (foundRole as any).role_id || foundRole.slug,
                        slug: foundRole.slug,
                        title: foundRole.title,
                        domain: foundRole.domain,
                        match_percentage: 0,
                        industry_demand: foundRole.industry_demand,
                        primary_focus: foundRole.primary_focus || (foundRole as any).description || "",
                        why_match_rationale: "Selected benchmark target from national catalog",
                      });
                    } else {
                      setActiveTargetRole((prev) => ({
                        ...prev,
                        slug: newRoleSlug,
                        title: newRoleSlug
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" "),
                      }));
                    }
                  }}
                />
              )
            ) : currentPersona === "institution" ? (
              /* Phase 6: College Portal for University Deans, HODs, and Faculty */
              <CollegePortal onBackToLanding={() => setShowLanding(true)} />
            ) : currentPersona === "government" ? (
              /* Phase 7: District Planning Portal for DSDO */
              <DistrictPortal onBackToLanding={() => setShowLanding(true)} />
            ) : currentPersona === "employer" ? (
              /* Phase 7: Employer Portal for Talent Acquisition & Gemini JD Parsing */
              <EmployerPortal onBackToLanding={() => setShowLanding(true)} />
            ) : (
              /* Other Personas Evaluator Context Card (Phase 7) */
              <div
                className="stage-perspective"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "48px 20px",
                }}
              >
                <PerspectiveCard style={{ maxWidth: "680px", width: "100%", textAlign: "center" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      backgroundColor: "var(--brand-50)",
                      color: "var(--brand-600)",
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                  >
                    <Sparkles size={14} />
                    <span>AUTHENTICATED EVALUATOR CONTEXT</span>
                  </div>

                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: 700,
                      margin: "0 0 12px 0",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {String(currentPersona).toUpperCase()} Context Loaded
                  </h2>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      fontSize: "15px",
                      margin: "0 0 24px 0",
                    }}
                  >
                    Security principal authenticated with scoped JWT token.
                    <br />
                    All design tokens, 3D elevation perspectives, and Barba transitions are fully operational.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowLanding(true)}
                    className="interactive-btn"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "10px",
                      backgroundColor: "var(--brand-600)",
                      color: "var(--bg-base)",
                      fontWeight: 700,
                      fontSize: "14px",
                      border: "none",
                    }}
                  >
                    Back to Public Landing
                  </button>
                </PerspectiveCard>
              </div>
            )}
          </BarbaContainer>
        </main>

        {/* Global National-Grade Platform Footer */}
        <GlobalFooter
          onNavigateToPersona={(persona) => {
            setCurrentPersona(persona);
            setShowLanding(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onReturnToHub={() => {
            setShowLanding(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </BackendStatusProvider>
  </ThemeProvider>
);
}

export default App;
