import type { EChartOption } from "@/hooks/use-echart";

export type RevenuePoint = { label: string; value: number };

const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export const buildRevenueLineChartOption = (
  data: RevenuePoint[],
): EChartOption => {
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return {
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
        const point = data.find((item) => item.label === params[0]?.axisValue);
        return point
          ? `${compactCurrency.format(point.value)}<br/>${point.label}`
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
  };
};
