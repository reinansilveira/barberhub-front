import type { Kpi } from "../owner.types";

const ARROW = { up: "↑", down: "↓", flat: "→" } as const;

export function MetricsPanel({ kpis }: { kpis: Kpi[] }) {
    return (
        <section className="metrics">
            {kpis.map((kpi) => (
                <div className="kpiCard" style={{ "--kpi-accent": kpi.accent } as React.CSSProperties} key={kpi.label}>
                    <div className="kpiHead">
                        <small>{kpi.label}</small>
                        <i className="kpiIcon">{kpi.icon}</i>
                    </div>

                    <div className="kpiValue">
                        <strong>{kpi.value}</strong>
                        <span className="trend" data-direction={kpi.trendDir}>
                            {ARROW[kpi.trendDir]} {Math.abs(kpi.trendPct)}%
                        </span>
                    </div>

                    <p className="kpiCaption">{kpi.caption}</p>

                    <div className="kpiSpark">
                        {kpi.spark.map((value, i) => (
                            <i key={i} style={{ height: `${Math.max(value * 100, 4)}%` }} />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}