import { Bell } from "lucide-react";
import {
  markNotificationAsRead,
  type Notification,
} from "@/services/notification";
import { cn } from "@/utils/class-names";
import {
  notificationDateText,
  useNotificationsPopover,
} from "../../_shared/hooks/use-notifications-popover";

export const TopbarNotifications = ({
  initialNotifications,
}: {
  initialNotifications: Notification[];
}) => {
  const { containerRef, ...notifications } = useNotificationsPopover({
    initialNotifications,
    markAsRead: markNotificationAsRead,
  });

  return (
    <div className="dashboard-topbar__notifications" ref={containerRef}>
      <button
        type="button"
        className="dashboard-topbar__notifications-trigger"
        aria-label={`Notificações${notifications.unreadCount ? `, ${notifications.unreadCount} não lidas` : ""}`}
        aria-expanded={notifications.isOpen}
        onClick={notifications.toggle}
      >
        <Bell aria-hidden="true" />
        {notifications.unreadCount > 0 && (
          <span>{notifications.unreadCount}</span>
        )}
      </button>
      {notifications.isOpen && (
        <div
          className="dashboard-topbar__notifications-popover"
          role="dialog"
          aria-label="Notificações"
        >
          <div className="dashboard-topbar__notifications-heading">
            <h2>Notificações</h2>
            <button
              type="button"
              onClick={notifications.readAllNotifications}
              disabled={!notifications.unreadCount}
            >
              Marcar todas como lidas
            </button>
          </div>
          <div className="dashboard-topbar__notifications-list">
            {notifications.notifications.length === 0 && (
              <p className="dashboard-topbar__notifications-empty">
                Nenhuma notificação no momento.
              </p>
            )}
            {notifications.notifications.map((notification) => (
              <button
                type="button"
                className={cn(
                  "dashboard-topbar__notification",
                  !notification.readAt &&
                    "dashboard-topbar__notification--unread",
                )}
                key={notification.id}
                onClick={() => notifications.readNotification(notification.id)}
              >
                <span
                  className="dashboard-topbar__notification-dot"
                  aria-hidden="true"
                />
                <span>
                  <b>{notification.subject || notification.message}</b>
                  {notification.subject && (
                    <span className="dashboard-topbar__notification-message">
                      {notification.message}
                    </span>
                  )}
                  <time>
                    {notificationDateText.format(
                      new Date(notification.createdAt),
                    )}
                  </time>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
