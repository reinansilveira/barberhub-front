import { describe, expect, it } from "vitest";
import { bookingFiltersSchema, bookingFormSchema } from "./booking.schemas";

const ids = {
  professionalId: "11111111-1111-4111-8111-111111111111",
  serviceId: "22222222-2222-4222-8222-222222222222",
  slotId: "33333333-3333-4333-8333-333333333333",
};

describe("booking schemas", () => {
  it("normaliza telefone e aceita um agendamento completo", () => {
    const result = bookingFormSchema.parse({
      ...ids,
      name: "  Ana Silva  ",
      phone: "(11) 99876-5432",
      email: "ana@example.com",
    });

    expect(result.name).toBe("Ana Silva");
    expect(result.phone).toBe("11998765432");
  });

  it("rejeita identificadores e telefone inválidos", () => {
    const result = bookingFormSchema.safeParse({
      ...ids,
      slotId: "invalido",
      name: "A",
      phone: "123",
      email: "sem-email",
    });

    expect(result.success).toBe(false);
  });

  it("aceita filtros vazios e datas ISO válidas", () => {
    expect(bookingFiltersSchema.parse({})).toEqual({});
    expect(
      bookingFiltersSchema.parse({
        professionalId: ids.professionalId,
        date: "2026-10-31",
      }),
    ).toMatchObject({ date: "2026-10-31" });
  });
});
