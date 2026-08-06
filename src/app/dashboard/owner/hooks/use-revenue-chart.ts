import type { Appointment } from "@/services/appointment";

export const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const dateText = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
export const timeText = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

export const isDone = (status: string) => /confirm|complete|done|final/i.test(status);
export const isCancelled = (status: string) => /cancel/i.test(status);

export function statusLabel(status: string) {
    if (isCancelled(status)) return "Cancelado";
    if (isDone(status)) return "Concluído";
    return "Agendado";
}

export interface RevenueDay {
    date: Date;
    entries: Appointment[];
    revenue: number;
}

export interface RevenueChartModel {
    days: RevenueDay[];
    useBookings: boolean;
    max: number;
    values: number[];
}

function buildRevenueDays(appointments: Appointment[], now: Date): RevenueDay[] {
    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(now);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - 6 + index);

        const entries = appointments.filter(
            (item) => new Date(item.scheduledAt).toDateString() === date.toDateString(),
        );
        const revenue = entries
            .filter((item) => isDone(item.status))
            .reduce((sum, item) => sum + Number(item.price || 0), 0);

        return { date, entries, revenue };
    });
}

export function getRevenueChartModel(appointments: Appointment[], now = new Date()): RevenueChartModel {
    const days = buildRevenueDays(appointments, now);
    const totalRevenue = days.reduce((sum, day) => sum + day.revenue, 0);
    const useBookings = totalRevenue === 0;
    const values = days.map((day) => (useBookings ? day.entries.length : day.revenue));
    const max = Math.max(...values, 1);

    return {
        days,
        useBookings,
        values,
        max,
    };
}