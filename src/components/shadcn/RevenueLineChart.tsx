"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import type { RevenueChartModel } from "@/app/dashboard/owner/hooks/use-revenue-chart";

type RevenueLineChartProps = {
  model: RevenueChartModel;
  period: "week" | "month" | "year";
};
type RevenuePoint = { label: string; value: number };

const fallbackData: RevenuePoint[] = [
  { label: "Seg", value: 1250 },
  { label: "Ter", value: 720 },
  { label: "Qua", value: 1580 },
  { label: "Qui", value: 980 },
  { label: "Sex", value: 1880 },
  { label: "Sáb", value: 1320 },
  { label: "Dom", value: 2240 },
];
const periodFallbacks: Record<RevenueLineChartProps["period"], RevenuePoint[]> =
  {
    week: fallbackData,
    month: [
      { label: "1ª sem", value: 6200 },
      { label: "2ª sem", value: 8400 },
      { label: "3ª sem", value: 7100 },
      { label: "4ª sem", value: 11200 },
    ],
    year: [
      { label: "Jan", value: 18400 },
      { label: "Fev", value: 22100 },
      { label: "Mar", value: 19800 },
      { label: "Abr", value: 26700 },
      { label: "Mai", value: 24100 },
      { label: "Jun", value: 31200 },
      { label: "Jul", value: 28600 },
      { label: "Ago", value: 35400 },
    ],
  };
const formatMoney = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export const RevenueLineChart = ({ model, period }: RevenueLineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const hasRevenue =
    period === "week" &&
    !model.useBookings &&
    model.values.some((value) => value > 0);
  const data = hasRevenue
    ? model.days.map((day, index) => ({
        label: day.date
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", ""),
        value: model.values[index],
      }))
    : periodFallbacks[period];
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      animationDuration: 600,
      grid: { top: 24, right: 12, bottom: 28, left: 8 },
      xAxis: {
        type: "category",
        data: data.map((point) => point.label),
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#a4a7ad", fontSize: 16 },
      },
      yAxis: { type: "value", min: 0, max: maxValue * 1.08, show: false },
      splitLine: {
        show: true,
        lineStyle: { color: "#f0f1f2", type: "dashed" },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: Array<{ axisValue: string }>) => {
          const point = data.find(
            (item) => item.label === params[0]?.axisValue
          );
          return point
            ? `${formatMoney.format(point.value)}<br/>${point.label}`
            : "";
        },
      },
      series: [
        {
          type: "line",
          data: data.map((point) => point.value),
          smooth: 0.35,
          showSymbol: false,
          lineStyle: { color: "#7656dc", width: 2.5 },
        },
      ],
    });
    const resize = () => chart.resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.dispose();
    };
  }, [data, maxValue]);

  return (
    <div
      ref={chartRef}
      className="revenue-chart"
      aria-label="Receita dos últimos sete dias"
    />
  );
};
