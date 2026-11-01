type Status = "completed" | "pending" | "cancelled" | string;

export function AppointmentStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const key = normalized as Status;
  const label = normalized.includes("cancel")
    ? "Cancelado"
    : normalized.includes("complete") || normalized.includes("confirm")
      ? "Concluído"
      : "Pendente";

  return (
    <span className={`status-badge status-badge--${key}`}>
      <span className="status-badge__dot" />
      {label}
    </span>
  );
}
