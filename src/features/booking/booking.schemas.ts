import { z } from "zod";

const id = z.string().uuid("Selecione uma opção válida.");

export const bookingFiltersSchema = z.object({
  professionalId: id.optional(),
  serviceId: id.optional(),
  date: z.string().date("Informe uma data válida.").optional(),
});

export const bookingFormSchema = z.object({
  professionalId: id,
  serviceId: id,
  slotId: id,
  name: z.string().trim().min(2, "Informe seu nome."),
  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(z.string().regex(/^\d{10,11}$/, "Use 10 ou 11 dígitos no telefone.")),
  email: z.string().trim().email("Informe um e-mail válido."),
  notes: z.string().trim().max(500).optional(),
});
