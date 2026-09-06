"use client";

import { useState } from "react";
import type { Appointment } from "@/services/appointment";
import { Download, MoreHorizontal, Plus, UsersRound, WalletCards } from "lucide-react";
import { currency, initials, timeText } from "../../_shared/dashboard.utils";
import { AppointmentStatusAction } from "./AppointmentStatusAction";
import { AppointmentStatusBadge } from "@/components/shadcn/AppointmentStatusBadge";
import { DashboardStats } from "./DashboardStats";
import { RevenueLineChart } from "@/components/shadcn/RevenueLineChart";
import { ServiceRadialChart } from "@/components/shadcn/ServiceRadialChart";
import { Rating } from "@/components/reui/rating";

type RevenuePeriod = "week" | "month" | "year";
import {
  type DashboardOverviewProps,
  useDashboardOverview,
} from "../hooks/use-dashboard-overview";

export const DashboardOverview = ({
  appointments,
  services,
  recent,
  revenue,
  completedCount,
  dashboardStats,
  userName,
  onNewAppointment,
  revenueChartModel,
}: DashboardOverviewProps) => {
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("week");
  const { fallback, statusText } = useDashboardOverview(appointments, services);
  const periodNames: Record<RevenuePeriod, string> = {
    week: "semanal",
    month: "mensal",
    year: "anual",
  };
  const periodTotals: Record<RevenuePeriod, number> = {
    week: 9970,
    month: 32900,
    year: 226100,
  };

  const rows = (recent.length ? recent : fallback).slice(0, 5) as Array<
    Appointment & { service?: string }
  >;
  const teamPerformance = ["Enzo Ribeiro", "Mateo Silva", "Lucas Mendes"].map(
    (fallbackName) => {
      const matchingAppointments = appointments.filter((item) =>
        item.professional?.name?.toLowerCase().includes(fallbackName.split(" ")[0].toLowerCase())
      );
      return {
        name: matchingAppointments[0]?.professional?.name || fallbackName,
        clients: matchingAppointments.length,
        revenue: matchingAppointments.reduce((total, item) => total + Number(item.price || 0), 0),
      };
    }
  );

  return (
    <div className="referenceDashboard dashboard-overview">
      <section className="dashboardGreeting">
        <div>
          <h1>Bom dia, {userName}</h1>
          <p>Veja como sua barbearia está performando nesta semana.</p>
        </div>
        <div className="dashboardGreetingActions">
          <button>
            <Download aria-hidden="true" size={14} /> Exportar
          </button>
          <button
            type="button"
            className="dashboardGreetingActions__primary dashboard-action-button"
            onClick={onNewAppointment}
          >
            <Plus aria-hidden="true" size={14} />
            Novo agendamento
          </button>
        </div>
      </section>

      <DashboardStats dashboardStats={dashboardStats} />

      <section className="referenceAnalytics dashboard-overview__analytics">
        <article className="referencePanel earningChart">
          <div className="referencePanelHead">
            <div>
              <h2>Receita {periodNames[revenuePeriod]}</h2>
              <strong>
                {currency.format(periodTotals[revenuePeriod])}{" "}
                <span className="up">↗ +12,5%</span>
              </strong>
            </div>
            <div className="chartTabs">
              {(
                [
                  ["week", "Semana"],
                  ["month", "Mês"],
                  ["year", "Ano"],
                ] as const
              ).map(([period, label]) => (
                <button
                  key={period}
                  type="button"
                  className={revenuePeriod === period ? "is-active" : ""}
                  onClick={() => setRevenuePeriod(period)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <RevenueLineChart model={revenueChartModel} period={revenuePeriod} />
        </article>

        <article className="referencePanel serviceBreakdown">
          <div className="referencePanelHead">
            <div>
              <h2>Mix de serviços</h2>
              <p>Distribuição desta semana</p>
            </div>
            <button>
              <MoreHorizontal aria-hidden="true" />
            </button>
          </div>
          <ServiceRadialChart total={128} />
        </article>
      </section>

      <section className="referenceTables">
        <article className="referencePanel recentTable">
          <div className="referencePanelHead">
            <div>
              <h2>Agendamentos recentes</h2>
              <p>Acompanhe todos os seus agendamentos</p>
            </div>
            <a href="/dashboard?view=agenda">Ver todos ›</a>
          </div>

          <table className="appointmentsTable">
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
              {rows.map((item, index) => {
                const source = item as unknown as {
                  service?: { name?: string } | string;
                };
                const service =
                  typeof source.service === "string"
                    ? source.service
                    : source.service?.name ||
                      fallback[index]?.service ||
                      "Corte de cabelo";
                const staff = ["Enzo", "Mateo", "Lucas"][index] ?? "Enzo";

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="cellClient">
                        <i className="avatar">{initials(item.client.name)}</i>
                        <span>{item.client.name}</span>
                      </div>
                    </td>
                    <td>{service}</td>
                    <td>
                      <div className="cellStaff">
                        <i className={`avatar avatar--sm avatar--staff-${index + 1}`}>{staff.slice(0, 1)}</i>
                        <span>{staff}</span>
                      </div>
                    </td>
                    <td>{timeText.format(new Date(item.scheduledAt))}</td>
                    <td className="cellPrice">
                      {currency.format(
                        Number(item.price || fallback[index]?.price || 0)
                      )}
                    </td>
                    <td>
                      <div className="cellStatus">
                        <AppointmentStatusBadge status={statusText(item.status)} />
                        <AppointmentStatusAction id={item.id} status={item.status} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </article>

        <div className="referenceSide">
          <article className="referencePanel nextUp">
          <div className="referencePanelHead">
            <div>
              <h2>Próximos</h2>
              <p><span className="nextUp__live">Ao vivo</span></p>
            </div>
            <a href="/dashboard?view=agenda">Ver todos</a>
          </div>
          {rows.slice(0, 3).map((item, index) => (
            <div className="nextItem" key={`next-${item.id}`}>
              <i>{initials(item.client.name)}</i>
              <div>
                <b>{item.client.name}</b>
                <span>{index === 0 ? "Corte clássico · Enzo" : index === 1 ? "Barba · Mateo" : "Combo completo · Lucas"}</span>
              </div>
              <strong>
                {index === 0
                  ? "Em 15 min"
                  : index === 1
                    ? "Em 40 min"
                    : "Em 1h 10min"}
              </strong>
            </div>
          ))}
          </article>

          <article className="referencePanel teamPerformance">
            <div className="referencePanelHead">
              <div>
                <h2>Performance da equipe</h2>
                <p>Resultados deste período</p>
              </div>
              <UsersRound aria-hidden="true" size={16} />
            </div>
            <div className="teamPerformance__list">
              {teamPerformance.map((member, index) => (
                <div className="teamPerformance__item" key={member.name}>
                  <i className={`teamPerformance__avatar teamPerformance__avatar--${index + 1}`}>
                    {member.name.slice(0, 1)}
                  </i>
                  <div className="teamPerformance__person">
                    <strong>{member.name}</strong>
                    <span><Rating rating={Number((["4,9", "4,8", "4,7"][index]).replace(",", "."))} showValue /> · {member.clients} clientes</span>
                  </div>
                  <b>{currency.format(member.revenue)}</b>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="balanceCard">
        <div className="balanceIcon">
          <WalletCards aria-hidden="true" />
        </div>
        <div>
          <span>Sua carteira</span>
          <p>Saldo disponível para transferência</p>
        </div>
        <strong>{currency.format(14280)}</strong>
        <div className="walletActions">
          <button aria-label="Wallet details">↗</button>
          <button aria-label="More wallet actions">⋮</button>
        </div>
        <footer>
          <b>Sacar saldo</b>
          <span>Histórico de pagamentos</span>
          <span>Adicionar forma de pagamento</span>
        </footer>
      </section>
    </div>
  );
};
