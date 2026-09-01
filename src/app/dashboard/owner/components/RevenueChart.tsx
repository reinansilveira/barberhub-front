"use client";

import { useState } from "react";
import { currency, trend } from "../../_shared/dashboard.utils";
import type { RevenueChartModel } from "../hooks/use-revenue-chart";

const WIDTH = 640;
const HEIGHT = 220;
const PAD_X = 16;
const PAD_Y = 16;

function smoothPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const midX = (curr.x + next.x) / 2;
        d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
}

function scale(values: number[], size: number, padding: number) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return (value: number) => size - padding - ((value - min) / range) * (size - padding * 2);
}

export function RevenueChart({ model }: { model: RevenueChartModel }) {
    const series = model.days.map((day) => ({
        ...day,
        label: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(day.date),
        bookings: day.entries.length,
    }));
    const [activeIndex, setActiveIndex] = useState(series.length - 1);
    const total = series.reduce((sum, day) => sum + day.revenue, 0);
    const revenueTrend = trend(total, 0);

    const stepX = (WIDTH - PAD_X * 2) / Math.max(series.length - 1, 1);
    const xFor = (index: number) => PAD_X + index * stepX;
    const yFor = scale(series.map((point) => point.revenue), HEIGHT, PAD_Y);
    const points = series.map((point, index) => ({ x: xFor(index), y: yFor(point.revenue) }));
    const salesPath = smoothPath(points);
    const areaPath = points.length
        ? `${salesPath} L ${points[points.length - 1].x} ${HEIGHT} L ${points[0].x} ${HEIGHT} Z`
        : "";

    const active = series[activeIndex];

    return (
        <div className="panel column">
            <div className="panelTitle">
                <div>
                    <small>FATURAMENTO SEMANAL</small>
                    <span className="primaryValue">
                        {currency.format(total)} <small>esta semana</small>
                    </span>
                    <span className="trend" data-direction={revenueTrend.direction}>
                        {revenueTrend.direction === "up" ? "↑" : revenueTrend.direction === "down" ? "↓" : "→"}{" "}
                        {Math.abs(revenueTrend.pct)}%
                    </span>
                </div>
            </div>

            <div className="lineChart">
                <svg className="lineChartSvg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6348cb" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#6348cb" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {[0, 1, 2, 3].map((row) => (
                        <line key={row} className="gridLine" x1={0} x2={WIDTH} y1={(HEIGHT / 3) * row} y2={(HEIGHT / 3) * row} />
                    ))}

                    {points[activeIndex] && (
                        <line className="focusLine" x1={points[activeIndex].x} x2={points[activeIndex].x} y1={0} y2={HEIGHT} />
                    )}

                    <path className="areaPath" d={areaPath} />
                    <path className="salesPath" d={salesPath} />

                    {points.map((p, i) => (
                        <circle key={i} className="salesDot" cx={p.x} cy={p.y} r={i === activeIndex ? 5 : 3} />
                    ))}

                    {points.map((p, i) => (
                        <rect
                            key={`hit-${i}`}
                            className="hitArea"
                            x={p.x - WIDTH / Math.max(series.length, 1) / 2}
                            y={0}
                            width={WIDTH / Math.max(series.length, 1)}
                            height={HEIGHT}
                            tabIndex={0}
                            onMouseEnter={() => setActiveIndex(i)}
                            onFocus={() => setActiveIndex(i)}
                        />
                    ))}
                </svg>

                <div className="legend">
                    {series.map((p, i) => (
                        <span key={p.date.toISOString()} className={i === activeIndex ? "axisLabelActive" : "axisLabel"}>
                            {p.label}
                        </span>
                    ))}
                </div>
            </div>

            {active && (
                <div className="dayDetail">
                    <div className="dayDetailHead">
                        <b>{active.label}</b>
                        <span>{active.bookings} agendamentos</span>
                    </div>
                    <span className="primaryValue" style={{ fontSize: "1.6rem" }}>
                        {currency.format(active.revenue)}
                    </span>
                </div>
            )}
        </div>
    );
}
