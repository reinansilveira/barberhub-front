import { getOwnerDashboardData } from "./owner.service";
import { buildDashboardOverviewStats, resolveTitle } from "./owner.utils";
import type { OwnerView } from "./owner.types";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardContent } from "./components/DashboardContent";
import { getPaymentRevenueChartModel } from "./revenue-chart.utils";
import { DashboardTopbar } from "./components/DashboardTopbar";

export const OwnerDashboard = async ({ view: rawView }: { view?: string }) => {
  const view = (rawView ?? "dashboard") as OwnerView;
  const {
    appointments,
    services,
    payments,
    reviews,
    currentUser,
    notifications,
  } = await getOwnerDashboardData();

  const recent = [...appointments]
    .sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt))
    .slice(0, 6);
  const clients = Array.from(
    new Set(appointments.map((item) => item.client.name)),
  );
  const revenueChartModel = getPaymentRevenueChartModel(payments);
  const title = resolveTitle(view);
  const dashboardStats = buildDashboardOverviewStats(
    appointments,
    payments,
    reviews,
  );

  return (
    <section className="dashboard dashboard-shell">
      <DashboardSidebar activeTitle={title} />

      <div className="dashboard__main dashboard-shell__main">
        <DashboardTopbar
          userName={currentUser.name}
          userAvatar={currentUser.avatar}
          services={services.map((service) => service.name)}
          initialNotifications={notifications}
        />

        <div className="dashboard__content dashboard-shell__content">
          <DashboardContent
            view={view}
            appointments={appointments}
            services={services}
            clients={clients}
            recent={recent}
            dashboardStats={dashboardStats}
            userName={currentUser.name}
            revenueChartModel={revenueChartModel}
            profile={currentUser}
            payments={payments}
          />
        </div>
      </div>
    </section>
  );
};
