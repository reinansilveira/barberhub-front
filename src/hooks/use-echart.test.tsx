import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEChart, type EChartOption } from "./use-echart";

const chart = { setOption: vi.fn(), resize: vi.fn(), dispose: vi.fn() };

vi.mock("echarts", () => ({ init: vi.fn(() => chart) }));

function ChartProbe({ option }: { option: EChartOption }) {
  const ref = useEChart(option);
  return <div ref={ref} />;
}

describe("useEChart", () => {
  beforeEach(() => vi.clearAllMocks());

  it("inicializa, redimensiona e descarta o gráfico", () => {
    const option = { series: [] } as EChartOption;
    const { unmount } = render(<ChartProbe option={option} />);

    expect(chart.setOption).toHaveBeenCalledWith(option);

    window.dispatchEvent(new Event("resize"));
    expect(chart.resize).toHaveBeenCalledTimes(1);

    unmount();
    expect(chart.dispose).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event("resize"));
    expect(chart.resize).toHaveBeenCalledTimes(1);
  });

  it("recria o gráfico quando as opções mudam", () => {
    const { rerender } = render(<ChartProbe option={{ series: [] }} />);
    rerender(<ChartProbe option={{ series: [{ type: "line" }] }} />);

    expect(chart.dispose).toHaveBeenCalledTimes(1);
    expect(chart.setOption).toHaveBeenCalledTimes(2);
  });
});
