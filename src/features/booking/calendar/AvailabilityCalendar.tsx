"use client";

import { cn } from "@/utils/class-names";
import { WEEKDAY_INITIALS, dateKey, formatDayLabel } from "@/utils/date-utils";
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
    <div className="availability-calendar">
      <div className="availability-calendar__header">
        <button
          aria-label="Mês anterior"
          disabled={!canGoBack}
          onClick={goToPreviousMonth}
          type="button"
        >
          ‹
        </button>
        <strong aria-live="polite">{monthLabel}</strong>
        <button aria-label="Próximo mês" onClick={goToNextMonth} type="button">
          ›
        </button>
      </div>

      <div className="availability-calendar__weekdays">
        {WEEKDAY_INITIALS.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>

      <div className="availability-calendar__days">
        {calendarDays.map((day) => {
          const key = dateKey(day);
          const available = availableDates.has(key);
          const isCurrentMonth =
            day.getUTCMonth() === visibleMonth.getUTCMonth();

          return (
            <button
              aria-label={formatDayLabel(day)}
              className={cn(
                "availability-calendar__day",
                available && "availability-calendar__day--available",
                key === value && "availability-calendar__day--selected",
                !isCurrentMonth && "availability-calendar__day--outside-month",
              )}
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

      {!availableDates.size && (
        <p className="availability-calendar__empty">
          Nenhuma data disponível neste mês.
        </p>
      )}
    </div>
  );
}
