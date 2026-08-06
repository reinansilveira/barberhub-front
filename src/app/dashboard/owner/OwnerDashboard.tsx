import { getOwnerDashboardData } from "./owner.service";
import { buildKpis, resolveTitle } from "./owner.utils";
import { isCompleted } from "../_shared/dashboard.utils";
import type { OwnerView } from "./owner.types";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardContent } from "./components/DashboardContent";
import { getRevenueChartModel } from "./hooks/use-revenue-chart";

export async function OwnerDashboard({ view: rawView }: { view?: string }) {
  const view = (rawView ?? "dashboard") as OwnerView;
  const { appointments, services } = await getOwnerDashboardData();

  const completedItems = appointments.filter((item) => isCompleted(item.status));
  const revenue = completedItems.reduce((total, item) => total + Number(item.price || 0), 0);
  const recent = [...appointments]
    .sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt))
    .slice(0, 6);
  const clients = Array.from(new Set(appointments.map((item) => item.client.name)));
  const kpis = buildKpis(appointments);
  const revenueChartModel = getRevenueChartModel(appointments);
  const title = resolveTitle(view);

  return (
    <section className="dashboard">
      <DashboardSidebar activeTitle={title} />

      <main className="main">
        <header>
          <div>
            <small>PAINEL DO PROFISSIONAL</small>
            <h1>{title}</h1>
          </div>
          <div className="user">R</div>
        </header>

        <div className="content">
          <DashboardContent
            view={view}
            appointments={appointments}
            services={services}
            clients={clients}
            recent={recent}
            revenue={revenue}
            completedCount={completedItems.length}
            kpis={kpis}
            revenueChartModel={revenueChartModel}
          />
        </div>
      </main>
    </section>
  );
}
