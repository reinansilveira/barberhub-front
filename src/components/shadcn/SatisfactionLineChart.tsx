"use client";

import type { SatisfactionChartPoint } from "./satisfaction-line-chart.options";
import { useSatisfactionLineChart } from "./use-satisfaction-line-chart";

export const SatisfactionLineChart = ({
  data,
}: {
  data: SatisfactionChartPoint[];
}) => {
  const chartRef = useSatisfactionLineChart(data);

  return (
    <div
      ref={chartRef}
      className="satisfaction-chart"
      aria-label="Distribuição das avaliações por nota"
    />
  );
};
