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

  const completedItems = appointments.filter((item) =>
    isCompleted(item.status)
  );
  const revenue = completedItems.reduce(
    (total, item) => total + Number(item.price || 0),
    0
  );
  const recent = [...appointments]
    .sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt))
    .slice(0, 6);
  const clients = Array.from(
    new Set(appointments.map((item) => item.client.name))
  );
  const kpis = buildKpis(appointments);
  const revenueChartModel = getRevenueChartModel(appointments);
  const title = resolveTitle(view);

  return (
    <section className="dashboard dashboard-shell">
      <DashboardSidebar activeTitle={title} />

      <main className="main dashboard-shell__main">
        <header className="topbar dashboard-shell__topbar">
          <div className="topbar__container">
            <label className="topbarSearch">
              <span aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
              </span>
              <input
                aria-label="Pesquisar"
                placeholder="Pressione / para pesquisar"
              />
            </label>

            <div className="topbarActions">
              <button
                type="button"
                className="dashboard-date-picker"
                aria-label="Selecionar período: 18 de novembro de 2024 a 24 de novembro de 2024"
              >
                <span
                  className="dashboard-date-picker__icon"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 2v3" />
                    <path d="M16 2v3" />
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M3 9h18" />
                  </svg>
                </span>
                <span className="dashboard-date-picker__label">
                  18 Nov 2024 - 24 Nov 2024
                </span>
                <svg
                  className="dashboard-date-picker__chevron"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <span className="topbarActions__divider" aria-hidden="true" />
              <div className="user" aria-hidden="true">
                A
              </div>
              <span className="userName">Admin</span>
            </div>
          </div>
        </header>

        <div className="content dashboard-shell__content">
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
