"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

export function ProfileAvailabilityCalendar({ professionalId, date }: { professionalId: string; date: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return <AvailabilityCalendar professionalId={professionalId} value={date} onChange={(nextDate) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("date", nextDate);
    router.replace(`?${params.toString()}`, { scroll: false });
  }} />;
}
