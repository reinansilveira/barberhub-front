import { isOpenAppointment } from "../client-dashboard.utils";
import { useClientAppointments } from "../hooks/use-client-appointments";
import { ClientAppointmentRow } from "./ClientAppointmentRow";

export function ClientAppointmentsList() {
  const list = useClientAppointments();

  return (
    <section className="member-card member-list">
      <div className="member-card__heading">
        <div>
          <h2>Meus agendamentos</h2>
          <p>Acompanhe seus horários.</p>
        </div>
      </div>
      {list.feedback && (
        <p className="member-feedback" role="status">
          {list.feedback}
        </p>
      )}
      {list.appointments.length === 0 ? (
        <p className="empty">Nenhum agendamento encontrado.</p>
      ) : (
        list.appointments.map((appointment) => {
          const canChange = isOpenAppointment(appointment.status);

          return (
            <ClientAppointmentRow
              key={appointment.id}
              appointment={appointment}
              cancelling={list.cancellingId === appointment.id}
              onReschedule={canChange ? list.openReschedule : undefined}
              onCancel={canChange ? list.cancelAppointment : undefined}
            />
          );
        })
      )}
    </section>
  );
}
