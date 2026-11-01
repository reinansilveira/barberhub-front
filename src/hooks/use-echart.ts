import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export type EChartOption = Parameters<echarts.ECharts["setOption"]>[0];

export function useEChart(option: EChartOption) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current);
    chart.setOption(option);

    const resize = () => chart.resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.dispose();
    };
  }, [option]);

  return containerRef;
}
