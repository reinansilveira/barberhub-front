import { useState } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  cancelClientAppointment,
  type ClientDashboardAppointment,
} from "@/services/client";
import { useClientDashboardStore } from "../stores/client-dashboard.store";

export function useCancelClientAppointment(
  onFeedback: (message: string) => void,
) {
  const updateAppointment = useClientDashboardStore(
    (state) => state.updateAppointment,
  );
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const cancelAppointment = async (appointment: ClientDashboardAppointment) => {
    if (!window.confirm("Deseja cancelar este agendamento?")) return;

    setCancellingId(appointment.id);
    onFeedback("");
    try {
      updateAppointment(await cancelClientAppointment(appointment.id));
      onFeedback("Agendamento cancelado com sucesso.");
    } catch (error) {
      onFeedback(
        apiErrorMessage(error, "Não foi possível cancelar o agendamento."),
      );
    } finally {
      setCancellingId(null);
    }
  };

  return { cancelAppointment, cancellingId };
}
