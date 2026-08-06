import { useEffect, useState } from "react";
import {
    addMonths,
    buildCalendarDays,
    dateKey,
    daysInMonthOf,
    formatMonthLabel,
    monthStart,
    today,
} from "@/utils/date-utils";

type AvailabilityResponse = { availableDates: string[] };

const availabilityCache = new Map<string, Set<string>>();

async function fetchAvailability(
    professionalId: string,
    requestStart: string,
    daysInMonth: number,
): Promise<Set<string>> {
    const cacheKey = `${professionalId}:${requestStart}:${daysInMonth}`;
    const cached = availabilityCache.get(cacheKey);
    if (cached) return cached;

    const response = await fetch(
        `/api/availability?${new URLSearchParams({
            professionalId,
            start: requestStart,
            days: String(daysInMonth),
        })}`,
    );

    if (!response.ok) throw new Error("Failed to fetch availability");

    const data = (await response.json()) as AvailabilityResponse;
    const dates = new Set(data.availableDates);
    availabilityCache.set(cacheKey, dates);
    return dates;
}

export function useAvailabilityCalendar(professionalId: string, value: string) {
    const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
    const [visibleMonth, setVisibleMonth] = useState(() => monthStart(value));
    const start = today();
    const calendarDays = buildCalendarDays(visibleMonth);
    const monthLabel = formatMonthLabel(visibleMonth);
    const requestStart = dateKey(visibleMonth) < start ? start : dateKey(visibleMonth);
    const daysInMonth = daysInMonthOf(visibleMonth);
    const canGoBack = dateKey(visibleMonth) > start.slice(0, 8) + "01";

    useEffect(() => {
        let active = true;

        fetchAvailability(professionalId, requestStart, daysInMonth)
            .then((dates) => {
                if (active) setAvailableDates(dates);
            })
            .catch(() => {
                if (active) setAvailableDates(new Set());
            });

        return () => {
            active = false;
        };
    }, [daysInMonth, professionalId, requestStart]);

    function goToPreviousMonth() {
        setVisibleMonth((current) => addMonths(current, -1));
    }

    function goToNextMonth() {
        setVisibleMonth((current) => addMonths(current, 1));
    }

    function selectDate(key: string) {
        setVisibleMonth(monthStart(key));
    }

    return {
        availableDates,
        visibleMonth,
        calendarDays,
        monthLabel,
        canGoBack,
        goToPreviousMonth,
        goToNextMonth,
        selectDate,
    };
}