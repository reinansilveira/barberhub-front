import { NewAppointmentModal } from "../../owner/components/NewAppointmentModal";
import { useClientBookingModal } from "../hooks/use-client-booking-modal";

type ClientBookingModalProps = {
  clientId: string;
  onCreated: () => void;
};

export function ClientBookingModal({
  clientId,
  onCreated,
}: ClientBookingModalProps) {
  const { isOpen, close, reschedulingAppointment } = useClientBookingModal();

  return (
    <NewAppointmentModal
      key={reschedulingAppointment?.id ?? "new-appointment"}
      isOpen={isOpen}
      onClose={close}
      onCreated={onCreated}
      services={[]}
      appointments={[]}
      clientId={clientId}
      rescheduleAppointment={
        reschedulingAppointment
          ? {
              id: reschedulingAppointment.id,
              professionalId: reschedulingAppointment.professional.id,
              serviceId: reschedulingAppointment.service.id,
            }
          : undefined
      }
    />
  );
}
