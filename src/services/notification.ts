import { api } from "./api/axios";

export type NotificationStatus =
  "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "READ";

export type Notification = {
  id: string;
  recipient: string;
  type: "EMAIL" | "SMS" | "WHATSAPP" | "PUSH";
  subject?: string | null;
  message: string;
  status: NotificationStatus;
  createdAt: string;
  sentAt?: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;
};

export async function getClientNotifications() {
  const { data } = await api.get<Notification[]>("/notifications/me");
  return data;
}

export async function markClientNotificationAsRead(id: string) {
  const { data } = await api.patch<Notification>(
    `/notifications/me/${id}/status`,
    {
      status: "READ",
    },
  );
  return data;
}

export async function markNotificationAsRead(id: string) {
  const { data } = await api.patch<Notification>(
    `/notifications/${id}/status`,
    {
      status: "READ",
    },
  );
  return data;
}
