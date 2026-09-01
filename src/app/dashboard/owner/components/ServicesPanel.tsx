import { currency } from "../../_shared/dashboard.utils";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";

const RADIUS = 15.9155; // circumference = 100, so % maps 1:1 to dasharray units

type ServicesPanelProps = {
    appointments: Appointment[];
    services: Service[];
    variant?: "mix" | "catalog";
};

export function ServicesPanel({ appointments, services, variant = "mix" }: ServicesPanelProps) {
    if (variant === "catalog") {
        return (
            <div className="panel">
                <div className="panelTitle">
                    <small>CATÁLOGO DE SERVIÇOS</small>
                    <a href="/dashboard?view=novo-servico">+ Novo serviço</a>
                </div>

                {services.length === 0 ? (
                    <p className="empty">Nenhum serviço cadastrado ainda.</p>
                ) : (
                    <div className="table">
                        {services.map((service) => (
                            <div key={service.id}>
                                <b>{service.name}</b>
                                <span>{currency.format(Number(service.price || 0))}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const colors = ["#6348cb", "#18b6a3", "#e0ad28", "#ef6a77"];
    const completed = appointments.filter((appointment) => /confirm|complete|done|final/i.test(appointment.status));
    const counts = new Map<string, { id: string; label: string; value: number; color: string }>();
    completed.forEach((appointment) => {
        const label = appointment.service?.name ?? "Serviço";
        const current = counts.get(label);
        counts.set(label, current ?? { id: label, label, value: 0, color: colors[counts.size % colors.length] });
        counts.get(label)!.value += 1;
    });
    const model = { total: completed.length, breakdown: [...counts.values()] };
    const sum = model.breakdown.reduce((acc, item) => acc + item.value, 0) || 1;

    const segments = model.breakdown.reduce<Array<(typeof model.breakdown)[number] & { pct: number; offset: number }>>(
        (result, item) => {
            const offset = result.reduce((total, segment) => total + segment.pct, 0);
            const pct = (item.value / sum) * 100;
            return [...result, { ...item, pct, offset }];
        },
        [],
    );

    return (
        <div className="panel column">
            <div className="panelTitle">
                <div>
                    <small>MIX DE SERVIÇOS</small>
                    <span className="metricDescription">Atendimentos concluídos esta semana</span>
                </div>
            </div>

            {segments.length === 0 ? (
                <p className="empty">Sem atendimentos concluídos ainda.</p>
            ) : (
                <div className="donutWrap">
                    <svg className="donutSvg" viewBox="0 0 36 36">
                        <circle className="donutTrack" cx="18" cy="18" r={RADIUS} />
                        {segments.map((segment) => (
                            <circle
                                key={segment.id}
                                className="donutSegment"
                                cx="18"
                                cy="18"
                                r={RADIUS}
                                stroke={segment.color}
                                strokeDasharray={`${segment.pct} ${100 - segment.pct}`}
                                strokeDashoffset={25 - segment.offset}
                                transform="rotate(-90 18 18)"
                            />
                        ))}
                        <foreignObject x="0" y="0" width="36" height="36">
                            <div className="donutCenter" style={{ display: "grid", placeItems: "center", height: "100%" }}>
                                <strong>{model.total}</strong>
                            </div>
                        </foreignObject>
                    </svg>

                    <div className="donutLegend">
                        {segments.map((segment) => (
                            <div key={segment.id}>
                                <span>
                                    <i style={{ background: segment.color }} />
                                    {segment.label}
                                </span>
                                <b>{Math.round(segment.pct)}%</b>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
