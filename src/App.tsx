import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Content,
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

import DashboardPage from "./pages/DashboardPage";
import ReportPage from "./pages/ReportPage";
import AboutPage from "./pages/AboutPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function AppShell() {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Theme theme="g100">
      <Header aria-label="Harmattan">
        <HeaderName
          href="/"
          prefix=""
          onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate("/"); }}
        >
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" style={{ marginRight: 8 }}>
            <circle cx="14" cy="14" r="12" stroke="#ec8b1e" strokeWidth="2" />
            <path d="M8 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#ec8b1e" strokeWidth="2" strokeLinecap="round" />
            <circle cx="14" cy="14" r="2" fill="#ec8b1e" />
          </svg>
          Harmattan
        </HeaderName>

        <HeaderNavigation aria-label="Main">
          <HeaderMenuItem
            href="/"
            isCurrentPage={location.pathname === "/"}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate("/"); }}
          >
            Dashboard
          </HeaderMenuItem>
          <HeaderMenuItem
            href="/analytics"
            isCurrentPage={location.pathname === "/analytics"}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate("/analytics"); }}
          >
            Analytics
          </HeaderMenuItem>
          <HeaderMenuItem
            href="/report"
            isCurrentPage={location.pathname === "/report"}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate("/report"); }}
          >
            Report
          </HeaderMenuItem>
        </HeaderNavigation>

        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label="Report pollution"
            onClick={() => navigate("/report")}
            tooltipAlignment="end"
          >
            <Warning size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="About"
            onClick={() => navigate("/about")}
            tooltipAlignment="end"
          >
            <Information size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>

        <SideNav
          aria-label="Side navigation"
          expanded={sideNavOpen}
          onOverlayClick={() => setSideNavOpen(false)}
          onSideNavBlur={() => setSideNavOpen(false)}
        >
          <SideNavItems>
            <SideNavLink
              renderIcon={DashboardIcon}
              href="/"
              isActive={location.pathname === "/"}
              onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate("/"); setSideNavOpen(false); }}
            >
              Dashboard
            </SideNavLink>
            <SideNavLink
              renderIcon={ChartLineSmooth}
              href="/analytics"
              isActive={location.pathname === "/analytics"}
              onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate("/analytics"); setSideNavOpen(false); }}
            >
              Analytics
            </SideNavLink>
            <SideNavLink
              renderIcon={ReportIcon}
              href="/report"
              isActive={location.pathname === "/report"}
              onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate("/report"); setSideNavOpen(false); }}
            >
              Report Pollution
            </SideNavLink>
            <SideNavLink
              renderIcon={Information}
              href="/about"
              isActive={location.pathname === "/about"}
              onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate("/about"); setSideNavOpen(false); }}
            >
              About
            </SideNavLink>
          </SideNavItems>
        </SideNav>
      </Header>

      <Content>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Content>
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
