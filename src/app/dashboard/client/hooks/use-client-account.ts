import { useMemo, useState } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import { updateClient } from "@/services/client";
import { normalizeBrazilianPhone } from "@/utils/phone";
import { buildAccountSummary } from "../client-dashboard.utils";
import {
  useClientDashboardData,
  useClientDashboardStore,
} from "../stores/client-dashboard.store";
import { useCancelClientAppointment } from "./use-cancel-client-appointment";
import { useClientBookingModal } from "./use-client-booking-modal";

type ClientProfileField = "name" | "email" | "phone";

export const CLIENT_PROFILE_FORM_ID = "client-profile-form";

export function useClientAccount() {
  const { client, appointments } = useClientDashboardData();
  const updateStoredClient = useClientDashboardStore(
    (state) => state.updateClient,
  );
  const [form, setForm] = useState({
    name: client.name,
    email: client.email ?? "",
    phone: normalizeBrazilianPhone(client.phone ?? ""),
  });
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const { cancelAppointment, cancellingId } =
    useCancelClientAppointment(setFeedback);
  const { openReschedule } = useClientBookingModal();

  const summary = useMemo(
    () => buildAccountSummary(appointments, new Date()),
    [appointments],
  );

  const focusProfileForm = () => {
    const formElement = document.getElementById(CLIENT_PROFILE_FORM_ID);
    formElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => formElement?.querySelector("input")?.focus(), 350);
  };

  const setFormField = (field: ClientProfileField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setFeedback("Informe nome e telefone.");
      return;
    }

    setSaving(true);
    setFeedback("");
    try {
      const nextPhone = normalizeBrazilianPhone(form.phone);
      const phoneChanged =
        nextPhone !== normalizeBrazilianPhone(client.phone ?? "");
      updateStoredClient(
        await updateClient(client.id, {
          name: form.name.trim(),
          phone: nextPhone,
          email: form.email.trim() || undefined,
        }),
      );
      setFeedback(
        phoneChanged
          ? "Telefone atualizado. Por segurança, entre novamente para continuar."
          : "Informações atualizadas com sucesso.",
      );

      if (phoneChanged) {
        window.setTimeout(() => window.location.assign("/login"), 1200);
      }
    } catch (error) {
      setFeedback(
        apiErrorMessage(error, "Não foi possível atualizar seus dados."),
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    ...summary,
    appointmentsCount: appointments.length,
    cancelAppointment,
    cancellingId,
    client,
    feedback,
    focusProfileForm,
    form,
    openReschedule,
    saveProfile,
    saving,
    setFormField,
  };
}
