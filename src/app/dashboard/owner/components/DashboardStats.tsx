import { CalendarDays, Star, UsersRound } from "lucide-react";
import { SatisfactionLineChart } from "@/components/shadcn/SatisfactionLineChart";
import { currency } from "../../_shared/dashboard.utils";
import type { DashboardOverviewStats } from "../owner.types";

type DashboardStatsProps = {
  dashboardStats: DashboardOverviewStats;
};

const satisfactionFallback = [
  { rating: "1", count: 1 },
  { rating: "2", count: 4 },
  { rating: "3", count: 8 },
  { rating: "4", count: 14 },
  { rating: "5", count: 22 },
];

export const DashboardStats = ({ dashboardStats }: DashboardStatsProps) => {
  const hasReviews = dashboardStats.reviewCount > 0;
  const satisfaction = hasReviews ? dashboardStats.satisfaction : 92;
  const chartData = hasReviews
    ? dashboardStats.ratingDistribution
    : satisfactionFallback;

  return (
    <section className="referenceStats dashboard-overview__stats">
    <article>
      <div>
        <span className="refStatIcon green">$</span>
        <p>Faturamento de hoje</p>
      </div>
      <strong>{currency.format(dashboardStats.todayEarnings)}</strong>
      <small>Pagamentos recebidos hoje</small>
    </article>

    <article>
      <div>
        <span className="refStatIcon violet">
          <CalendarDays aria-hidden="true" />
        </span>
        <p>Agendamentos</p>
      </div>
      <strong>{dashboardStats.todayAppointments}</strong>
      <small>{dashboardStats.completedToday} concluídos, {Math.max(dashboardStats.todayAppointments - dashboardStats.completedToday, 0)} pendentes</small>
    </article>

    <article>
      <div>
        <span className="refStatIcon orange">
          <UsersRound aria-hidden="true" />
        </span>
        <p>Novos clientes</p>
      </div>
      <strong>{dashboardStats.newClientsToday}</strong>
      <small>Primeiro agendamento hoje</small>
    </article>

    <article className={`satisfaction${hasReviews ? "" : " satisfaction--fallback"}`}>
      <div>
        <span className="refStatIcon yellow">
          <Star aria-hidden="true" fill="currentColor" />
        </span>
        <p>Taxa de retenção</p>
      </div>
      <strong>{satisfaction === null ? "—" : `${satisfaction}%`}</strong>
      <SatisfactionLineChart data={chartData} />
      <small>
        {hasReviews
          ? `${dashboardStats.reviewCount} avaliações no total`
          : "Com base nas avaliações recentes"}
      </small>
      <span className="sr-only">
        {hasReviews
          ? `${dashboardStats.reviewCount} avaliações`
          : "Dados demonstrativos"}
      </span>
    </article>
    </section>
  );
};
