import { useMemo } from "react";
import { useEChart } from "@/hooks/use-echart";
import {
  buildRevenueLineChartOption,
  type RevenuePoint,
} from "./revenue-line-chart.options";

export const useRevenueLineChart = (data: RevenuePoint[]) =>
  useEChart(useMemo(() => buildRevenueLineChartOption(data), [data]));
