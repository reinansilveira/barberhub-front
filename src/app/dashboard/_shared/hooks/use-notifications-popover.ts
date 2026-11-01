import { useEffect, useState } from "react";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { Notification } from "@/services/notification";

type NotificationsPopoverOptions = {
  initialNotifications?: Notification[];
  fetchNotifications?: () => Promise<Notification[]>;
  markAsRead: (id: string) => Promise<unknown>;
};

export const notificationDateText = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const markRead = (notification: Notification): Notification => ({
  ...notification,
  readAt: notification.readAt ?? new Date().toISOString(),
});

export function useNotificationsPopover({
  initialNotifications = [],
  fetchNotifications,
  markAsRead,
}: NotificationsPopoverOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [loaded, setLoaded] = useState(!fetchNotifications);
  const [loading, setLoading] = useState(Boolean(fetchNotifications));
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState(0);
  const close = () => setIsOpen(false);
  const containerRef = useOutsideClick(close);
  useEscapeKey(close, isOpen);

  useEffect(() => {
    if (!fetchNotifications) return;
    let isCurrentRequest = true;

    fetchNotifications()
      .then((items) => {
        if (isCurrentRequest) setNotifications(items);
      })
      .catch(() => {
        if (isCurrentRequest) {
          setError("Não foi possível carregar as notificações.");
        }
      })
      .finally(() => {
        if (!isCurrentRequest) return;
        setLoaded(true);
        setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [fetchNotifications, requestId]);

  const reload = () => {
    setLoading(true);
    setError("");
    setRequestId((current) => current + 1);
  };

  const readNotification = async (id: string) => {
    const current = notifications.find((item) => item.id === id);
    if (!current || current.readAt) return;

    setNotifications((items) =>
      items.map((item) => (item.id === id ? markRead(item) : item)),
    );
    try {
      await markAsRead(id);
    } catch {
      setNotifications((items) =>
        items.map((item) => (item.id === id ? current : item)),
      );
    }
  };

  const readAllNotifications = async () => {
    const unread = notifications.filter((item) => !item.readAt);
    if (!unread.length) return;

    const previousNotifications = notifications;
    setError("");
    setNotifications((items) => items.map(markRead));
    try {
      await Promise.all(unread.map((item) => markAsRead(item.id)));
    } catch {
      setNotifications(previousNotifications);
      setError("Não foi possível atualizar todas as notificações.");
    }
  };

  return {
    containerRef,
    error,
    isOpen,
    loaded,
    loading,
    notifications,
    readAllNotifications,
    readNotification,
    retry: reload,
    toggle: () => {
      if (!isOpen && fetchNotifications) reload();
      setIsOpen(!isOpen);
    },
    unreadCount: notifications.filter((item) => !item.readAt).length,
  };
}
