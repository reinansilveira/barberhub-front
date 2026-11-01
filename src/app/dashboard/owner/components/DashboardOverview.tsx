"use client";

import {
  ArrowUpRight,
  Download,
  Plus,
  UsersRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import type { Appointment } from "@/services/appointment";
import { AppointmentStatusBadge } from "@/components/shadcn/AppointmentStatusBadge";
import { RevenueLineChart } from "@/components/shadcn/RevenueLineChart";
import { ServiceRadialChart } from "@/components/shadcn/ServiceRadialChart";
import { cn } from "@/utils/class-names";
import { currency, initials, timeText } from "../../_shared/dashboard.utils";
import {
  REVENUE_PERIOD_NAMES,
  REVENUE_PERIODS,
  formatTimeUntil,
  getAppointmentStatusText,
  getServiceName,
} from "../dashboard-overview.utils";
import { exportFinancialReport } from "../financial-report";
import { useDashboardOverview } from "../hooks/use-dashboard-overview";
import type { RevenueChartModel } from "../revenue-chart.utils";
import type { DashboardOverviewStats, Payment } from "../owner.types";
import { AppointmentStatusAction } from "./AppointmentStatusAction";
import { DashboardStats } from "./DashboardStats";

type DashboardOverviewProps = {
  appointments: Appointment[];
  recent: Appointment[];
  dashboardStats: DashboardOverviewStats;
  userName: string;
  revenueChartModel: RevenueChartModel;
  payments: Payment[];
};

export const DashboardOverview = ({
  appointments,
  recent,
  dashboardStats,
  userName,
  revenueChartModel,
  payments,
}: DashboardOverviewProps) => {
  const overview = useDashboardOverview({ appointments, recent, payments });

  return (
    <div className="owner-overview dashboard-overview">
      <section className="owner-overview__greeting">
        <div>
          <h1>
            {overview.greeting}, {userName}
          </h1>
          <p>Veja como sua barbearia está performando nesta semana.</p>
        </div>
        <div className="owner-overview__greeting-actions">
          <button type="button" onClick={() => exportFinancialReport(payments)}>
            <Download aria-hidden="true" size={14} /> Exportar
          </button>
          <button
            type="button"
            className="owner-overview__primary-action dashboard-action-button"
            onClick={overview.openNewAppointment}
          >
            <Plus aria-hidden="true" size={14} />
            Novo agendamento
          </button>
        </div>
      </section>

      <DashboardStats dashboardStats={dashboardStats} />

      <section className="owner-overview__analytics dashboard-overview__analytics">
        <article className="reference-panel owner-overview__earnings">
          <div className="reference-panel__head">
            <div>
              <h2>Receita {REVENUE_PERIOD_NAMES[overview.revenuePeriod]}</h2>
              <strong>
                {currency.format(
                  overview.revenueTotals[overview.revenuePeriod],
                )}{" "}
              </strong>
            </div>
            <div className="owner-overview__chart-tabs">
              {REVENUE_PERIODS.map(([period, label]) => (
                <button
                  key={period}
                  type="button"
                  className={cn(
                    "owner-overview__chart-tab",
                    overview.revenuePeriod === period &&
                      "owner-overview__chart-tab--active",
                  )}
                  onClick={() => overview.setRevenuePeriod(period)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <RevenueLineChart
            model={revenueChartModel}
            period={overview.revenuePeriod}
          />
        </article>

        <article className="reference-panel owner-overview__service-mix">
          <div className="reference-panel__head">
            <div>
              <h2>Mix de serviços</h2>
              <p>Distribuição desta semana</p>
            </div>
          </div>
          {overview.serviceMix.items.length ? (
            <ServiceRadialChart
              total={overview.serviceMix.total}
              data={overview.serviceMix.items}
            />
          ) : (
            <p className="empty">Sem atendimentos concluídos no período.</p>
          )}
        </article>
      </section>

      <section className="owner-overview__tables">
        <article className="reference-panel owner-overview__recent">
          <div className="reference-panel__head">
            <div>
              <h2>Agendamentos recentes</h2>
              <p>Acompanhe todos os seus agendamentos</p>
            </div>
            <a href="/dashboard?view=agenda">Ver todos ›</a>
          </div>

          <table className="appointments-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Barbeiro</th>
                <th>Horário</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {overview.recentAppointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              )}
              {overview.recentAppointments.map((item, index) => {
                const staff = item.professional?.name || "Não informado";

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="appointments-table__client">
                        <i className="avatar">{initials(item.client.name)}</i>
                        <span>{item.client.name}</span>
                      </div>
                    </td>
                    <td>{getServiceName(item)}</td>
                    <td>
                      <div className="appointments-table__staff">
                        <i
                          className={`avatar avatar--sm avatar--staff-${index + 1}`}
                        >
                          {staff.slice(0, 1)}
                        </i>
                        <span>{staff}</span>
                      </div>
                    </td>
                    <td>{timeText.format(new Date(item.scheduledAt))}</td>
                    <td className="appointments-table__price">
                      {currency.format(Number(item.price || 0))}
                    </td>
                    <td>
                      <div className="appointments-table__status">
                        <AppointmentStatusBadge
                          status={getAppointmentStatusText(item.status)}
                        />
                        <AppointmentStatusAction
                          id={item.id}
                          status={item.status}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </article>

        <div className="owner-overview__side">
          <article className="reference-panel next-up">
            <div className="reference-panel__head">
              <div>
                <h2>Próximos</h2>
                <p>
                  <span className="next-up__live">Ao vivo</span>
                </p>
              </div>
              <a href="/dashboard?view=agenda">Ver todos</a>
            </div>
            {overview.upcoming.length === 0 && (
              <p className="empty">Nenhum agendamento futuro.</p>
            )}
            {overview.upcoming.map((item) => (
              <div className="next-up__item" key={`next-${item.id}`}>
                <i>{initials(item.client.name)}</i>
                <div>
                  <b>{item.client.name}</b>
                  <span>
                    {item.service?.name ?? "Serviço"} ·{" "}
                    {item.professional?.name ?? "Profissional"}
                  </span>
                </div>
                <strong>
                  {formatTimeUntil(item.scheduledAt, overview.now)}
                </strong>
              </div>
            ))}
          </article>

          <article className="reference-panel team-performance">
            <div className="reference-panel__head">
              <div>
                <h2>Performance da equipe</h2>
                <p>Resultados deste período</p>
              </div>
              <UsersRound aria-hidden="true" size={16} />
            </div>
            <div className="team-performance__list">
              {overview.teamPerformance.map((member, index) => (
                <div className="team-performance__item" key={member.name}>
                  <i
                    className={`team-performance__avatar team-performance__avatar--${index + 1}`}
                  >
                    {member.name.slice(0, 1)}
                  </i>
                  <div className="team-performance__person">
                    <strong>{member.name}</strong>
                    <span>
                      {member.clients}{" "}
                      {member.clients === 1 ? "cliente" : "clientes"}
                    </span>
                  </div>
                  <b>{currency.format(member.revenue)}</b>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="balance-card">
        <div className="balance-card__icon">
          <WalletCards aria-hidden="true" />
        </div>
        <div>
          <span>Pagamentos recebidos</span>
          <p>Total pago pelos clientes até hoje</p>
        </div>
        <strong>{currency.format(overview.walletBalance)}</strong>
        <div className="balance-card__actions">
          <Link
            href="/dashboard?view=metricas"
            aria-label="Abrir relatório financeiro"
          >
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <footer>
          <Link href="/dashboard?view=metricas">Ver financeiro</Link>
          <button type="button" onClick={() => exportFinancialReport(payments)}>
            Baixar relatório (CSV)
          </button>
        </footer>
      </section>
    </div>
  );
};
