import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cancelClientAppointment } from "@/services/client";
import { makeClientAppointment, makeClientDashboard } from "@/test/factories";
import { useDashboardModalsStore } from "../../_shared/stores/dashboard-modals.store";
import { useClientDashboardStore } from "../stores/client-dashboard.store";
import { useCancelClientAppointment } from "./use-cancel-client-appointment";
import { useClientBookingModal } from "./use-client-booking-modal";

vi.mock("@/services/client", () => ({
  cancelClientAppointment: vi.fn(),
  getClientDashboard: vi.fn(),
}));

const cancelRequest = vi.mocked(cancelClientAppointment);
const appointment = makeClientAppointment();

describe("client dashboard hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    useDashboardModalsStore.setState(useDashboardModalsStore.getInitialState());
    useClientDashboardStore.setState({
      ...useClientDashboardStore.getInitialState(),
      data: makeClientDashboard(),
    });
  });

  it("cancela o agendamento, atualiza a store e informa o resultado", async () => {
    cancelRequest.mockResolvedValue({ ...appointment, status: "CANCELLED" });
    const onFeedback = vi.fn();
    const { result } = renderHook(() => useCancelClientAppointment(onFeedback));

    await act(() => result.current.cancelAppointment(appointment));

    expect(cancelRequest).toHaveBeenCalledWith(appointment.id);
    expect(
      useClientDashboardStore.getState().data?.appointments[0]?.status,
    ).toBe("CANCELLED");
    expect(onFeedback).toHaveBeenLastCalledWith(
      "Agendamento cancelado com sucesso.",
    );
    expect(result.current.cancellingId).toBeNull();
  });

  it("não cancela sem confirmação", async () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    const { result } = renderHook(() => useCancelClientAppointment(vi.fn()));

    await act(() => result.current.cancelAppointment(appointment));

    expect(cancelRequest).not.toHaveBeenCalled();
  });

  it("mostra o erro da API quando o cancelamento falha", async () => {
    cancelRequest.mockRejectedValue(new Error("offline"));
    const onFeedback = vi.fn();
    const { result } = renderHook(() => useCancelClientAppointment(onFeedback));

    await act(() => result.current.cancelAppointment(appointment));

    expect(onFeedback).toHaveBeenLastCalledWith(
      "Não foi possível cancelar o agendamento.",
    );
  });

  it("abre o modal para remarcar e limpa a remarcação ao fechar", () => {
    const { result } = renderHook(() => useClientBookingModal());

    act(() => result.current.openReschedule(appointment));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.reschedulingAppointment).toBe(appointment);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.reschedulingAppointment).toBeNull();

    act(() => result.current.openBooking());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.reschedulingAppointment).toBeNull();
  });
});
