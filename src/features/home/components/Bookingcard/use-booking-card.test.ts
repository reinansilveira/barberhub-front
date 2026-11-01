import { act, renderHook, waitFor } from "@testing-library/react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPublicAppointment } from "@/services/appointment";
import { findProfessionalServices } from "@/services/service";
import { findAvailableSlots } from "@/services/slot";
import { useBookingCard } from "./use-booking-card";

const router = { push: vi.fn() };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/services/appointment", () => ({ createPublicAppointment: vi.fn() }));
vi.mock("@/services/service", () => ({ findProfessionalServices: vi.fn() }));
vi.mock("@/services/slot", () => ({ findAvailableSlots: vi.fn() }));
vi.mock("@/utils/date-utils", () => ({ todayInBrazil: () => "2026-11-02" }));

const PROFESSIONAL = "4f5c1b0e-9a7d-4c1e-8b2a-111111111111";
const SERVICE = "4f5c1b0e-9a7d-4c1e-8b2a-222222222222";
const SLOT = "4f5c1b0e-9a7d-4c1e-8b2a-333333333333";

const changeSelect = (
  register: () => UseFormRegisterReturn,
  name: string,
  value: string,
) =>
  act(async () => {
    await register().onChange({ target: { name, value }, type: "change" });
  });

describe("useBookingCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(findProfessionalServices).mockResolvedValue([
      { serviceId: SERVICE, service: { name: "Corte" } },
    ] as never);
    vi.mocked(findAvailableSlots).mockResolvedValue([
      { id: SLOT, startsAt: "2026-11-02T13:00:00.000Z" },
    ] as never);
  });

  it("carrega serviços e horários conforme as escolhas", async () => {
    let resolveSlots: (slots: never) => void = () => {};
    vi.mocked(findAvailableSlots).mockReturnValue(
      new Promise((resolve) => (resolveSlots = resolve)),
    );
    const { result } = renderHook(() => useBookingCard());

    await changeSelect(
      result.current.registerProfessional,
      "professionalId",
      PROFESSIONAL,
    );
    await waitFor(() => expect(result.current.services).toHaveLength(1));
    expect(findProfessionalServices).toHaveBeenCalledWith(PROFESSIONAL);
    expect(result.current.slots).toEqual([]);

    await changeSelect(result.current.registerService, "serviceId", SERVICE);
    expect(result.current.loadingSlots).toBe(true);

    await act(async () => {
      resolveSlots([
        { id: SLOT, startsAt: "2026-11-02T13:00:00.000Z" },
      ] as never);
    });
    await waitFor(() => expect(result.current.slots).toHaveLength(1));
    expect(result.current.loadingSlots).toBe(false);
    expect(findAvailableSlots).toHaveBeenCalledWith(PROFESSIONAL, "2026-11-02");
  });

  it("limpa serviço, horário e data ao trocar de profissional", async () => {
    const { result } = renderHook(() => useBookingCard());

    await changeSelect(
      result.current.registerProfessional,
      "professionalId",
      PROFESSIONAL,
    );
    await changeSelect(result.current.registerService, "serviceId", SERVICE);
    act(() => {
      result.current.form.setValue("slotId", SLOT);
      result.current.showDateOptions();
      result.current.changeDate("2026-11-10");
    });
    expect(result.current.selectedDate).toBe("2026-11-10");

    await changeSelect(
      result.current.registerProfessional,
      "professionalId",
      "outro",
    );

    expect(result.current.form.getValues()).toMatchObject({
      serviceId: "",
      slotId: "",
    });
    expect(result.current.selectedDate).toBe("2026-11-02");
    expect(result.current.showDatePicker).toBe(false);
  });

  it("valida os dados antes de enviar", async () => {
    const { result } = renderHook(() => useBookingCard());

    await act(() =>
      result.current.submit({
        professionalId: PROFESSIONAL,
        serviceId: SERVICE,
        slotId: SLOT,
        name: "Maria",
        phone: "123",
        email: "maria@email.com",
      }),
    );

    expect(createPublicAppointment).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Use 10 ou 11 dígitos no telefone.");
  });

  it("agenda com o telefone normalizado e vai para a página de sucesso", async () => {
    vi.mocked(createPublicAppointment).mockResolvedValue({} as never);
    const { result } = renderHook(() => useBookingCard());

    await act(() =>
      result.current.submit({
        professionalId: PROFESSIONAL,
        serviceId: SERVICE,
        slotId: SLOT,
        name: "Maria",
        phone: "(11) 98765-4321",
        email: "maria@email.com",
      }),
    );

    expect(createPublicAppointment).toHaveBeenCalledWith(
      expect.objectContaining({ phone: "11987654321", slotId: SLOT }),
    );
    expect(router.push).toHaveBeenCalledWith("/success?date=02+de+novembro");
  });
});
