import { Bell } from "lucide-react";
import {
  getClientNotifications,
  markClientNotificationAsRead,
} from "@/services/notification";
import { cn } from "@/utils/class-names";
import {
  notificationDateText,
  useNotificationsPopover,
} from "../../_shared/hooks/use-notifications-popover";

export function ClientNotificationPopover() {
  const { containerRef, ...notifications } = useNotificationsPopover({
    fetchNotifications: getClientNotifications,
    markAsRead: markClientNotificationAsRead,
  });

  return (
    <div className="client-notifications" ref={containerRef}>
      <button
        type="button"
        className="client-notifications__trigger"
        aria-label={`Notificações${notifications.unreadCount ? `, ${notifications.unreadCount} não lidas` : ""}`}
        aria-expanded={notifications.isOpen}
        aria-controls="client-notifications-popover"
        onClick={notifications.toggle}
      >
        <Bell aria-hidden="true" />
        {notifications.unreadCount > 0 && (
          <span>{notifications.unreadCount}</span>
        )}
      </button>
      {notifications.isOpen && (
        <section
          className="client-notifications__popover"
          id="client-notifications-popover"
          aria-label="Notificações"
          role="dialog"
        >
          <header className="client-notifications__heading">
            <h2>Notificações</h2>
            <button
              type="button"
              disabled={!notifications.unreadCount}
              onClick={notifications.readAllNotifications}
            >
              Marcar todas como lidas
            </button>
          </header>
          <div className="client-notifications__list">
            {!notifications.loaded ||
            (notifications.loading && !notifications.notifications.length) ? (
              <p className="client-notifications__empty">
                Carregando notificações...
              </p>
            ) : notifications.error ? (
              <div className="client-notifications__state" role="status">
                <p>{notifications.error}</p>
                <button type="button" onClick={notifications.retry}>
                  Tentar novamente
                </button>
              </div>
            ) : notifications.notifications.length ? (
              notifications.notifications.map((notification) => (
                <button
                  type="button"
                  className={cn(
                    "client-notifications__item",
                    !notification.readAt &&
                      "client-notifications__item--unread",
                  )}
                  key={notification.id}
                  onClick={() =>
                    notifications.readNotification(notification.id)
                  }
                >
                  <span
                    className="client-notifications__dot"
                    aria-hidden="true"
                  />
                  <span className="client-notifications__content">
                    <b>{notification.subject || notification.message}</b>
                    {notification.subject && (
                      <small>{notification.message}</small>
                    )}
                    <time>
                      {notificationDateText.format(
                        new Date(notification.createdAt),
                      )}
                    </time>
                  </span>
                </button>
              ))
            ) : (
              <p className="client-notifications__empty">
                Nenhuma notificação no momento.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
