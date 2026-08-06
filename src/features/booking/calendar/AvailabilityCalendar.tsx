"use client";

import { dateKey, formatDayLabel } from "@/utils/date-utils";
import "./AvailabilityCalendar.scss";
import { useAvailabilityCalendar } from "./use-availability-calendar";

export function AvailabilityCalendar({
  professionalId,
  value,
  onChange,
}: {
  professionalId: string;
  value: string;
  onChange: (date: string) => void;
}) {
  const {
    availableDates,
    visibleMonth,
    calendarDays,
    monthLabel,
    canGoBack,
    goToPreviousMonth,
    goToNextMonth,
    selectDate,
  } = useAvailabilityCalendar(professionalId, value);

  return (
    <div className="calendar" aria-live="polite">
      <div className="header">
        <button aria-label="Mês anterior" disabled={!canGoBack} onClick={goToPreviousMonth} type="button">
          ‹
        </button>
        <strong>{monthLabel}</strong>
        <button aria-label="Próximo mês" onClick={goToNextMonth} type="button">
          ›
        </button>
      </div>

      <div className="weekdays">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>

      <div className="days">
        {calendarDays.map((day) => {
          const key = dateKey(day);
          const available = availableDates.has(key);
          const isCurrentMonth = day.getUTCMonth() === visibleMonth.getUTCMonth();

          return (
            <button
              aria-label={formatDayLabel(day)}
              className={`day ${available ? "available" : ""} ${key === value ? "selected" : ""} ${!isCurrentMonth ? "otherMonth" : ""}`}
              disabled={!available}
              key={key}
              onClick={() => {
                onChange(key);
                selectDate(key);
              }}
              type="button"
            >
              {day.getUTCDate()}
            </button>
          );
        })}
      </div>

      {!availableDates.size && <p className="empty">Nenhuma data disponível neste mês.</p>}
    </div>
  );
}
