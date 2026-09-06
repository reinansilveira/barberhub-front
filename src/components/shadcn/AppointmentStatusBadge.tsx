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
    <span className={`statusBadge statusBadge--${key}`}>
      <span className="statusBadge__dot" />
      {label}
    </span>
  );
}
