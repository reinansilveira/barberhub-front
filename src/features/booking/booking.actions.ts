"use server";

import { redirect } from "next/navigation";
import { apiErrorMessage } from "@/services/api/api-error";
import { buildSuccessPath, toBookingQuery } from "@/utils/booking.utils";
import { bookingFormSchema } from "./booking.schemas";
import { createBooking } from "./booking.service";

const field = (formData: FormData, name: string) =>
  String(formData.get(name) ?? "").trim() || undefined;

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

  let errorMessage: string | null = null;
  try {
    await createBooking(parsed.data);
  } catch (error) {
    errorMessage = apiErrorMessage(
      error,
      "Não foi possível concluir o agendamento. Tente outro horário.",
    );
  }

  if (errorMessage) {
    redirect(
      `${returnPath}?${baseQuery}&error=${encodeURIComponent(errorMessage)}`,
    );
  }

  redirect(
    buildSuccessPath({
      service: field(formData, "serviceName"),
      professional: field(formData, "professionalName"),
      date: field(formData, "dateLabel"),
      time: field(formData, "timeLabel"),
    }),
  );
}
