import { useState, type ChangeEvent } from "react";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { apiErrorMessage } from "@/services/api/api-error";
import { updateClientAvatar } from "@/services/client";
import { prepareAvatar } from "@/utils/avatar";
import {
  useClientDashboardData,
  useClientDashboardStore,
} from "../stores/client-dashboard.store";

export function useClientAvatarModal() {
  const { client } = useClientDashboardData();
  const updateStoredClient = useClientDashboardStore(
    (state) => state.updateClient,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const close = () => {
    setIsOpen(false);
    setPreview(null);
    setError("");
  };

  useEscapeKey(close, isOpen);

  const chooseImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    try {
      setPreview(await prepareAvatar(file));
    } catch (reason) {
      setPreview(null);
      setError(reason instanceof Error ? reason.message : "Imagem inválida.");
    } finally {
      event.target.value = "";
    }
  };

  const save = async () => {
    if (!preview) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateClientAvatar(client.id, preview);
      updateStoredClient({ ...updated, avatar: preview });
      close();
    } catch (reason) {
      setError(apiErrorMessage(reason, "Não foi possível salvar sua foto."));
    } finally {
      setSaving(false);
    }
  };

  return {
    avatar: preview || client.avatar || undefined,
    chooseImage,
    clientName: client.name,
    close,
    error,
    isOpen,
    open: () => setIsOpen(true),
    preview,
    save,
    saving,
  };
}
