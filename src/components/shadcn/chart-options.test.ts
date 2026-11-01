import { describe, expect, it } from "vitest";
import { buildRevenueLineChartOption } from "./revenue-line-chart.options";
import { buildSatisfactionLineChartOption } from "./satisfaction-line-chart.options";

type Formatter = (params: Array<{ axisValue: string }>) => string;
type ChartOption = {
  xAxis: { data: string[] };
  yAxis: { max: number };
  series: Array<{ data: number[] }>;
  tooltip: { formatter: Formatter };
};

describe("chart options", () => {
  it("monta o gráfico de receita com folga no topo e tooltip em reais", () => {
    const option = buildRevenueLineChartOption([
      { label: "seg", value: 100 },
      { label: "ter", value: 250 },
    ]) as unknown as ChartOption;

    expect(option.xAxis.data).toEqual(["seg", "ter"]);
    expect(option.series[0]?.data).toEqual([100, 250]);
    expect(option.yAxis.max).toBe(270);
    expect(
      option.tooltip.formatter([{ axisValue: "ter" }]).replace(/\s/g, " "),
    ).toBe("R$ 250<br/>ter");
    expect(option.tooltip.formatter([{ axisValue: "dom" }])).toBe("");
  });

  it("evita eixo zerado quando não há receita", () => {
    const option = buildRevenueLineChartOption([
      { label: "seg", value: 0 },
    ]) as unknown as ChartOption;

    expect(option.yAxis.max).toBe(1.08);
  });

  it("pluraliza as avaliações no tooltip de satisfação", () => {
    const option = buildSatisfactionLineChartOption([
      { rating: "4", count: 1 },
      { rating: "5", count: 3 },
    ]) as unknown as ChartOption;

    expect(option.tooltip.formatter([{ axisValue: "4" }])).toBe(
      "1 avaliação<br/>4 estrelas",
    );
    expect(option.tooltip.formatter([{ axisValue: "5" }])).toBe(
      "3 avaliações<br/>5 estrelas",
    );
  });
});
