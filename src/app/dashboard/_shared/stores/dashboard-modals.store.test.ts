import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  useDashboardModal,
  useDashboardModalsStore,
  useOpenDashboardModal,
} from "./dashboard-modals.store";

describe("dashboard modals store", () => {
  beforeEach(() => {
    useDashboardModalsStore.setState(useDashboardModalsStore.getInitialState());
  });

  it("mantém um único modal aberto por vez", () => {
    const { result: open } = renderHook(() => useOpenDashboardModal());
    const { result: service } = renderHook(() => useDashboardModal("service"));
    const { result: barber } = renderHook(() => useDashboardModal("barber"));

    act(() => open.current("service"));
    expect(service.current.isOpen).toBe(true);
    expect(barber.current.isOpen).toBe(false);

    act(() => open.current("barber"));
    expect(service.current.isOpen).toBe(false);
    expect(barber.current.isOpen).toBe(true);

    act(() => barber.current.closeModal());
    expect(useDashboardModalsStore.getState().activeModal).toBeNull();
  });
});
