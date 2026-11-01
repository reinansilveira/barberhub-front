import { useEffect, useState } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  getClientAccountDetails,
  updateClientNotificationPreferences,
  type ClientAccountDetails,
  type ClientNotificationPreferences,
} from "@/services/client-account";

export function useClientAccountDetails() {
  const [details, setDetails] = useState<ClientAccountDetails | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    getClientAccountDetails()
      .then((value) => {
        if (!isCurrentRequest) return;
        setDetails(value);
        setError("");
      })
      .catch((requestError) => {
        if (!isCurrentRequest) return;
        setError(
          apiErrorMessage(
            requestError,
            "Não foi possível carregar os dados da sua conta.",
          ),
        );
      })
      .finally(() => isCurrentRequest && setLoading(false));

    return () => {
      isCurrentRequest = false;
    };
  }, [requestId]);

  const updatePreferences = async (
    preference: keyof ClientNotificationPreferences,
    value: boolean,
  ) => {
    if (!details) return;

    const previousPreferences = details.notificationPreferences;
    const nextPreferences = { ...previousPreferences, [preference]: value };
    setDetails({ ...details, notificationPreferences: nextPreferences });
    setSavingPreferences(true);
    setError("");

    try {
      const updated = await updateClientNotificationPreferences({
        [preference]: value,
      });
      setDetails((current) =>
        current ? { ...current, notificationPreferences: updated } : current,
      );
    } catch (requestError) {
      setDetails((current) =>
        current
          ? { ...current, notificationPreferences: previousPreferences }
          : current,
      );
      setError(
        apiErrorMessage(
          requestError,
          "Não foi possível atualizar as preferências.",
        ),
      );
    } finally {
      setSavingPreferences(false);
    }
  };

  return {
    details,
    error,
    loading,
    retry: () => {
      setLoading(true);
      setError("");
      setRequestId((current) => current + 1);
    },
    savingPreferences,
    updatePreferences,
  };
}
