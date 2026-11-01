"use client";

import { Scissors } from "lucide-react";
import type { Appointment } from "@/services/appointment";
import type { ProfessionalResponseDto } from "@/services/professional";
import type { Service } from "@/services/service";
import { RevenueLineChart } from "@/components/shadcn/RevenueLineChart";
import { cn } from "@/utils/class-names";
import { currency } from "../../_shared/dashboard.utils";
import {
  usePerformanceMetrics,
  usePerformanceTable,
} from "../hooks/use-reference-performance";
import { MiniStats } from "./ReferencePanelPrimitives";

export const PerformanceMetrics = ({
  name,
  kind,
  appointments,
}: {
  name: string;
  kind: "barber" | "service";
  appointments: Appointment[];
}) => {
  const {
    period,
    setPeriod,
    isBarber,
    entityAppointments,
    completed,
    totalRevenue,
    periodTotals,
    chartModel,
  } = usePerformanceMetrics({ name, kind, appointments });
  const periodNames = {
    week: "semanal",
    month: "mensal",
    year: "anual",
  } as const;

  return (
    <div className="metrics-view__content">
      <div className="metrics-view__heading">
        <div>
          <span>
            {isBarber ? "Desempenho do barbeiro" : "Desempenho do serviço"}
          </span>
          <h2>{name}</h2>
          <p>Visão geral dos resultados no período selecionado.</p>
        </div>
      </div>
      <MiniStats
        items={
          isBarber
            ? [
                ["calendar", "Atendimentos", String(completed.length), ""],
                ["wallet", "Receita gerada", currency.format(totalRevenue), ""],
                [
                  "users",
                  "Clientes únicos",
                  String(
                    new Set(
                      entityAppointments.map(
                        (item) => item.client.id ?? item.client.name,
                      ),
                    ).size,
                  ),
                  "",
                ],
                [
                  "pending",
                  "Ticket médio",
                  currency.format(
                    completed.length ? totalRevenue / completed.length : 0,
                  ),
                  "",
                ],
              ]
            : [
                [
                  "calendar",
                  "Agendamentos",
                  String(entityAppointments.length),
                  "",
                ],
                ["wallet", "Receita", currency.format(totalRevenue), ""],
                [
                  "users",
                  "Clientes únicos",
                  String(
                    new Set(
                      entityAppointments.map(
                        (item) => item.client.id ?? item.client.name,
                      ),
                    ).size,
                  ),
                  "",
                ],
                [
                  "pending",
                  "Duração média",
                  `${
                    entityAppointments.length
                      ? Math.round(
                          entityAppointments.reduce(
                            (total, item) => total + Number(item.duration || 0),
                            0,
                          ) / entityAppointments.length,
                        )
                      : 0
                  } min`,
                  "",
                ],
              ]
        }
      />
      <section className="reference-panel revenue-overview metrics-view__chart">
        <div className="metrics-view__chart-head">
          <div>
            <h2>Receita {periodNames[period]}</h2>
            <strong>{currency.format(periodTotals[period])}</strong>
          </div>
          <div
            className="metrics-view__periods"
            role="group"
            aria-label="Período da receita"
          >
            {(["week", "month", "year"] as const).map((item) => (
              <button
                type="button"
                className={cn(
                  "metrics-view__period",
                  period === item && "metrics-view__period--active",
                )}
                aria-pressed={period === item}
                onClick={() => setPeriod(item)}
                key={item}
              >
                {item === "week" ? "Semana" : item === "month" ? "Mês" : "Ano"}
              </button>
            ))}
          </div>
        </div>
        <RevenueLineChart model={chartModel} period={period} />
      </section>
    </div>
  );
};

export const PerformanceTable = ({
  title,
  service = false,
  professionals = [],
  services = [],
  appointments,
}: {
  title: string;
  service?: boolean;
  professionals?: ProfessionalResponseDto[];
  services?: Service[];
  appointments: Appointment[];
}) => {
  const { period, setPeriod, rows } = usePerformanceTable({
    service,
    professionals,
    services,
    appointments,
  });

  return (
    <section className="reference-panel performance-table">
      <div className="reference-panel__head">
        <h2>{title}</h2>
        <div className="performance-table__filters">
          <button
            type="button"
            className={cn(
              "performance-table__filter",
              period === "month" && "performance-table__filter--active",
            )}
            aria-pressed={period === "month"}
            onClick={() => setPeriod("month")}
          >
            Este mês
          </button>
          <button
            type="button"
            className={cn(
              "performance-table__filter",
              period === "week" && "performance-table__filter--active",
            )}
            aria-pressed={period === "week"}
            onClick={() => setPeriod("week")}
          >
            Esta semana
          </button>
        </div>
      </div>
      <div className="performance-table__head">
        <span>#</span>
        <span>{service ? "Service" : "Barber"}</span>
        <span>{service ? "Total de agendamentos" : "Agendamentos"}</span>
        <span>Receita</span>
        <span>Ticket médio</span>
        <span>Concluídos</span>
        <span>Status</span>
      </div>
      {rows.length === 0 && (
        <p className="empty">Nenhum dado disponível no período.</p>
      )}
      {rows.map((row, index) => (
        <div className="performance-table__row" key={row.id}>
          <b>{index + 1}</b>
          <span>
            <i>
              {service ? <Scissors aria-hidden="true" /> : row.name.slice(0, 2)}
            </i>
            <strong>{row.name}</strong>
            <small>{row.subtitle}</small>
          </span>
          <span>{row.appointments}</span>
          <span>{currency.format(row.revenue)}</span>
          <span>{currency.format(row.average)}</span>
          <span>{row.completed}</span>
          <em className={row.active ? "active" : "break"}>
            {row.active ? "Ativo" : "Inativo"}
          </em>
        </div>
      ))}
    </section>
  );
};
