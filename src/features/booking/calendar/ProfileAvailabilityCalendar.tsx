"use client";

import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { useDateSearchParam } from "./use-date-search-param";

export function ProfileAvailabilityCalendar({
  professionalId,
  date,
}: {
  professionalId: string;
  date: string;
}) {
  const setDate = useDateSearchParam();

  return (
    <AvailabilityCalendar
      professionalId={professionalId}
      value={date}
      onChange={setDate}
    />
  );
}
