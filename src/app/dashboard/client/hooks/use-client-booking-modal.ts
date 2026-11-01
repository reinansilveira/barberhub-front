import type { ClientDashboardAppointment } from "@/services/client";
import {
  useDashboardModal,
  useOpenDashboardModal,
} from "../../_shared/stores/dashboard-modals.store";
import { useClientDashboardStore } from "../stores/client-dashboard.store";

export function useClientBookingModal() {
  const openModal = useOpenDashboardModal();
  const { isOpen, closeModal } = useDashboardModal("appointment");
  const reschedulingAppointment = useClientDashboardStore(
    (state) => state.reschedulingAppointment,
  );
  const setReschedulingAppointment = useClientDashboardStore(
    (state) => state.setReschedulingAppointment,
  );

  return {
    isOpen,
    reschedulingAppointment,
    openBooking: () => {
      setReschedulingAppointment(null);
      openModal("appointment");
    },
    openReschedule: (appointment: ClientDashboardAppointment) => {
      setReschedulingAppointment(appointment);
      openModal("appointment");
    },
    close: () => {
      closeModal();
      setReschedulingAppointment(null);
    },
  };
}
