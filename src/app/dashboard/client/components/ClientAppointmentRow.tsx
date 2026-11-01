import type { ClientDashboardAppointment } from "@/services/client";
import { cn } from "@/utils/class-names";
import { currency, timeText } from "../../_shared/dashboard.utils";
import {
  appointmentStatusLabel,
  getAppointmentDateBadge,
  isCancelledAppointment,
} from "../client-dashboard.utils";

type ClientAppointmentRowProps = {
  appointment: ClientDashboardAppointment;
  cancelling?: boolean;
  onCancel?: (appointment: ClientDashboardAppointment) => void;
  onReschedule?: (appointment: ClientDashboardAppointment) => void;
};

export function ClientAppointmentRow({
  appointment,
  cancelling,
  onCancel,
  onReschedule,
}: ClientAppointmentRowProps) {
  const dateBadge = getAppointmentDateBadge(appointment.scheduledAt);

  return (
    <article className="member-list__row">
      <b className="client-account__date">
        <small>{dateBadge.month}</small>
        {dateBadge.day}
      </b>
      <div>
        <h3>{appointment.service.name}</h3>
        <p>
          {appointment.professional.user.name} ·{" "}
          {timeText.format(new Date(appointment.scheduledAt))}
        </p>
      </div>
      <strong>{currency.format(Number(appointment.price || 0))}</strong>
      <span
        className={cn(
          "member-status",
          isCancelledAppointment(appointment.status)
            ? "member-status--danger"
            : "member-status--success",
        )}
      >
        {appointmentStatusLabel(appointment.status)}
      </span>
      {onReschedule && (
        <button
          type="button"
          className="member-button"
          onClick={() => onReschedule(appointment)}
        >
          Remarcar
        </button>
      )}
      {onCancel && (
        <button
          type="button"
          className="client-account__cancel"
          disabled={cancelling}
          onClick={() => onCancel(appointment)}
        >
          {cancelling ? "Cancelando..." : "Cancelar"}
        </button>
      )}
    </article>
  );
}
