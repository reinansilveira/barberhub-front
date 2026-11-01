import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getClientNotifications,
  markClientNotificationAsRead,
} from "@/services/notification";
import { makeNotification } from "@/test/factories";
import { ClientNotificationPopover } from "./ClientNotificationPopover";

vi.mock("@/services/notification", () => ({
  getClientNotifications: vi.fn(),
  markClientNotificationAsRead: vi.fn(),
}));

describe("ClientNotificationPopover", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getClientNotifications).mockResolvedValue([
      makeNotification(),
      makeNotification({
        id: "notification-2",
        subject: null,
        message: "Lembrete do seu horário",
        readAt: "2026-11-01T13:00:00.000Z",
      }),
    ]);
    vi.mocked(markClientNotificationAsRead).mockResolvedValue({} as never);
  });

  it("mostra o total de não lidas e marca uma notificação ao clicar", async () => {
    const user = userEvent.setup();
    render(<ClientNotificationPopover />);

    const trigger = await screen.findByRole("button", {
      name: "Notificações, 1 não lidas",
    });
    await user.click(trigger);

    const popover = await screen.findByRole("dialog", { name: "Notificações" });
    const unread = await within(popover).findByRole("button", {
      name: /Agendamento confirmado/,
    });
    expect(unread).toHaveClass("client-notifications__item--unread");

    await user.click(unread);

    expect(markClientNotificationAsRead).toHaveBeenCalledWith("notification-1");
    expect(unread).not.toHaveClass("client-notifications__item--unread");
    expect(
      screen.getByRole("button", { name: "Notificações" }),
    ).toBeInTheDocument();
  });

  it("fecha ao clicar fora", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ClientNotificationPopover />
        <p>conteúdo da página</p>
      </>,
    );

    await user.click(
      await screen.findByRole("button", { name: /Notificações/ }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByText("conteúdo da página"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
