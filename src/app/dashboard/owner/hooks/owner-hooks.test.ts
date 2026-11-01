import type { FormEvent } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { updateAppointmentStatus } from "@/services/appointment";
import { createService } from "@/services/service";
import {
  canCompleteAppointment,
  useCompleteAppointment,
} from "./use-complete-appointment";
import { parseServicePrice, useNewServiceModal } from "./use-new-service-modal";
import { useTopbarSearch } from "./use-topbar-search";

const router = { push: vi.fn(), refresh: vi.fn() };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/services/appointment", () => ({ updateAppointmentStatus: vi.fn() }));
vi.mock("@/services/service", () => ({ createService: vi.fn() }));

const formEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;
const PERSISTED_ID = "4f5c1b0e-9a7d-4c1e-8b2a-123456789abc";

describe("useTopbarSearch", () => {
  beforeEach(() => vi.clearAllMocks());

  it("filtra, navega e limpa a busca ao escolher um atalho", () => {
    const { result } = renderHook(() => useTopbarSearch(["Barba"]));

    act(() => result.current.change("barba"));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.matches.map((item) => item.label)).toEqual(["Barba"]);

    act(() => result.current.select(result.current.matches[0]!));
    expect(router.push).toHaveBeenCalledWith("/dashboard?view=catalogo");
    expect(result.current.query).toBe("");
    expect(result.current.isOpen).toBe(false);
  });

  it("fecha com Esc", () => {
    const { result } = renderHook(() => useTopbarSearch([]));

    act(() => result.current.open());
    act(() => result.current.closeOnEscape("Escape"));

    expect(result.current.isOpen).toBe(false);
  });
});

describe("useCompleteAppointment", () => {
  beforeEach(() => vi.clearAllMocks());

  it("só permite concluir agendamentos salvos e em aberto", () => {
    expect(canCompleteAppointment(PERSISTED_ID, "PENDING")).toBe(true);
    expect(canCompleteAppointment(PERSISTED_ID, "COMPLETED")).toBe(false);
    expect(canCompleteAppointment("tmp-1", "PENDING")).toBe(false);
  });

  it("conclui e atualiza a página", async () => {
    vi.mocked(updateAppointmentStatus).mockResolvedValue({} as never);
    const { result } = renderHook(() => useCompleteAppointment(PERSISTED_ID));

    await act(() => result.current.complete());

    expect(updateAppointmentStatus).toHaveBeenCalledWith(
      PERSISTED_ID,
      "COMPLETED",
    );
    expect(router.refresh).toHaveBeenCalled();
    expect(result.current.pending).toBe(false);
  });

  it("sinaliza a falha sem quebrar a tela", async () => {
    vi.mocked(updateAppointmentStatus).mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useCompleteAppointment(PERSISTED_ID));

    await act(() => result.current.complete());

    expect(result.current.failed).toBe(true);
    expect(router.refresh).not.toHaveBeenCalled();
  });
});

describe("useNewServiceModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("converte preço com vírgula", () => {
    expect(parseServicePrice("45,90")).toBe(45.9);
  });

  it("valida os campos obrigatórios antes de chamar a API", async () => {
    const { result } = renderHook(() =>
      useNewServiceModal({ isOpen: true, onClose: vi.fn() }),
    );

    await act(() => result.current.submit(formEvent()));

    expect(createService).not.toHaveBeenCalled();
    expect(result.current.error).toBe(
      "Preencha o nome, o preço e a duração do serviço.",
    );
  });

  it("cria o serviço, mostra sucesso e fecha o modal", async () => {
    vi.mocked(createService).mockResolvedValue({} as never);
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useNewServiceModal({ isOpen: true, onClose }),
    );

    act(() => {
      result.current.updateField("name", "  Barba  ");
      result.current.updateField("price", "35,5");
    });
    await act(() => result.current.submit(formEvent()));

    expect(createService).toHaveBeenCalledWith({
      name: "Barba",
      description: undefined,
      price: 35.5,
      duration: 45,
      category: "Cortes",
    });
    expect(result.current.success).toBe(true);

    act(() => vi.advanceTimersByTime(900));
    expect(onClose).toHaveBeenCalled();
    expect(router.refresh).toHaveBeenCalled();
    expect(result.current.form.name).toBe("");
  });

  it("trava o scroll e fecha com Esc enquanto aberto", () => {
    const onClose = vi.fn();
    renderHook(() => useNewServiceModal({ isOpen: true, onClose }));

    expect(document.body.style.overflow).toBe("hidden");
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(onClose).toHaveBeenCalled();
  });
});
