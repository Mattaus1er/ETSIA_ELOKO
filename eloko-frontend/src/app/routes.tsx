import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MarketsPage } from "./pages/MarketsPage";
import { AIPredictivePage } from "./pages/AIPredictivePage";
import { ProjectSimulatorPage } from "./pages/ProjectSimulatorPage";
import { RiskRegisterPage } from "./pages/RiskRegisterPage";
import { BillingPage } from "./pages/BillingPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ActualitesPage } from "./pages/ActualitesPage";
import { AdminPage } from "./pages/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "markets", Component: MarketsPage },
      { path: "ai-predictive", Component: AIPredictivePage },
      { path: "project-simulator", Component: ProjectSimulatorPage },
      { path: "risk-register", Component: RiskRegisterPage },
      { path: "billing", Component: BillingPage },
      { path: "notifications", Component: NotificationsPage },
      { path: "actualites", Component: ActualitesPage },
      { path: "admin", Component: AdminPage },
    ],
  },
]);
