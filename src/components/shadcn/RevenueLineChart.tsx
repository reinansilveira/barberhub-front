"use client";

import type { RevenueChartModel } from "@/app/dashboard/owner/revenue-chart.utils";
import { useRevenueLineChart } from "./use-revenue-line-chart";

type RevenueLineChartProps = {
  model: RevenueChartModel;
  period: "week" | "month" | "year";
};

const CHART_LABELS: Record<RevenueLineChartProps["period"], string> = {
  week: "Receita dos últimos sete dias",
  month: "Receita do mês",
  year: "Receita do ano",
};

export const RevenueLineChart = ({ model, period }: RevenueLineChartProps) => {
  const chartRef = useRevenueLineChart(model.periods[period]);

  return (
    <div
      ref={chartRef}
      className="revenue-chart"
      aria-label={CHART_LABELS[period]}
    />
  );
};
