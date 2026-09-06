import { getOwnerDashboardData } from "./owner.service";
import { buildKpis, resolveTitle } from "./owner.utils";
import { isCompleted } from "../_shared/dashboard.utils";
import type {
  DashboardOverviewStats,
  OwnerDashboardData,
  OwnerView,
} from "./owner.types";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardContent } from "./components/DashboardContent";
import { getRevenueChartModel } from "./hooks/use-revenue-chart";
import { DashboardTopbar } from "./components/DashboardTopbar";

export async function OwnerDashboard({ view: rawView }: { view?: string }) {
  const view = (rawView ?? "dashboard") as OwnerView;
  const { appointments, services, payments, reviews, currentUser } = await getOwnerDashboardData();

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
  const dashboardStats = buildDashboardOverviewStats(appointments, payments, reviews);

  return (
    <section className="dashboard dashboard-shell">
      <DashboardSidebar activeTitle={title} />

      <main className="main dashboard-shell__main">
        <DashboardTopbar userName={currentUser.name} userAvatar={currentUser.avatar} services={services.map((service) => service.name)} />

        <div className="content dashboard-shell__content">
          <DashboardContent
            view={view}
            appointments={appointments}
            services={services}
            clients={clients}
            recent={recent}
            revenue={revenue}
            completedCount={completedItems.length}
            dashboardStats={dashboardStats}
            userName={currentUser.name}
            kpis={kpis}
            revenueChartModel={revenueChartModel}
            profile={currentUser}
          />
        </div>
      </main>
    </section>
  );
}

function dayKey(value: string | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function buildDashboardOverviewStats(
  appointments: OwnerDashboardData["appointments"],
  payments: OwnerDashboardData["payments"],
  reviews: OwnerDashboardData["reviews"]
): DashboardOverviewStats {
  const today = dayKey(new Date());
  const activeAppointments = appointments.filter((item) => !/cancel/i.test(item.status));
  const todayAppointments = activeAppointments.filter((item) => dayKey(item.scheduledAt) === today);
  const firstAppointmentByClient = new Map<string, string>();

  activeAppointments.forEach((item) => {
    const clientKey = item.client.id ?? item.client.name;
    const first = firstAppointmentByClient.get(clientKey);
    if (!first || new Date(item.scheduledAt) < new Date(first)) {
      firstAppointmentByClient.set(clientKey, item.scheduledAt);
    }
  });

  const activeReviews = reviews.filter((review) => review.active);
  const averageRating = activeReviews.length
    ? activeReviews.reduce((total, review) => total + review.rating, 0) / activeReviews.length
    : null;
  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating: String(rating),
    count: activeReviews.filter((review) => Math.round(review.rating) === rating).length,
  }));

  return {
    todayEarnings: payments
      .filter((payment) => payment.paidAt && dayKey(payment.paidAt) === today)
      .reduce((total, payment) => total + Number(payment.finalAmount), 0),
    todayAppointments: todayAppointments.length,
    completedToday: todayAppointments.filter((item) => /complete/i.test(item.status)).length,
    newClientsToday: Array.from(firstAppointmentByClient.values()).filter(
      (scheduledAt) => dayKey(scheduledAt) === today
    ).length,
    satisfaction: averageRating === null ? null : Math.round((averageRating / 5) * 100),
    reviewCount: activeReviews.length,
    ratingDistribution,
  };
}
