import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeNotification } from "@/test/factories";
import { useNotificationsPopover } from "./use-notifications-popover";

const unread = makeNotification();
const read = makeNotification({ id: "notification-2", readAt: "2026-11-01" });

describe("useNotificationsPopover", () => {
  it("marca como lida de forma otimista e desfaz se a API falhar", async () => {
    let failRequest: (reason: Error) => void = () => {};
    const markAsRead = vi.fn(
      () => new Promise((_, reject) => (failRequest = reject)),
    );
    const { result } = renderHook(() =>
      useNotificationsPopover({
        initialNotifications: [unread, read],
        markAsRead,
      }),
    );

    expect(result.current.unreadCount).toBe(1);

    let request: Promise<void> = Promise.resolve();
    act(() => {
      request = result.current.readNotification(unread.id);
    });
    expect(result.current.unreadCount).toBe(0);

    await act(async () => {
      failRequest(new Error("offline"));
      await request;
    });

    expect(markAsRead).toHaveBeenCalledWith(unread.id);
    expect(result.current.unreadCount).toBe(1);
  });

  it("não chama a API para notificações já lidas", async () => {
    const markAsRead = vi.fn();
    const { result } = renderHook(() =>
      useNotificationsPopover({ initialNotifications: [read], markAsRead }),
    );

    await act(() => result.current.readNotification(read.id));

    expect(markAsRead).not.toHaveBeenCalled();
  });

  it("marca todas como lidas e mostra erro quando alguma falha", async () => {
    const markAsRead = vi
      .fn()
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(() =>
      useNotificationsPopover({
        initialNotifications: [
          unread,
          makeNotification({ id: "notification-3" }),
        ],
        markAsRead,
      }),
    );

    await act(() => result.current.readAllNotifications());

    expect(result.current.unreadCount).toBe(2);
    expect(result.current.error).toBe(
      "Não foi possível atualizar todas as notificações.",
    );
  });

  it("busca as notificações ao montar e de novo ao abrir", async () => {
    const fetchNotifications = vi.fn().mockResolvedValue([unread]);
    const { result } = renderHook(() =>
      useNotificationsPopover({ fetchNotifications, markAsRead: vi.fn() }),
    );

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.notifications).toEqual([unread]);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    await waitFor(() => expect(fetchNotifications).toHaveBeenCalledTimes(2));
  });

  it("informa erro de carregamento e permite tentar de novo", async () => {
    const fetchNotifications = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce([unread]);
    const { result } = renderHook(() =>
      useNotificationsPopover({ fetchNotifications, markAsRead: vi.fn() }),
    );

    await waitFor(() =>
      expect(result.current.error).toBe(
        "Não foi possível carregar as notificações.",
      ),
    );

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.notifications).toEqual([unread]));
    expect(result.current.error).toBe("");
  });

  it("fecha com Esc", () => {
    const { result } = renderHook(() =>
      useNotificationsPopover({ markAsRead: vi.fn() }),
    );

    act(() => result.current.toggle());
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(result.current.isOpen).toBe(false);
  });
});
