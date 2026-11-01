import type { EChartOption } from "@/hooks/use-echart";

export type SatisfactionChartPoint = { rating: string; count: number };

const pluralizeReviews = (count: number) =>
  `${count} ${count === 1 ? "avaliação" : "avaliações"}`;

export const buildSatisfactionLineChartOption = (
  data: SatisfactionChartPoint[],
): EChartOption => {
  const maxValue = Math.max(...data.map((point) => point.count), 1);

  return {
    animationDuration: 500,
    grid: { top: 8, right: 8, bottom: 18, left: 8 },
    xAxis: {
      type: "category",
      data: data.map((point) => point.rating),
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#94989e", fontSize: 10 },
    },
    yAxis: { type: "value", min: 0, max: maxValue * 1.08, show: false },
    tooltip: {
      trigger: "axis",
      formatter: (params: Array<{ axisValue: string }>) => {
        const point = data.find((item) => item.rating === params[0]?.axisValue);
        return point
          ? `${pluralizeReviews(point.count)}<br/>${point.rating} estrelas`
          : "";
      },
    },
    series: [
      {
        type: "line",
        data: data.map((point) => point.count),
        smooth: 0.35,
        showSymbol: true,
        symbolSize: 5,
        itemStyle: {
          color: "#64c9b2",
          borderColor: "#ffffff",
          borderWidth: 1.5,
        },
        lineStyle: { color: "#64c9b2", width: 2.5 },
      },
    ],
  };
};
