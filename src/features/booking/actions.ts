"use server";

import { redirect } from "next/navigation";
import { bookingFormSchema } from "./booking.schemas";
import { createBooking } from "./booking.service";
import { toBookingQuery } from "./booking.utils";

export async function submitBooking(formData: FormData) {
  const parsed = bookingFormSchema.safeParse(Object.fromEntries(formData));
  const requestedReturnPath = String(formData.get("returnPath") ?? "/agendar");
  const returnPath =
    requestedReturnPath === "/agendar" ||
    requestedReturnPath.startsWith("/profissionais/")
      ? requestedReturnPath
      : "/agendar";

  const baseQuery = toBookingQuery({
    professionalId: String(formData.get("professionalId") ?? ""),
    serviceId: String(formData.get("serviceId") ?? ""),
    date: String(formData.get("date") ?? ""),
  });

  if (!parsed.success) {
    redirect(
      `${returnPath}?${baseQuery}&error=${encodeURIComponent(parsed.error.issues[0].message)}`,
    );
  }

  try {
    await createBooking(parsed.data);
    redirect(`${returnPath}?success=1`);
  } catch {
    redirect(
      `${returnPath}?${baseQuery}&error=${encodeURIComponent("Nao foi possivel concluir o agendamento.")}`,
    );
  }
}
