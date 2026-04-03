import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuButton,
  SideNav,
  SideNavItems,
  SideNavLink,
  Theme,
} from "@carbon/react";
import {
  Dashboard as DashboardIcon,
  Report as ReportIcon,
  Information,
  ChartLineSmooth,
  Warning,
} from "@carbon/react/icons";
import { useState } from "react";

import DashboardPage from "./pages/DashboardPage";
import ReportPage from "./pages/ReportPage";
import AboutPage from "./pages/AboutPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function AppShell() {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    setSideNavOpen(false);
  };

  return (
    <Theme theme="g100">
      <Header aria-label="Harmattan">
        <HeaderMenuButton
          aria-label="Menu"
          onClick={() => setSideNavOpen(!sideNavOpen)}
          isActive={sideNavOpen}
        />
        <HeaderName href="/" prefix="" onClick={go("/")}>
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" style={{ marginRight: 8 }}>
            <circle cx="14" cy="14" r="12" stroke="#ec8b1e" strokeWidth="2" />
            <path d="M8 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#ec8b1e" strokeWidth="2" strokeLinecap="round" />
            <circle cx="14" cy="14" r="2" fill="#ec8b1e" />
          </svg>
          Harmattan
        </HeaderName>

        <HeaderNavigation aria-label="Main">
          <HeaderMenuItem href="/" isCurrentPage={location.pathname === "/"} onClick={go("/")}>
            Dashboard
          </HeaderMenuItem>
          <HeaderMenuItem href="/analytics" isCurrentPage={location.pathname === "/analytics"} onClick={go("/analytics")}>
            Analytics
          </HeaderMenuItem>
          <HeaderMenuItem href="/report" isCurrentPage={location.pathname === "/report"} onClick={go("/report")}>
            Report
          </HeaderMenuItem>
          <HeaderMenuItem href="/about" isCurrentPage={location.pathname === "/about"} onClick={go("/about")}>
            About
          </HeaderMenuItem>
        </HeaderNavigation>

        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Report pollution" onClick={() => navigate("/report")} tooltipAlignment="end">
            <Warning size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>

        <SideNav
          aria-label="Side navigation"
          expanded={sideNavOpen}
          isPersistent={false}
          onOverlayClick={() => setSideNavOpen(false)}
          onSideNavBlur={() => setSideNavOpen(false)}
        >
          <SideNavItems>
            <SideNavLink renderIcon={DashboardIcon} href="/" isActive={location.pathname === "/"} onClick={go("/")}>
              Dashboard
            </SideNavLink>
            <SideNavLink renderIcon={ChartLineSmooth} href="/analytics" isActive={location.pathname === "/analytics"} onClick={go("/analytics")}>
              Analytics
            </SideNavLink>
            <SideNavLink renderIcon={ReportIcon} href="/report" isActive={location.pathname === "/report"} onClick={go("/report")}>
              Report Pollution
            </SideNavLink>
            <SideNavLink renderIcon={Information} href="/about" isActive={location.pathname === "/about"} onClick={go("/about")}>
              About
            </SideNavLink>
          </SideNavItems>
        </SideNav>
      </Header>

      {/* Main content — no Carbon <Content>, we handle padding ourselves */}
      <main style={{ paddingTop: 48, minHeight: "100vh" }}>
        <div style={{ maxWidth: 1584, margin: "0 auto", padding: "24px 16px 64px" }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </main>
    </Theme>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
