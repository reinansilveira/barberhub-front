import { useMemo } from "react";
import { useEChart } from "@/hooks/use-echart";
import {
  buildSatisfactionLineChartOption,
  type SatisfactionChartPoint,
} from "./satisfaction-line-chart.options";

export const useSatisfactionLineChart = (data: SatisfactionChartPoint[]) =>
  useEChart(useMemo(() => buildSatisfactionLineChartOption(data), [data]));
