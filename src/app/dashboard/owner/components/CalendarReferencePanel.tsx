import { Plus } from "lucide-react";
import type { Appointment } from "@/services/appointment";
import { cn } from "@/utils/class-names";
import { currency } from "../../_shared/dashboard.utils";
import { useOpenDashboardModal } from "../../_shared/stores/dashboard-modals.store";
import type { ReferencePanelsModel } from "../hooks/use-reference-panels";
import { ArrowIcon, MiniStats } from "./ReferencePanelPrimitives";

export const CalendarReferencePanel = ({
  appointments,
  calendar,
}: {
  appointments: Appointment[];
  calendar: ReferencePanelsModel["calendar"];
}) => {
  const openModal = useOpenDashboardModal();
  const onNewAppointment = () => openModal("appointment");

  return (
    <div className="reference-page calendar-page">
      <header className="reference-page__head dashboard-page__header calendar-page__header">
        <div>
          <h1>Calendário</h1>
          <p>{calendar.periodLabel}</p>
        </div>
        <div className="calendar-page__header-actions">
          <div
            className="calendar-page__filters"
            aria-label="Visualização do calendário"
          >
            {(
              [
                ["day", "Dia"],
                ["week", "Semana"],
                ["month", "Mês"],
              ] as const
            ).map(([filter, label]) => (
              <button
                key={filter}
                className={cn(
                  "calendar-page__filter",
                  calendar.filter === filter && "calendar-page__filter--active",
                )}
                onClick={() => calendar.setFilter(filter)}
                type="button"
                aria-pressed={calendar.filter === filter}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            className="calendar-page__period-actions"
            aria-label="Navegação do período"
          >
            <button
              className="calendar-page__period-button"
              type="button"
              aria-label="Período anterior"
              onClick={() => calendar.navigate(-1)}
            >
              <ArrowIcon direction="left" />
              Anterior
            </button>
            <button
              className="calendar-page__today-button"
              type="button"
              onClick={() => calendar.setDate(new Date())}
            >
              Hoje
            </button>
            <button
              className="calendar-page__period-button"
              type="button"
              aria-label="Próximo período"
              onClick={() => calendar.navigate(1)}
            >
              Próximo
              <ArrowIcon direction="right" />
            </button>
          </div>
          <button
            className="reference-page__action"
            type="button"
            onClick={onNewAppointment}
          >
            <Plus aria-hidden="true" /> Novo agendamento
          </button>
        </div>
      </header>
      <MiniStats
        className="calendar-page__stats"
        items={[
          [
            "calendar",
            "Esta semana",
            `${calendar.days.reduce(
              (total, day) => total + day.events.length,
              0,
            )} agendamentos`,
            "",
          ],
          [
            "pending",
            "Pendentes",
            `${appointments.filter((item) => /pending/i.test(item.status)).length} horários`,
            "",
          ],
          [
            "cancelled",
            "Cancelados",
            String(
              appointments.filter((item) => /cancel/i.test(item.status)).length,
            ),
            "",
          ],
          [
            "wallet",
            "Receita concluída",
            currency.format(
              appointments
                .filter((item) => /complete/i.test(item.status))
                .reduce((total, item) => total + Number(item.price || 0), 0),
            ),
            "",
          ],
        ]}
      />
      <section className="calendar-board__grid">
        <article className="calendar-board">
          {calendar.filter === "month" ? (
            <div className="calendar-month calendar-page__month">
              <div className="calendar-month__weekdays">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  ),
                )}
              </div>
              <div className="calendar-month__grid">
                {calendar.monthCells.map((cell) => {
                  const cellAppointments =
                    calendar.appointmentsByDate.get(cell.date.toDateString()) ??
                    [];

                  return (
                    <button
                      className={cn(
                        "calendar-month__day",
                        cell.date.toDateString() ===
                          new Date().toDateString() &&
                          "calendar-month__day--current",
                        cell.outside && "calendar-month__day--outside",
                      )}
                      key={cell.date.toISOString()}
                      type="button"
                      onClick={() => {
                        calendar.setDate(new Date(cell.date));
                        calendar.setFilter("day");
                      }}
                    >
                      <b>{cell.date.getDate()}</b>
                      {cellAppointments.slice(0, 3).map((item, eventIndex) => (
                        <span
                          className={`calendar-month__event calendar-month__event--${
                            ["mint", "yellow", "violet"][eventIndex % 3]
                          }`}
                          key={item.id}
                        >
                          <strong>{item.service?.name ?? "Serviço"}</strong>
                          <em>
                            {item.client.name} ·{" "}
                            {new Intl.DateTimeFormat("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(item.scheduledAt))}
                          </em>
                        </span>
                      ))}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : calendar.filter === "week" ? (
            <div className="calendar-week calendar-page__week">
              <div className="calendar-week__grid">
                {calendar.days.map((day) => (
                  <button
                    className={cn(
                      "calendar-week__day",
                      day.fullDate.toDateString() ===
                        calendar.date.toDateString() &&
                        "calendar-week__day--current",
                    )}
                    key={day.date}
                    type="button"
                    onClick={() => {
                      calendar.setDate(new Date(day.fullDate));
                      calendar.setFilter("day");
                    }}
                  >
                    <header>
                      <small>{day.label}</small>
                      <b>{day.date}</b>
                    </header>
                    <div className="calendar-week__events">
                      {day.events.map(([row, title, detail, tone]) => (
                        <span
                          className={`calendar-week__event calendar-week__event--${tone}`}
                          key={`${title}-${detail}`}
                        >
                          <strong>{title}</strong>
                          <em>
                            {String(detail).split(" · ")[0]} ·{" "}
                            {String(7 + Number(row)).padStart(2, "0")}:00
                          </em>
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="calendar-day-view">
              <div className="calendar-day-view__header">
                <div>
                  <span>Agenda do dia</span>
                  <strong>
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "long",
                    }).format(calendar.selectedDay.fullDate)}
                  </strong>
                </div>
                <span>{calendar.selectedDay.events.length} agendamentos</span>
              </div>
              <div className="calendar-day-view__list">
                {calendar.selectedDay.events.map(
                  ([row, title, detail, tone]) => (
                    <div
                      className={`calendar-day-view__event calendar-day-view__event--${tone}`}
                      key={`${title}-${detail}`}
                    >
                      <span className="calendar-day-view__time">
                        {`${String(7 + Number(row)).padStart(2, "0")}:00`}
                      </span>
                      <div>
                        <strong>{title}</strong>
                        <span>{String(detail)}</span>
                      </div>
                      <button type="button" onClick={onNewAppointment}>
                        Abrir agenda
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </article>
      </section>
      <section className="calendar-page__lower">
        <article className="reference-panel daily-schedule calendar-page__daily-schedule">
          <div className="reference-panel__head">
            <div>
              <h2>Agenda selecionada</h2>
              <p>
                {new Intl.DateTimeFormat("pt-BR", {
                  weekday: "short",
                  day: "2-digit",
                }).format(calendar.selectedDay.fullDate)}
              </p>
            </div>
            <span className="calendar-page__schedule-live">● Ao vivo</span>
            <a href="/dashboard?view=agenda">Ver todos →</a>
          </div>
          {calendar.dailySchedule.length === 0 && (
            <p className="empty">Nenhum agendamento nesta data.</p>
          )}
          {calendar.dailySchedule.map((appointment, index) => {
            const scheduledAt = new Date(appointment.scheduledAt);
            const status = /complete/i.test(appointment.status)
              ? "Concluído"
              : /cancel/i.test(appointment.status)
                ? "Cancelado"
                : "Agendado";
            const name = appointment.client.name;
            const barber = appointment.professional?.name ?? "Profissional";
            const state = index < 2 ? "done" : index === 2 ? "now" : "upcoming";

            return (
              <div
                className={`schedule-row calendar-page__schedule-row calendar-page__schedule-row--${state}`}
                key={appointment.id}
              >
                <strong>
                  {new Intl.DateTimeFormat("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(scheduledAt)}
                  <small>{appointment.duration} min</small>
                </strong>
                <span
                  className="calendar-page__schedule-accent"
                  aria-hidden="true"
                />
                <i
                  className={`calendar-page__schedule-avatar calendar-page__schedule-avatar--${
                    index + 1
                  }`}
                >
                  {name.slice(0, 2)}
                </i>
                <span>
                  <b>{name}</b>
                  <small>{appointment.service?.name ?? "Serviço"}</small>
                </span>
                <span className="calendar-page__schedule-barber">
                  <i>{barber.slice(0, 2)}</i>
                  {barber}
                </span>
                <em>{currency.format(Number(appointment.price || 0))}</em>
                <b
                  className={`calendar-page__schedule-status calendar-page__schedule-status--${state}`}
                >
                  {status}
                </b>
              </div>
            );
          })}
        </article>
        <aside className="calendar-page__side-panels">
          <article className="reference-panel open-slots calendar-page__open-slots">
            <h2>Horários disponíveis</h2>
            <p className="calendar-page__side-subtitle">
              Consulte os horários ao criar um novo agendamento.
            </p>
            <div className="calendar-page__slots-list">
              <button
                className="calendar-page__slot"
                type="button"
                onClick={onNewAppointment}
              >
                <span aria-hidden="true">＋</span>
                <b>Novo agendamento</b>
              </button>
            </div>
          </article>
          <article className="reference-panel calendar-page__recent-cancellations">
            <h2>
              Cancelamentos recentes{" "}
              <span>{calendar.recentCancellations.length}</span>
            </h2>
            <div className="calendar-page__cancellations-list">
              {calendar.recentCancellations.length === 0 && (
                <p className="empty">Nenhum cancelamento recente.</p>
              )}
              {calendar.recentCancellations.map((appointment, index) => (
                <div
                  className="calendar-page__cancellation"
                  key={appointment.id}
                >
                  <i
                    className={`calendar-page__cancellation-avatar calendar-page__cancellation-avatar--${
                      index + 1
                    }`}
                  >
                    {appointment.client.name.slice(0, 2).toUpperCase()}
                  </i>
                  <span>
                    <b>{appointment.client.name}</b>
                    <small>
                      {appointment.service?.name ?? "Serviço"} ·{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(appointment.scheduledAt))}
                    </small>
                  </span>
                  <em>Cancelado</em>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
};
