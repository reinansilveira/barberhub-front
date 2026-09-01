import { currency, isCancelled, isCompleted, initials, timeText } from "../../_shared/dashboard.utils";
import type { Appointment } from "@/services/appointment";

function statusVariant(status: string) {
    if (isCompleted(status)) return "complete" as const;
    if (isCancelled(status)) return "cancelled" as const;
    return "pending" as const;
}

const STATUS_LABEL: Record<"complete" | "pending" | "cancelled", string> = {
    complete: "Concluído",
    pending: "Pendente",
    cancelled: "Cancelado",
};

export function SummaryPanel({
    recent,
    revenue,
    completedCount,
}: {
    recent: Appointment[];
    revenue: number;
    completedCount: number;
}) {
    return (
        <div className="panel">
            <div className="panelTitle">
                <div>
                    <small>ATENDIMENTOS RECENTES</small>
                    <span className="metricDescription">
                        {completedCount} concluídos · {currency.format(revenue)} faturados
                    </span>
                </div>
                <a href="/dashboard?view=agenda">Ver agenda</a>
            </div>

            {recent.length === 0 ? (
                <p className="empty">Nenhum atendimento por aqui ainda.</p>
            ) : (
                <div className="appointments">
                    {recent.map((item) => {
                        // service name field assumed — adjust if your Appointment type differs
                        const serviceName =
                            (item as unknown as { service?: { name?: string } }).service?.name ?? "Serviço";
                        const variant = statusVariant(item.status);

                        return (
                            <article key={item.id}>
                                <span className="avatar">{initials(item.client.name)}</span>
                                <div>
                                    <b>{item.client.name}</b>
                                    <small>{serviceName}</small>
                                </div>
                                <time>{timeText.format(new Date(item.scheduledAt))}</time>
                                <strong>{currency.format(Number(item.price || 0))}</strong>
                                <em className="status" data-status={variant}>
                                    {STATUS_LABEL[variant]}
                                </em>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}