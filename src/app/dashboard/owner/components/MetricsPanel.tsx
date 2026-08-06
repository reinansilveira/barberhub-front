import type { Kpi } from "../owner.types";

export const MetricsPanel = ({ kpis }: { kpis: Kpi[] }) => {
  return (
    <section className="metricsGrid">
      {kpis.map((kpi) => (
        <article key={kpi.label} className="kpiCard" style={{ "--kpi-accent": kpi.accent } as React.CSSProperties}>
          <div className="kpiHead">
            <i className="kpiIcon">{kpi.icon}</i>
            <small>{kpi.label}</small>
          </div>

          <div className="kpiValue">
            <strong>{kpi.value}</strong>
            <span
              className={
                kpi.trendDir === "up"
                  ? "kpiTrendUp"
                  : kpi.trendDir === "down"
                    ? "kpiTrendDown"
                    : "kpiTrendFlat"
              }
            >
              {kpi.trendPct > 0 ? "▲" : kpi.trendPct < 0 ? "▼" : "•"} {Math.abs(kpi.trendPct)}%
            </span>
          </div>

          <p className="kpiCaption">{kpi.caption} · vs. semana anterior</p>

          <div className="kpiSpark">
            {kpi.spark.map((v, i) => (
              <i key={i} style={{ height: `${Math.max(6, v * 100)}%` }} />
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}