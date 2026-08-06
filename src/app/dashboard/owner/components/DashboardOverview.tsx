"use client";

import { useMemo } from "react";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";

import {
  buildDashboardOverview,
  money,
  weekday,
  dateText,
  timeText,
  isCancelled,
  isDone,
  statusLabel,
  CHART_W,
  CHART_H,
  CHART_PAD_X,
  CHART_PAD_TOP,
  CHART_PAD_BOTTOM,
} from "../hooks/use-dashboard-overview";

export const DashboardOverview = ({
  appointments,
  services,
}: {
  appointments: Appointment[];
  services: Service[];
}) => {
  const overview = useMemo(() => buildDashboardOverview(appointments, services), [appointments, services]);
  const {
    days,
    upcomingDays,
    maxUpcomingBookings,
    revenue,
    upcoming,
    recent,
    ranking,
    team,
    confirmedUpcoming,
    cancelledTotal,
    totalAppointments,
    chart
  } = overview;
  
  const lastDay = days[days.length - 1];
  const firstUpcomingDay = upcomingDays[0];

  return (
    <div className="overview">
      <div className="analyticsGrid">
        <article className="panel salesPanel">
          <div className="panelTitle">
            <div>
              <small>VENDAS RECENTES</small>
              <h2>Últimos 7 dias</h2>
            </div>
            <button className="more" aria-label="Mais opções">
              ⋮
            </button>
          </div>

          <strong className="primaryValue">{money.format(revenue)}</strong>
          <p className="metricDescription">
            Agendamentos: {totalAppointments} · Valor total: {money.format(revenue)}
          </p>

          <div className="lineChart">
            <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" className="lineChartSvg">
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6348cb" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#6348cb" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3].map((row) => (
                <line
                  key={row}
                  x1={CHART_PAD_X}
                  x2={CHART_W - CHART_PAD_X}
                  y1={CHART_PAD_TOP + (chart.innerH / 3) * row}
                  y2={CHART_PAD_TOP + (chart.innerH / 3) * row}
                  className="gridLine"
                />
              ))}

              <line
                x1={chart.xAt(days.length - 1)}
                x2={chart.xAt(days.length - 1)}
                y1={CHART_PAD_TOP}
                y2={CHART_H - CHART_PAD_BOTTOM}
                className="focusLine"
              />

              <path d={chart.areaPath} className="areaPath" />
              <path d={chart.bookingsPath} className="bookingsPath" />
              <path d={chart.salesPath} className="salesPath" />

              {days.map((day, i) => (
                <g key={day.date.toISOString()}>
                  <circle
                    cx={chart.xAt(i)}
                    cy={chart.yBookings(day.bookings)}
                    r={i === days.length - 1 ? 5 : 3.5}
                    className="bookingsDot"
                  />
                  <circle
                    cx={chart.xAt(i)}
                    cy={chart.ySales(day.sales)}
                    r={i === days.length - 1 ? 6 : 4}
                    className="salesDot"
                  />
                </g>
              ))}

              {days.map((day, i) => (
                <text
                  key={`lbl-${day.date.toISOString()}`}
                  x={chart.xAt(i)}
                  y={CHART_H - 10}
                  textAnchor="middle"
                  className={i === days.length - 1 ? "axisLabelActive" : "axisLabel"}
                >
                  {weekday.format(day.date).replace(".", "")}
                </text>
              ))}

              {days.map((day, i) => (
                <rect
                  key={`hit-${day.date.toISOString()}`}
                  x={chart.xAt(i) - chart.innerW / (days.length - 1) / 2}
                  y={0}
                  width={chart.innerW / (days.length - 1)}
                  height={CHART_H}
                  className="hitArea"
                  aria-label={`${dateText.format(day.date)}: ${money.format(day.sales)} em vendas, ${day.bookings} agendamento(s)`}
                />
              ))}
            </svg>
          </div>

          <div className="legend">
            <span>
              <i className="legendSales" /> Vendas
            </span>
            <span>
              <i className="legendBookings" /> Agendamentos
            </span>
          </div>

          <div className="dayDetail">
            <div className="dayDetailHead">
              <b>{dateText.format(lastDay.date)}</b>
              <span>
                {money.format(lastDay.sales)} em vendas · {lastDay.bookings} agendamento(s)
              </span>
            </div>

            {lastDay.entries.length ? (
              <ul className="dayDetailList">
                {lastDay.entries.map((item) => (
                  <li key={item.id}>
                    <em>{timeText.format(new Date(item.scheduledAt))}</em>
                    <span>
                      {item.service.name} · {item.client.name}
                    </span>
                    <b
                      className={
                        isCancelled(item.status)
                          ? "cancelled"
                          : isDone(item.status)
                            ? "complete"
                            : "pending"
                      }
                    >
                      {statusLabel(item.status)}
                    </b>
                    <strong>{money.format(Number(item.price || 0))}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">Nenhum agendamento nesse dia.</p>
            )}
          </div>
        </article>

        <article className="panel upcomingPanel">
          <div className="panelTitle">
            <div>
              <small>PRÓXIMOS AGENDAMENTOS</small>
              <h2>Próximos 7 dias</h2>
            </div>
          </div>

          <strong className="primaryValue">
            {upcoming.length} <small>agendados</small>
          </strong>

          <div className="statusCounts">
            <span>
              Confirmados <b>{confirmedUpcoming}</b>
            </span>
            <span>
              Cancelados <b>{cancelledTotal}</b>
            </span>
          </div>

          <div className="miniBars">
            {upcomingDays.map((day, i) => (
              <div key={day.date.toISOString()}>
                <div
                  style={{
                    height: `${Math.max(5, (day.bookings / maxUpcomingBookings) * 78)}px`,
                    opacity: i === 0 ? 1 : 0.55,
                    backgroundColor: "#7c3aed",
                    borderRadius: "2px",
                  }}
                  aria-label={`${dateText.format(day.date)}: ${day.bookings} agendamento(s)`}
                />
                <small>{weekday.format(day.date).replace(".", "")}</small>
              </div>
            ))}
          </div>

          <div className="legend">
            <span>
              <i className="legendConfirmed" /> Confirmado
            </span>
            <span>
              <i className="legendCancelled" /> Cancelado
            </span>
          </div>

          <div className="dayDetail">
            <div className="dayDetailHead">
              <b>{dateText.format(firstUpcomingDay.date)}</b>
              <span>{firstUpcomingDay.bookings} agendamento(s)</span>
            </div>

            {firstUpcomingDay.entries.length ? (
              <ul className="dayDetailList">
                {firstUpcomingDay.entries.map((item) => (
                  <li key={item.id}>
                    <em>{timeText.format(new Date(item.scheduledAt))}</em>
                    <span>
                      {item.service.name} · {item.client.name}
                    </span>
                    <b
                      className={
                        isCancelled(item.status)
                          ? "cancelled"
                          : isDone(item.status)
                            ? "complete"
                            : "pending"
                      }
                    >
                      {statusLabel(item.status)}
                    </b>
                    <strong>{money.format(Number(item.price || 0))}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">Nenhum agendamento nesse dia.</p>
            )}
          </div>
        </article>
      </div>

      <div className="bottomGrid">
        <article className="panel">
          <div className="panelTitle">
            <div>
              <small>ATIVIDADE</small>
              <h2>Atividade de Agendamentos</h2>
            </div>
          </div>

          <div className="appointments">
            {recent.map((item) => (
              <article key={item.id}>
                <time>{dateText.format(new Date(item.scheduledAt))}</time>
                <div>
                  <b>{item.service.name}</b>
                  <small>
                    {item.client.name}, {item.duration}min com {item.professional.name}
                  </small>
                </div>
                <em
                  className={
                    isCancelled(item.status)
                      ? "cancelled"
                      : isDone(item.status)
                        ? "complete"
                        : "pending"
                  }
                >
                  {statusLabel(item.status).toUpperCase()}
                </em>
                <strong>{money.format(Number(item.price || 0))}</strong>
              </article>
            ))}

            {!recent.length && <p className="empty">Nenhum agendamento registrado ainda.</p>}
          </div>
        </article>

        <div className="sidePanels">
          <article className="panel">
            <div className="panelTitle">
              <div>
                <small>DESEMPENHO</small>
                <h2>Serviços Principais</h2>
              </div>
            </div>

            <div className="table">
              <div>
                <small>Serviço</small>
                <small>Este mês</small>
              </div>

              {ranking.map((service) => (
                <div key={service.id}>
                  <b>{service.name}</b>
                  <span>{service.count}</span>
                </div>
              ))}

              {!ranking.length && <p className="empty">Sem serviços realizados.</p>}
            </div>
          </article>

          <article className="panel">
            <div className="panelTitle">
              <div>
                <small>EQUIPE</small>
                <h2>Destaque da Equipe</h2>
              </div>
            </div>

            <div className="table">
              <div>
                <small>Membro</small>
                <small>Faturamento</small>
              </div>

              {team.map(([name, value]) => (
                <div key={name}>
                  <b>
                    <i className="avatar">{name[0]}</i>
                    {name}
                  </b>
                  <span>{money.format(value)}</span>
                </div>
              ))}

              {!team.length && <p className="empty">Sem atendimentos concluídos.</p>}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
