// FILE: src/App.tsx
// PURPOSE: Root application entry wiring React Router DOM client routing (/ landing, /onboarding, /analysis, /college, /district, /employer), Framer Motion RouteTransition, ThemeProvider, and BackendStatusProvider.
// PHASE: 8 | DEPENDS ON: react-router-dom, ThemeContext.tsx, BackendStatusContext.tsx, RouteTransition.tsx, LandingPage.tsx, OnboardingPage.tsx, AnalysisPortal.tsx, CollegePortal.tsx, DistrictPortal.tsx, EmployerPortal.tsx | LAST TOUCHED: Phase 8

import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { BackendStatusProvider } from "./context/BackendStatusContext";
import type { PersonaType } from "./components/PersonaSwitcher";
import { GlobalHeader } from "./components/GlobalHeader";
import { GlobalFooter } from "./components/GlobalFooter";
import { BackendFallbackBanner } from "./components/BackendFallbackBanner";
import { RouteTransition } from "./components/RouteTransition";
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { AnalysisPortal } from "./pages/AnalysisPortal";
import { CollegePortal } from "./pages/CollegePortal";
import { DistrictPortal } from "./pages/DistrictPortal";
import { EmployerPortal } from "./pages/EmployerPortal";
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

const getStoredProfile = (): StudentProfileData => {
  try {
    const saved = sessionStorage.getItem("pravah_active_profile");
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return DEFAULT_DEMO_PROFILE;
};

const getStoredTargetRole = (): RoleMatchSummary => {
  try {
    const saved = sessionStorage.getItem("pravah_active_target_role");
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return DEFAULT_TARGET_ROLE;
};

// Persona route redirect handler for /portal/:persona
const PersonaRedirect = () => {
  const { persona } = useParams<{ persona: string }>();
  if (persona === "institution") return <Navigate to="/college" replace />;
  if (persona === "government") return <Navigate to="/district" replace />;
  if (persona === "employer") return <Navigate to="/employer" replace />;
  if (persona === "student") return <Navigate to="/onboarding" replace />;
  return <Navigate to="/" replace />;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeProfile, setActiveProfile] = useState<StudentProfileData>(getStoredProfile);
  const [activeTargetRole, setActiveTargetRole] = useState<RoleMatchSummary>(getStoredTargetRole);

  // Derive persona and landing view directly from active URL route path
  const getPersonaFromPath = (path: string): PersonaType => {
    if (path.startsWith("/college") || path.startsWith("/institution")) return "institution";
    if (path.startsWith("/district") || path.startsWith("/government")) return "government";
    if (path.startsWith("/employer")) return "employer";
    return "student";
  };

  const currentPersona = getPersonaFromPath(location.pathname);
  const showLanding = location.pathname === "/";

  // Handles persona selection across landing page, header, and footer
  const handleSelectPersona = (persona: PersonaType) => {
    switch (persona) {
      case "student":
        navigate("/onboarding");
        break;
      case "institution":
        navigate("/college");
        break;
      case "government":
        navigate("/district");
        break;
      case "employer":
        navigate("/employer");
        break;
      default:
        navigate("/");
        break;
    }
  };

  // Handles wizard completion by persisting student profile and transitioning directly to the Analysis Portal
  const handleCompleteOnboarding = (profile: StudentProfileData, role: RoleMatchSummary) => {
    setActiveProfile(profile);
    setActiveTargetRole(role);
    try {
      sessionStorage.setItem("pravah_active_profile", JSON.stringify(profile));
      sessionStorage.setItem("pravah_active_target_role", JSON.stringify(role));
    } catch (_) {}
    navigate("/analysis");
  };

  // 1-Click Instant Demo shortcut initializing Demo Student's benchmark dataset and jumping directly to live analysis
  const handleInstantDemo = () => {
    setActiveProfile(DEFAULT_DEMO_PROFILE);
    setActiveTargetRole(DEFAULT_TARGET_ROLE);
    try {
      sessionStorage.setItem("pravah_active_profile", JSON.stringify(DEFAULT_DEMO_PROFILE));
      sessionStorage.setItem("pravah_active_target_role", JSON.stringify(DEFAULT_TARGET_ROLE));
    } catch (_) {}
    navigate("/analysis");
  };

  const handleSwitchTargetRole = (newRoleSlug: string) => {
    const foundRole =
      ALL_106_ROLES.find((r) => r.slug === newRoleSlug) ||
      ANCHOR_ROLES_DATA.find((r) => r.slug === newRoleSlug);
    let updatedRole: RoleMatchSummary;
    if (foundRole) {
      updatedRole = {
        role_id: (foundRole as any).id || (foundRole as any).role_id || foundRole.slug,
        slug: foundRole.slug,
        title: foundRole.title,
        domain: foundRole.domain,
        match_percentage: 0,
        industry_demand: foundRole.industry_demand,
        primary_focus: foundRole.primary_focus || (foundRole as any).description || "",
        why_match_rationale: "Selected benchmark target from national catalog",
      };
    } else {
      updatedRole = {
        ...activeTargetRole,
        slug: newRoleSlug,
        title: newRoleSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      };
    }
    setActiveTargetRole(updatedRole);
    try {
      sessionStorage.setItem("pravah_active_target_role", JSON.stringify(updatedRole));
    } catch (_) {}
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
            onReturnToHub={() => navigate("/")}
            onSwitchPersona={handleSelectPersona}
            onNavigateToSection={(sectionId) => {
              if (location.pathname !== "/") {
                navigate("/");
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

          {/* Main Framer Motion Transition Stage wrapping React Router DOM Routes */}
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <RouteTransition transitionKey={location.pathname}>
              <Routes location={location} key={location.pathname}>
                {/* 1. Public National Landing Page */}
                <Route
                  path="/"
                  element={
                    <LandingPage
                      onSelectPersona={handleSelectPersona}
                      onInstantDemoStudent={handleInstantDemo}
                    />
                  }
                />

                {/* 2. Student Persona Routes */}
                <Route
                  path="/onboarding"
                  element={
                    <OnboardingPage
                      onComplete={handleCompleteOnboarding}
                      onInstantDemo={handleInstantDemo}
                    />
                  }
                />
                <Route
                  path="/analysis"
                  element={
                    <AnalysisPortal
                      studentProfile={activeProfile}
                      targetRole={activeTargetRole}
                      onBackToOnboarding={() => navigate("/onboarding")}
                      onSwitchTargetRole={handleSwitchTargetRole}
                    />
                  }
                />

                {/* 3. Academic Institution Portal Routes */}
                <Route
                  path="/college"
                  element={<CollegePortal onBackToLanding={() => navigate("/")} />}
                />
                <Route
                  path="/institution"
                  element={<Navigate to="/college" replace />}
                />

                {/* 4. District Planning Portal Routes */}
                <Route
                  path="/district"
                  element={<DistrictPortal onBackToLanding={() => navigate("/")} />}
                />
                <Route
                  path="/government"
                  element={<Navigate to="/district" replace />}
                />

                {/* 5. Industry Employer Portal Routes */}
                <Route
                  path="/employer"
                  element={<EmployerPortal onBackToLanding={() => navigate("/")} />}
                />

                {/* 6. Persona Route Segment Aliases */}
                <Route path="/portal/:persona" element={<PersonaRedirect />} />

                {/* 7. Fallback Catch-All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </RouteTransition>
          </main>

          {/* Global National-Grade Platform Footer */}
          <GlobalFooter
            onNavigateToPersona={(persona) => {
              handleSelectPersona(persona);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onReturnToHub={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </BackendStatusProvider>
    </ThemeProvider>
  );
}

export default App;
