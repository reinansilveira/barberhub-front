export const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const dateText = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
export const timeText = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
export const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

export function initials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0] ?? "")
        .join("")
        .toUpperCase();
}

export function isCompleted(status: string) {
    return /confirm|complete|done|final/i.test(status);
}

export function isCancelled(status: string) {
    return /cancel/i.test(status);
}

export type TrendDirection = "up" | "down" | "flat";

export function trend(current: number, previous: number): { pct: number; direction: TrendDirection } {
    if (!previous) return { pct: current ? 100 : 0, direction: current ? "up" : "flat" };

    const pct = Math.round(((current - previous) / previous) * 100);
    return { pct, direction: pct > 0 ? "up" : pct < 0 ? "down" : "flat" };
}
