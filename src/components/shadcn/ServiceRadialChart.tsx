"use client";

import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
} from "recharts";

type ServiceRadialChartProps = {
  total: number;
};

const chartData = [
  { name: "Cortes", value: 60, fill: "#09c9ae" },
  { name: "Barbas", value: 25, fill: "#ffd45d" },
  { name: "Pacotes", value: 15, fill: "#9333ea" },
];

export const ServiceRadialChart = ({ total }: ServiceRadialChartProps) => (
  <div className="service-radial-chart">
    <div className="service-radial-chart__visual" aria-label="Distribuição dos serviços">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={chartData}
          innerRadius="55%"
          outerRadius="88%"
          startAngle={90}
          endAngle={-270}
        >
          <Tooltip
            cursor={false}
            wrapperStyle={{ transform: "translateX(0)" }}
            content={(props: TooltipContentProps) => {
              const entry = props.payload?.[0];
              if (!props.active || !entry) return null;

              const item = entry.payload as { name?: string; fill?: string };
              return (
                <div className="service-radial-chart__tooltip">
                  <span
                    className="service-radial-chart__tooltip-color"
                    style={{ backgroundColor: item.fill ?? entry.color }}
                  />
                  <strong>{item.name}</strong>
                  <b>{entry.value}%</b>
                </div>
              );
            }}
          />
          <RadialBar dataKey="value" background={{ fill: "#f2f3f4" }} cornerRadius={0} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="service-radial-chart__total">
        <small>Total</small>
        <strong>{total}</strong>
      </div>
    </div>
    <div className="service-radial-chart__legend">
      {chartData.map((item) => (
        <p key={item.name}>
          <span style={{ backgroundColor: item.fill }} />
          {item.name}
          <b>{item.value}%</b>
        </p>
      ))}
    </div>
  </div>
);
