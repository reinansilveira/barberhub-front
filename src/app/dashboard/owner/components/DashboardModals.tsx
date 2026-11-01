"use client";

import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import { useDashboardModal } from "../../_shared/stores/dashboard-modals.store";
import { NewAppointmentModal } from "./NewAppointmentModal";
import { NewBarberModal } from "./NewBarberModal";
import { NewServiceModal } from "./NewServiceModal";

type DashboardModalsProps = {
  services: Service[];
  appointments: Appointment[];
};

export const DashboardModals = ({
  services,
  appointments,
}: DashboardModalsProps) => {
  const appointmentModal = useDashboardModal("appointment");
  const serviceModal = useDashboardModal("service");
  const barberModal = useDashboardModal("barber");

  return (
    <>
      <NewAppointmentModal
        isOpen={appointmentModal.isOpen}
        onClose={appointmentModal.closeModal}
        services={services}
        appointments={appointments}
      />
      <NewServiceModal
        isOpen={serviceModal.isOpen}
        onClose={serviceModal.closeModal}
      />
      <NewBarberModal
        isOpen={barberModal.isOpen}
        onClose={barberModal.closeModal}
      />
    </>
  );
};
