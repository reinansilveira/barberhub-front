"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export type SatisfactionChartPoint = { rating: string; count: number };

type SatisfactionLineChartProps = { data: SatisfactionChartPoint[] };

export const SatisfactionLineChart = ({ data }: SatisfactionLineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const maxValue = Math.max(...data.map((point) => point.count), 1);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
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
          const point = data.find(
            (item) => item.rating === params[0]?.axisValue
          );
          return point
            ? `${point.count} ${point.count === 1 ? "avaliação" : "avaliações"}<br/>${point.rating} estrelas`
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
      className="satisfaction-chart"
      aria-label="Distribuição das avaliações por nota"
    />
  );
};
