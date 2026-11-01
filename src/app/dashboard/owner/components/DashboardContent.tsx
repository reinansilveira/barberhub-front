"use client";

import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import type {
  CurrentUser,
  DashboardOverviewStats,
  OwnerView,
  Payment,
} from "../owner.types";
import type { RevenueChartModel } from "../revenue-chart.utils";
import { ClientsPanel } from "./ClientsPanel";
import { DashboardModals } from "./DashboardModals";
import { DashboardOverview } from "./DashboardOverview";
import { ReferencePanels } from "./ReferencePanels";

type DashboardContentProps = {
  view: OwnerView;
  appointments: Appointment[];
  services: Service[];
  clients: string[];
  recent: Appointment[];
  dashboardStats: DashboardOverviewStats;
  userName: string;
  revenueChartModel: RevenueChartModel;
  profile: CurrentUser;
  payments: Payment[];
};

const REFERENCE_VIEWS: ReadonlySet<OwnerView> = new Set([
  "agenda",
  "catalogo",
  "novo-servico",
  "profissionais",
  "metricas",
  "configuracoes",
]);

export const DashboardContent = ({
  view,
  appointments,
  services,
  clients,
  recent,
  dashboardStats,
  userName,
  revenueChartModel,
  profile,
  payments,
}: DashboardContentProps) => (
  <>
    {view === "dashboard" ? (
      <DashboardOverview
        appointments={appointments}
        recent={recent}
        dashboardStats={dashboardStats}
        userName={userName}
        revenueChartModel={revenueChartModel}
        payments={payments}
      />
    ) : view === "clientes" ? (
      <ClientsPanel clients={clients} />
    ) : (
      <ReferencePanels
        view={REFERENCE_VIEWS.has(view) ? view : "configuracoes"}
        revenueChartModel={revenueChartModel}
        profile={profile}
        services={services}
        appointments={appointments}
        payments={payments}
      />
    )}
    <DashboardModals services={services} appointments={appointments} />
  </>
);
