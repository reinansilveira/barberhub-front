import { CalendarDays, Star, UsersRound } from "lucide-react";
import { SatisfactionLineChart } from "@/components/shadcn/SatisfactionLineChart";
import { currency } from "../../_shared/dashboard.utils";
import type { DashboardOverviewStats } from "../owner.types";

type DashboardStatsProps = {
  dashboardStats: DashboardOverviewStats;
};

export const DashboardStats = ({ dashboardStats }: DashboardStatsProps) => {
  const hasReviews = dashboardStats.reviewCount > 0;
  const satisfaction = dashboardStats.satisfaction;
  const chartData = dashboardStats.ratingDistribution;

  return (
    <section className="owner-overview__stats dashboard-overview__stats">
      <article>
        <div>
          <span className="owner-overview__stat-icon owner-overview__stat-icon--green">
            $
          </span>
          <p>Faturamento de hoje</p>
        </div>
        <strong>{currency.format(dashboardStats.todayEarnings)}</strong>
        <small>Pagamentos recebidos hoje</small>
      </article>

      <article>
        <div>
          <span className="owner-overview__stat-icon owner-overview__stat-icon--violet">
            <CalendarDays aria-hidden="true" />
          </span>
          <p>Agendamentos</p>
        </div>
        <strong>{dashboardStats.todayAppointments}</strong>
        <small>
          {dashboardStats.completedToday} concluídos,{" "}
          {Math.max(
            dashboardStats.todayAppointments - dashboardStats.completedToday,
            0,
          )}{" "}
          pendentes
        </small>
      </article>

      <article>
        <div>
          <span className="owner-overview__stat-icon owner-overview__stat-icon--orange">
            <UsersRound aria-hidden="true" />
          </span>
          <p>Novos clientes</p>
        </div>
        <strong>{dashboardStats.newClientsToday}</strong>
        <small>Primeiro agendamento hoje</small>
      </article>

      <article
        className={`satisfaction${hasReviews ? "" : " satisfaction--fallback"}`}
      >
        <div>
          <span className="owner-overview__stat-icon owner-overview__stat-icon--yellow">
            <Star aria-hidden="true" fill="currentColor" />
          </span>
          <p>Satisfação</p>
        </div>
        <strong>{satisfaction === null ? "—" : `${satisfaction}%`}</strong>
        <SatisfactionLineChart data={chartData} />
        <small>
          {hasReviews
            ? `${dashboardStats.reviewCount} avaliações no total`
            : "Nenhuma avaliação recebida"}
        </small>
        <span className="sr-only">
          {hasReviews
            ? `${dashboardStats.reviewCount} avaliações`
            : "Sem avaliações"}
        </span>
      </article>
    </section>
  );
};
