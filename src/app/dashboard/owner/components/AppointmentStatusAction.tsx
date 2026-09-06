"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateAppointmentStatus,
  type AppointmentStatus,
} from "@/services/appointment";

export function AppointmentStatusAction({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  if (!id || id.length < 20 || status === "COMPLETED" || status === "CANCELLED") {
    return null;
  }

  async function complete() {
    setPending(true);
    try {
      await updateAppointmentStatus(id, "COMPLETED" as AppointmentStatus);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" onClick={complete} disabled={pending}>
      {pending ? "Salvando…" : "Concluir"}
    </button>
  );
}
