import { api } from "./api/axios";

export type ClientNotificationPreferences = {
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
};

export type ClientLoyalty = {
  completedAppointments: number;
  totalSpent: number;
  lastCompletedAt: string | null;
  reward: null;
};

export type ClientPaymentMethod = {
  id: string;
  brand?: string | null;
  last4?: string | null;
  expiresAt?: string | null;
};

export type ClientAccountDetails = {
  loyalty: ClientLoyalty;
  paymentMethods: ClientPaymentMethod[];
  notificationPreferences: ClientNotificationPreferences;
};

export async function getClientAccountDetails(): Promise<ClientAccountDetails> {
  const [loyalty, paymentMethods, notificationPreferences] = await Promise.all([
    api
      .get<ClientLoyalty>("/client-account/me/loyalty")
      .then((response) => response.data),
    api
      .get<ClientPaymentMethod[]>("/client-account/me/payment-methods")
      .then((response) => response.data),
    api
      .get<ClientNotificationPreferences>(
        "/client-account/me/notification-preferences",
      )
      .then((response) => response.data),
  ]);

  return { loyalty, paymentMethods, notificationPreferences };
}

export async function updateClientNotificationPreferences(
  payload: Partial<ClientNotificationPreferences>,
) {
  const { data } = await api.patch<ClientNotificationPreferences>(
    "/client-account/me/notification-preferences",
    payload,
  );

  return data;
}
