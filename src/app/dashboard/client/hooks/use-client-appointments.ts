import { useState } from "react";
import { useClientDashboardData } from "../stores/client-dashboard.store";
import { useCancelClientAppointment } from "./use-cancel-client-appointment";
import { useClientBookingModal } from "./use-client-booking-modal";

export function useClientAppointments() {
  const { appointments } = useClientDashboardData();
  const [feedback, setFeedback] = useState("");
  const { cancelAppointment, cancellingId } =
    useCancelClientAppointment(setFeedback);
  const { openReschedule } = useClientBookingModal();

  return {
    appointments,
    cancelAppointment,
    cancellingId,
    feedback,
    openReschedule,
  };
}
