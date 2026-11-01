import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDashboardModalsStore } from "../../_shared/stores/dashboard-modals.store";
import { DashboardModals } from "./DashboardModals";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("@/services/service", () => ({
  createService: vi.fn(),
  findProfessionalServices: vi.fn().mockResolvedValue([]),
}));
vi.mock("@/services/professional", () => ({
  createProfessionalAccount: vi.fn(),
  findAllProfessionals: vi.fn().mockResolvedValue([]),
}));

describe("DashboardModals", () => {
  beforeEach(() => {
    useDashboardModalsStore.setState(useDashboardModalsStore.getInitialState());
  });

  it("abre o modal pedido pela store e fecha pelo botão", async () => {
    const user = userEvent.setup();
    render(<DashboardModals services={[]} appointments={[]} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => useDashboardModalsStore.getState().openModal("service"));
    expect(
      screen.getByRole("dialog", { name: "Novo serviço" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(useDashboardModalsStore.getState().activeModal).toBeNull();
  });
});
